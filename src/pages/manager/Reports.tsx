import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';
import { generatePDFContent } from '@/utils/reportGenerator';
import { downloadFile } from '@/utils/reportGenerator';

const ManagerReports = () => {
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const { fetch, loading } = usePerformanceReport(profile?.role || 'manager', profile?.id || '');

  const handleDownloadReport = async (format: 'pdf' | 'csv') => {
    if (!profile) {
      toast.error('Authentication required');
      return;
    }

    toast('Download started');
    
    try {
      const data = await fetch();
      if (!data || data.length === 0) {
        toast.error('No records to download');
        return;
      }

      const reportData = {
        reportType: `Manager ${reportType.replace('-', ' ').toUpperCase()} Report`,
        dateRange: selectedPeriod.replace('-', ' ').toUpperCase(),
        generatedBy: `${profile.name} (Manager)`,
        employees: data
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'pdf') {
        content = generatePDFContent(reportData);
        filename = `manager-report-${reportType}-${selectedPeriod}.txt`;
        mimeType = 'text/plain';
      } else {
        content = 'Name,Position,Performance,Email,Department\n';
        data.forEach((emp: any) => {
          content += `"${emp.profiles?.name || 'N/A'}","${emp.position || 'N/A'}",${emp.performance_rating || 0},"${emp.profiles?.email || 'N/A'}","${emp.departments?.name || 'N/A'}"\n`;
        });
        filename = `manager-report-${reportType}-${selectedPeriod}.csv`;
        mimeType = 'text/csv';
      }

      const success = downloadFile(content, filename, mimeType);
      if (success) {
        toast.success(`Report downloaded successfully`);
      } else {
        toast.error('Failed to download report');
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manager Reports</h1>
          <p className="text-gray-600">Generate and download team performance reports</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports for your teams and projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team-performance">Team Performance</SelectItem>
                  <SelectItem value="project-status">Project Status</SelectItem>
                  <SelectItem value="client-portfolio">Client Portfolio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-week">Current Week</SelectItem>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => handleDownloadReport('pdf')}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate PDF
            </Button>
            <Button 
              onClick={() => handleDownloadReport('csv')}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Generate CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerReports;