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

const AdminReports = () => {
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('all-users');
  const { fetch, loading } = usePerformanceReport(profile?.role || 'admin', profile?.id || '');

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
        reportType: `Admin ${reportType.replace('-', ' ').toUpperCase()} Report`,
        dateRange: selectedPeriod.replace('-', ' ').toUpperCase(),
        generatedBy: `${profile.name} (Admin)`,
        employees: data
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'pdf') {
        content = generatePDFContent(reportData);
        filename = `admin-report-${reportType}-${selectedPeriod}.txt`;
        mimeType = 'text/plain';
      } else {
        content = 'Name,Position,Performance,Email,Department\n';
        data.forEach((emp: any) => {
          content += `"${emp.profiles?.name || 'N/A'}","${emp.position || 'N/A'}",${emp.performance_rating || 0},"${emp.profiles?.email || 'N/A'}","${emp.departments?.name || 'N/A'}"\n`;
        });
        filename = `admin-report-${reportType}-${selectedPeriod}.csv`;
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Reports</h1>
          <p className="text-gray-600">Generate and download comprehensive system reports</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports with system-wide data</CardDescription>
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
                  <SelectItem value="all-users">All Users Report</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                  <SelectItem value="departments">Departments Report</SelectItem>
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

export default AdminReports;