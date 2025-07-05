import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { generatePerformanceReport } from "@/utils/downloadReport";
import { exportPerformanceReportPDF } from "@/utils/pdfReport";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

/**
 * You can place this button in ReportsPage:
 */
export function GenerateReportButton() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Unauthorized - Please log in");
      return;
    }
    
    if (!['manager', 'teamlead'].includes(profile.role)) {
      toast.error("Access denied - Only managers and team leads can generate reports");
      return;
    }

    setLoading(true);
    toast.info("Generating report...", { description: "This may take a few moments" });
    
    try {
      const data = await generatePerformanceReport(profile.role, profile.id);
      
      if (!data || data.length === 0) {
        toast.warning("No employee data found for your department");
        return;
      }
      
      exportPerformanceReportPDF(
        data,
        `Performance Report - ${profile.role} - ${profile.name}`
      );
      
      toast.success("Report downloaded successfully", {
        description: `Generated ${data.length} employee records`
      });
    } catch (err) {
      console.error("Report generation failed:", err);
      toast.error("Failed to generate report", {
        description: err instanceof Error ? err.message : "Unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="flex items-center gap-2"
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {loading ? "Generating..." : "Generate Performance Report"}
    </Button>
  );
}