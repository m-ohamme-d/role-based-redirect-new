// src/utils/pdfReport.ts
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// Side-effect import so (doc as any).autoTable is available
import "jspdf-autotable";

/**
 * Capture a DOM element (by id or node) and export it to a PDF page.
 * Keeps aspect ratio; scales down if it exceeds the page width.
 */
export async function generatePDF(
  elementOrId: string | HTMLElement,
  title = "Exported Report"
) {
  const el =
    typeof elementOrId === "string"
      ? (document.getElementById(elementOrId) as HTMLElement | null)
      : (elementOrId as HTMLElement | null);

  if (!el) throw new Error("generatePDF: target element not found");

  const canvas = await html2canvas(el, {
    backgroundColor: "#ffffff",
    scale: 2, // better text crispness
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "pt", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth - 40 * 2; // 40pt side margins
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = 40; // top margin
  let x = 40; // left margin

  // If image taller than one page, slice into pages
  let remainingHeight = imgHeight;
  let srcY = 0;
  const chunkHeight = (canvas.width * (pageHeight - 80)) / imgWidth; // map to canvas pixels

  while (remainingHeight > 0) {
    const sliceCanvas = document.createElement("canvas");
    const sliceCtx = sliceCanvas.getContext("2d")!;
    const sliceH = Math.min(chunkHeight, canvas.height - srcY);

    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceH;

    sliceCtx.drawImage(
      canvas,
      0,
      srcY,
      canvas.width,
      sliceH,
      0,
      0,
      canvas.width,
      sliceH
    );

    const sliceImg = sliceCanvas.toDataURL("image/png");
    const sliceDisplayH = (sliceH * imgWidth) / canvas.width;

    if (srcY > 0) pdf.addPage();
    pdf.addImage(sliceImg, "PNG", x, y, imgWidth, sliceDisplayH, undefined, "FAST");

    srcY += sliceH;
    remainingHeight -= sliceDisplayH;
  }

  const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  pdf.save(filename);
}

/**
 * Data-table PDF for Team Lead — centered table with balanced columns.
 * Columns: Photo | Id | Name | Designation | Rating | Notes
 */
export async function exportPerformanceReportPDF(
  rows: any[],
  title = "Team Performance Report"
) {
  const doc = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  const now = new Date().toLocaleString();
  doc.setFontSize(14);
  doc.text(title, pageWidth / 2, 40, { align: "center" });
  doc.setFontSize(10);
  doc.text(`Generated: ${now}`, 40, 60);

  // Normalize -> Photo | Id | Name | Designation | Rating | Notes
  const headers = ["Photo", "Id", "Name", "Designation", "Rating", "Notes"];
  const body = (rows || []).map((r: any) => {
    const id =
      r.id ?? r.employeeId ?? r.empId ?? r.code ?? "—";
    const name =
      r.name ?? r.fullName ?? r.employeeName ?? "—";
    const designation =
      r.designation ?? r.role ?? r.position ?? "—";
    const ratingRaw =
      r.rating ?? r.ratingPercent ?? r.performanceRating ?? r.performance ?? r.score ?? null;
    const rating = typeof ratingRaw === "number" ? `${ratingRaw}%` : (ratingRaw ?? "—");
    const notes = r.notes ?? r.comment ?? r.comments ?? r.remark ?? "—";
    const photo = r.photo ?? r.avatar ?? r.image ?? ""; // dataURL renders; external URLs are ignored
    return [photo, id, name, designation, rating, notes];
  });

  // Column widths (pt)
  const wPhoto = 56;
  const wId    = 70;
  const wName  = 150;
  const wRole  = 120;
  const wRate  = 60;

  // Notes gets the remainder, with a comfy minimum
  const minNotes = 180;
  const totalBase = wPhoto + wId + wName + wRole + wRate;

  // We’ll try to fill the page width with small outer margins by centering the table
  const usableWidth = pageWidth; // full page; we’ll center via left/right equal margins
  let wNotes = Math.max(minNotes, usableWidth - totalBase - 0); // preliminary

  // Compute centered margins and final table width
  const tentativeTotal = totalBase + wNotes;
  const centerMargin = Math.max(0, (pageWidth - tentativeTotal) / 2);
  const tableWidth = Math.min(tentativeTotal, pageWidth - centerMargin * 2);

  (doc as any).autoTable({
    head: [headers],
    body,
    startY: 90,
    margin: { left: centerMargin, right: centerMargin },
    tableWidth,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 8,
      overflow: "linebreak",
      lineWidth: 0.2,
      valign: "top",
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: 255,
      fontSize: 10,
      cellPadding: 8,
      overflow: "hidden",
    },
    alternateRowStyles: { fillColor: [246, 248, 252] },
    columnStyles: {
      0: { cellWidth: wPhoto },                  // Photo
      1: { cellWidth: wId },                     // Id
      2: { cellWidth: wName },                   // Name
      3: { cellWidth: wRole },                   // Designation
      4: { cellWidth: wRate, halign: "right" },  // Rating
      5: { cellWidth: Math.max(minNotes, tableWidth - (wPhoto + wId + wName + wRole + wRate)) }, // Notes
    },

    // Draw photo thumbnail if we get a data URL
    didDrawCell: (data: any) => {
      if (data.section === "body" && data.column.index === 0) {
        const val = data.cell.raw as string | undefined;
        if (val && typeof val === "string" && val.startsWith("data:image")) {
          const { x, y, height } = data.cell;
          const size = Math.min(height - 6, 22);
          doc.addImage(val, "PNG", x + 5, y + 3, size, size, undefined, "FAST");
          data.cell.text = [""];
        }
      }
    },

    didDrawPage: (data: any) => {
      doc.setFontSize(9);
      doc.text(
        `Page ${doc.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 20
      );
    },
  });

  const filename = `${title.replace(/\s+/g, "-").toLowerCase()}.pdf`;
  doc.save(filename);
}
