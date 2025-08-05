import { Button } from "@/components/ui/button";
import { useReportDownload } from "@/hooks/useReportDownload";
import { Download, Loader2, FileText } from "lucide-react";

/**
 * Enhanced report button with PDF/CSV options
 */
export function GenerateReportButton() {
  const { downloadPerformanceReport, downloadHTMLReport, loading } = useReportDownload();

  const handleDownloadPDF = async () => {
    await downloadPerformanceReport('pdf');
  };

  const handleDownloadCSV = async () => {
    await downloadPerformanceReport('csv');
  };

  const handleDownloadHTML = async () => {
    await downloadHTMLReport('report-container', 'dashboard-report.pdf');
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="flex items-center gap-2"
        onClick={handleDownloadPDF}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        {loading ? "Generating..." : "Download PDF"}
      </Button>
      
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={handleDownloadCSV}
        disabled={loading}
      >
        <FileText className="h-4 w-4" />
        Download CSV
      </Button>
      
      <Button
        variant="secondary"
        className="flex items-center gap-2"
        onClick={handleDownloadHTML}
        disabled={loading}
      >
        <Download className="h-4 w-4" />
        Capture HTML
      </Button>
    </div>
  );
}