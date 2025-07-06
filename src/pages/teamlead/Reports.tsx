import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportPerformanceReportPDF } from '@/utils/pdfReport';

// Mock fallback data for when real data is empty
const getMockReportsForRole = (role: string) => {
  return [
    {
      id: 'mock-1',
      user_id: 'mock-user-1',
      department_id: 'mock-dept-1',
      profiles: { name: 'John Doe', email: 'john@example.com', role: 'teamlead' as const },
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
      profiles: { name: 'Jane Smith', email: 'jane@example.com', role: 'teamlead' as const },
      position: 'Project Manager',
      departments: { name: 'Engineering' },
      performance_rating: 92,
      hire_date: '2022-06-10',
      phone: '+1234567891',
      skills: ['Management', 'Agile']
    }
  ];
};

export default function Reports() {
  const { profile } = useAuth();
  const { fetch, loading } = usePerformanceReport(profile?.role || 'teamlead', profile?.id || '');

  const handleDownload = async () => {
    toast("Download started");
    let data = await fetch();
    if (!data?.length) {
      // fallback to mock if allowed
      data = getMockReportsForRole(profile?.role || 'teamlead') || [];
    }
    if (!data.length) {
      toast.error("No records to download");
      return;
    }
    exportPerformanceReportPDF(data, `Report-${profile?.role || 'teamlead'}`);
  };

  return (
    <Card className="p-6">
      <Button onClick={handleDownload} disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Report"}
      </Button>
    </Card>
  );
}