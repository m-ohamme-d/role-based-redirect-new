
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

export const generatePerformanceReport = (data: any, reportType: string) => {
  if (!data || (!data.employees?.length && !data.projects?.length)) {
    toast.error('No data available for report generation');
    return null;
  }

  const reportData = {
    reportType,
    generatedAt: new Date().toISOString(),
    employees: data.employees || [],
    projects: data.projects || [],
    metrics: data.reportMetrics || {}
  };

  return reportData;
};

export const exportPerformanceReportPDF = async (reportData: any, filename: string) => {
  try {
    toast.info('Download started - generating PDF...');
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Title
    doc.setFontSize(20);
    doc.text('Performance Report', pageWidth / 2, 20, { align: 'center' });
    
    // Generated date
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date(reportData.generatedAt).toLocaleString()}`, 14, 35);
    
    // Metrics section
    doc.setFontSize(16);
    doc.text('Key Metrics', 14, 50);
    
    const metricsData = [
      ['Total Employees', reportData.metrics.totalEmployees?.toString() || '0'],
      ['Active Projects', reportData.metrics.activeProjects?.toString() || '0'],
      ['Average Performance', `${reportData.metrics.avgPerformance?.toFixed(1) || '0'}%`],
      ['Completion Rate', `${reportData.metrics.completionRate?.toFixed(1) || '0'}%`]
    ];
    
    autoTable(doc, {
      startY: 55,
      head: [['Metric', 'Value']],
      body: metricsData,
      theme: 'grid'
    });

    // Employee data
    if (reportData.employees?.length > 0) {
      doc.setFontSize(16);
      doc.text('Employee Performance', 14, (doc as any).lastAutoTable.finalY + 20);
      
      const employeeData = reportData.employees.map((emp: any) => [
        emp.profiles?.name || 'N/A',
        emp.departments?.name || 'N/A',
        emp.position || 'N/A',
        `${emp.performance_rating || 0}%`
      ]);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 25,
        head: [['Name', 'Department', 'Position', 'Performance']],
        body: employeeData.length > 0 ? employeeData : [['No employee data available', '', '', '']],
        theme: 'striped'
      });
    }

    // Project data
    if (reportData.projects?.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text('Project Status', 14, 20);
      
      const projectData = reportData.projects.map((proj: any) => [
        proj.name || 'N/A',
        proj.clients?.name || 'N/A',
        proj.departments?.name || 'N/A',
        proj.status || 'unknown'
      ]);

      autoTable(doc, {
        startY: 25,
        head: [['Project', 'Client', 'Department', 'Status']],
        body: projectData.length > 0 ? projectData : [['No project data available', '', '', '']],
        theme: 'striped'
      });
    }

    // Handle empty data case
    if (reportData.employees?.length === 0 && reportData.projects?.length === 0) {
      doc.setFontSize(14);
      doc.text('No records found for the selected criteria.', pageWidth / 2, 100, { align: 'center' });
    }

    doc.save(filename);
    toast.success('Report downloaded successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report');
  }
};

export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  try {
    if (!content || content.trim() === '') {
      toast.error('No data available to download');
      return;
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('File downloaded successfully');
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file');
  }
};
