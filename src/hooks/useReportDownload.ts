import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { generatePerformanceReport } from '@/utils/downloadReport';
import { exportPerformanceReportPDF } from '@/utils/pdfReport';
import { generatePDFContent, generateExcelContent, downloadFile } from '@/utils/reportGenerator';
import { toast } from 'sonner';

export const useReportDownload = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);

  const downloadPerformanceReport = async (format: 'pdf' | 'csv' = 'pdf') => {
    if (!profile) {
      toast.error("Unauthorized - Please log in");
      return false;
    }
    
    if (!['manager', 'teamlead'].includes(profile.role)) {
      toast.error("Access denied - Only managers and team leads can generate reports");
      return false;
    }

    setLoading(true);
    toast.info("Generating report...", { description: "This may take a few moments" });
    
    try {
      const data = await generatePerformanceReport(profile.role, profile.id);
      
      if (!data || data.length === 0) {
        toast.warning("No employee data found for your department");
        return false;
      }

      const reportData = {
        employees: data.map(emp => ({
          name: emp.profiles?.name || 'N/A',
          position: emp.position || 'N/A',
          performance: emp.performance_rating || 0,
          email: emp.profiles?.email || 'N/A',
          department: emp.departments?.name || 'N/A',
          hire_date: emp.hire_date || 'N/A'
        })),
        department: profile.role === 'teamlead' ? 'Your Department' : 'All Departments',
        teamLead: profile.name,
        reportType: 'Performance Report',
        dateRange: 'Current Period'
      };

      if (format === 'pdf') {
        // Ensure data is properly formatted for PDF generation
        console.log('PDF data:', data); // Debug log
        if (data && data.length > 0) {
          exportPerformanceReportPDF(data, `Performance Report - ${profile.role} - ${profile.name}`);
        } else {
          toast.error("No data available for PDF generation");
          return false;
        }
      } else {
        const content = generateExcelContent(reportData);
        const filename = `performance-report-${profile.role}-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(content, filename, 'text/csv');
      }
      
      toast.success("Report downloaded successfully", {
        description: `Generated ${data.length} employee records`
      });
      
      return true;
    } catch (err) {
      console.error("Report generation failed:", err);
      toast.error("Failed to generate report", {
        description: err instanceof Error ? err.message : "Unknown error occurred"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    downloadPerformanceReport,
    loading
  };
};