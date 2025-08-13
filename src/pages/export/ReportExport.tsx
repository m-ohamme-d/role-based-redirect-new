import { useLocation, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Type definition for row data
type DataRow = Record<string, string | number | boolean | null | undefined>;

// Minimal CSV download (safe revoke)
function downloadCSV(rows: DataRow[], filename = "export.csv") {
  if (!rows?.length) return;
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r || {}).forEach(k => set.add(k));
      return set;
    }, new Set<string>())
  );

  const esc = (v: string | number | boolean | null | undefined) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
  const csv =
    headers.join(",") +
    "\n" +
    rows.map(r => headers.map(h => esc(r[h])).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

// Simple DOM→PDF capture of the table area
async function downloadPDF(elementId = "export-content", filename = "export.pdf") {
  const el = document.getElementById(elementId);
  if (!el) return;

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(el, { useCORS: true, backgroundColor: "#fff", scale: window.devicePixelRatio || 1.5 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 0;
  let remaining = imgHeight;
  const sliceHeight = pageHeight;

  // paginate tall content
  while (remaining > 0) {
    pdf.addImage(imgData, "PNG", 0, 0 - y, imgWidth, imgHeight, undefined, "FAST");
    remaining -= sliceHeight;
    if (remaining > 0) {
      pdf.addPage();
      y += sliceHeight;
    }
  }

  pdf.save(filename);
}

// Type definitions for location state
interface ReportMeta {
  type?: string;
  role?: string;
  filters?: {
    departmentId?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

interface LocationState {
  rows: DataRow[];
  meta: ReportMeta;
}

export default function ReportExport() {
  const location = useLocation();
  const [params] = useSearchParams();

  // rows come from navigate(..., { state: { rows, meta } })
  const rows = (location.state as LocationState)?.rows ?? [];
  const meta = (location.state as LocationState)?.meta ?? {};
  const qs = {
    type: params.get("type") || meta.type || "",
    role: params.get("role") || meta.role || "",
    departmentId: params.get("departmentId") || meta.filters?.departmentId || "",
    dateFrom: params.get("dateFrom") || meta.filters?.dateFrom || "",
    dateTo: params.get("dateTo") || meta.filters?.dateTo || "",
  };

  // Decide which columns to show (stable and readable)
  const columns = useMemo(() => {
    if (!rows.length) return [];
    // Prefer a curated set if employee-like rows
    const preferred = ["photo", "id", "name", "designation", "rating", "notes"];
    const present = preferred.filter(k => k in rows[0]);

    if (present.length >= 3) return present;
    // fallback: first 8 keys found
    return Object.keys(rows[0]).slice(0, 8);
  }, [rows]);

  const fileBase =
    (qs.type ? `${qs.type}-` : "") +
    (qs.role || "export") +
    (qs.departmentId ? `-${qs.departmentId}` : "");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Export Report</h1>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => downloadCSV(rows, `${fileBase || "export"}.csv`)}
            disabled={!rows.length}
            title={!rows.length ? "No rows to export" : ""}
          >
            Export CSV
          </Button>
          <Button
            type="button"
            onClick={() => downloadPDF("export-content", `${fileBase || "export"}.pdf`)}
            disabled={!rows.length}
            title={!rows.length ? "No rows to export" : ""}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Parameters summary */}
      <Card className="p-4">
        <div className="text-sm text-muted-foreground mb-2">Report Parameters</div>
        <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-2 text-sm">
          <div><span className="font-medium">Type:</span> {qs.type || "—"}</div>
          <div><span className="font-medium">Role:</span> {qs.role || "—"}</div>
          <div><span className="font-medium">Department:</span> {qs.departmentId || "—"}</div>
          <div><span className="font-medium">From:</span> {qs.dateFrom || "—"}</div>
          <div><span className="font-medium">To:</span> {qs.dateTo || "—"}</div>
        </div>
      </Card>

      {/* Data table preview */}
      <Card className="p-0">
        <div className="p-4 text-sm text-muted-foreground">Data Preview</div>
        <ScrollArea className="max-h-[70vh]">
          <div id="export-content" className="px-4 pb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-lg">
                <thead>
                  <tr className="border-b bg-muted/50">
                    {columns.map(col => (
                      <th key={col} className="text-left px-3 py-2 font-medium capitalize">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length ? (
                    rows.map((r, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        {columns.map(c => (
                          <td key={c} className="px-3 py-2">
                            {c === "photo" && r[c]
                              ? <img src={String(r[c])} alt="" className="h-8 w-8 rounded-full object-cover" />
                              : String(r[c] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-3 py-6 text-muted-foreground" colSpan={columns.length || 1}>
                        No rows to display.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="pt-3 text-xs text-muted-foreground">
              Total rows: {rows.length}
            </div>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
