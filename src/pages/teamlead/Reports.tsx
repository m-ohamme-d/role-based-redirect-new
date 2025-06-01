
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Clock } from "lucide-react";
import { toast } from "sonner";
import { generatePDFContent, generateExcelContent, downloadFile } from '@/utils/reportGenerator';

interface Report {
  id: number;
  title: string;
  type: 'Performance' | 'Team Overview' | 'Client Summary' | 'Custom';
  createdBy: string;
  createdAt: Date;
  status: 'Generated' | 'Draft' | 'Locked';
  downloadUrl?: string;
}

const TeamLeadReports = () => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'Monthly Team Performance Report',
      type: 'Performance',
      createdBy: 'Current User',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      status: 'Generated'
    },
    {
      id: 2,
      title: 'Q4 Team Overview',
      type: 'Team Overview',
      createdBy: 'Current User',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: 'Generated'
    },
    {
      id: 3,
      title: 'Client Project Summary',
      type: 'Client Summary',
      createdBy: 'Current User',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      status: 'Locked'
    }
  ]);

  // Get current user data
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Mock team data for Team Lead
  const getTeamData = () => {
    return [
      { id: 'EMP001', name: 'John Smith', position: 'Senior Developer', performance: 92, email: 'john@example.com' },
      { id: 'EMP002', name: 'Sarah Johnson', position: 'Frontend Developer', performance: 88, email: 'sarah@example.com' },
      { id: 'EMP003', name: 'Mike Davis', position: 'Backend Developer', performance: 95, email: 'mike@example.com' },
      { id: 'EMP004', name: 'Lisa Chen', position: 'UX Designer', performance: 90, email: 'lisa@example.com' }
    ];
  };

  const generateNewReport = (type: Report['type']) => {
    const teamData = getTeamData();
    const reportData = {
      employees: teamData,
      department: user?.department || 'Engineering',
      teamLead: user?.name || 'Team Lead',
      reportType: type,
      dateRange: 'Current Month'
    };

    const now = new Date();
    let content = '';
    let filename = '';
    let mimeType = '';

    // Generate PDF using the Team Performance Rating template
    content = generatePDFContent(reportData);
    filename = `${type.replace(/\s+/g, '_')}_Report_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.pdf`;
    mimeType = 'application/pdf';

    const success = downloadFile(content, filename, mimeType);

    if (success) {
      const newReport: Report = {
        id: Math.max(...reports.map(r => r.id)) + 1,
        title: `${type} Report - ${new Date().toLocaleDateString()}`,
        type,
        createdBy: 'Current User',
        createdAt: new Date(),
        status: 'Generated'
      };

      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      
      console.log('New report generated:', newReport);
      console.log('Updated reports list (most recent first):', updatedReports);
      
      toast.success(`${type} report generated and downloaded successfully`, {
        description: 'Using Team Performance Rating template'
      });
    } else {
      toast.error('Failed to generate report', {
        description: 'There was an error generating the report. Please try again.'
      });
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Generated': return 'default';
      case 'Draft': return 'secondary';
      case 'Locked': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDownloadReport = (report: Report) => {
    const teamData = getTeamData();
    const reportData = {
      employees: teamData,
      department: user?.department || 'Engineering',
      teamLead: user?.name || 'Team Lead',
      reportType: report.type,
      dateRange: 'Current Month'
    };

    const content = generatePDFContent(reportData);
    const filename = `${report.title.replace(/\s+/g, '_')}_${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}.pdf`;
    const mimeType = 'application/pdf';

    const success = downloadFile(content, filename, mimeType);
    
    if (success) {
      toast.success('Report downloaded successfully');
    } else {
      toast.error('Download failed', {
        description: 'There was an error downloading the report. Please try again.'
      });
    }
  };

  // Sort reports by creation date (most recent first)
  const sortedReports = [...reports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => generateNewReport('Performance')}>
            Generate Performance Report
          </Button>
          <Button variant="outline" onClick={() => generateNewReport('Team Overview')}>
            Team Overview Report
          </Button>
          <Button variant="outline" onClick={() => generateNewReport('Client Summary')}>
            Client Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Total Reports</h3>
            <div className="text-3xl font-bold mt-2">{reports.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Generated Today</h3>
            <div className="text-3xl font-bold mt-2">
              {reports.filter(r => 
                new Date(r.createdAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Locked Reports</h3>
            <div className="text-3xl font-bold mt-2">
              {reports.filter(r => r.status === 'Locked').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Reports
            <span className="text-sm font-normal text-gray-500">({sortedReports.length} total)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedReports.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No reports generated yet</p>
            ) : (
              sortedReports.map(report => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(report.createdAt)}</span>
                        <span>•</span>
                        <span>by {report.createdBy}</span>
                        <span>•</span>
                        <span>ID: {report.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Badge variant="outline">
                      {report.type}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamLeadReports;
