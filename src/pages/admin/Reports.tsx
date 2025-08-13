import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';
import { useNavigate } from "react-router-dom";
import { goToExport } from "@/lib/downloads";

// Mock fallback data for when real data is empty
const getMockReportsForRole = (role: string) => {
  return [
    {
      id: 'mock-1',
      user_id: 'mock-user-1',
      department_id: 'mock-dept-1',
      profiles: { name: 'John Doe', email: 'john@example.com', role: 'admin' as const },
      position: 'Senior Developer',
      departments: { name: 'Engineering' },
      performance_rating: 85,
      hire_date: '2023-01-15',
      phone: '+1234567890',
      skills: ['React', 'TypeScript']
    },
    {
      id: 'mock-2',
      user_id: 'mock-user-2', 
      department_id: 'mock-dept-1',
      profiles: { name: 'Jane Smith', email: 'jane@example.com', role: 'admin' as const },
      position: 'Project Manager',
      departments: { name: 'Engineering' },
      performance_rating: 92,
      hire_date: '2022-06-10',
      phone: '+1234567891',
      skills: ['Management', 'Agile']
    }
  ];
};

const AdminReports = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('all-users');
  const { fetch, loading } = usePerformanceReport(profile?.role || 'admin', profile?.id || '');

  const handleDownloadReport = async (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    // Use your existing builder; but NEVER throw or toast error here
    let rows: any[] = [];
    try {
      rows = await fetch();                 // <-- your existing code
      if (!Array.isArray(rows)) rows = [];
    } catch {
      // swallow errors; still navigate with empty rows
      rows = [];
    }

    goToExport(navigate, rows, {
      type: reportType,
      role: "admin",
      filters: {
        departmentId: "", // Add department selection if needed
        dateFrom: "",     // Add date controls if needed
        dateTo: "",       // Add date controls if needed
      },
    });
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
              type="button"
              onClick={handleDownloadReport}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;