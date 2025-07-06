import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { exportPerformanceReportPDF } from '@/utils/pdfReport';

export default function Reports() {
  const { profile } = useAuth();
  const { fetch, loading } = usePerformanceReport(profile?.role || 'teamlead', profile?.id || '');

  const handleDownload = async () => {
    toast("Download started");
    const data = await fetch();
    if (!data?.length) {
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