import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText, Download, Calendar, CheckCircle, Bell, Star } from 'lucide-react';
import { toast } from 'sonner';
import { generatePDFContent, generateExcelContent, downloadFile } from '@/utils/reportGenerator';

const Reports = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string;
    name: string;
    type: string;
    format: string;
    dateGenerated: string;
    status: string;
    isFavorite: boolean;
    department?: string;
  }>>([]);

  // Get current user and department context
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const getDepartmentEmployees = (department: string) => {
    // Mock data for different departments
    const departmentEmployees = {
      'engineering': [
        { id: 'EMP001', name: 'John Smith', position: 'Senior Developer', performance: 92, email: 'john@example.com' },
        { id: 'EMP002', name: 'Sarah Johnson', position: 'Frontend Developer', performance: 88, email: 'sarah@example.com' },
        { id: 'EMP003', name: 'Mike Davis', position: 'Backend Developer', performance: 95, email: 'mike@example.com' }
      ],
      'marketing': [
        { id: 'EMP004', name: 'Lisa Chen', position: 'Marketing Manager', performance: 90, email: 'lisa@example.com' },
        { id: 'EMP005', name: 'David Wilson', position: 'Content Specialist', performance: 85, email: 'david@example.com' }
      ],
      'sales': [
        { id: 'EMP006', name: 'Emily Brown', position: 'Sales Manager', performance: 94, email: 'emily@example.com' },
        { id: 'EMP007', name: 'Robert Lee', position: 'Sales Representative', performance: 87, email: 'robert@example.com' }
      ],
      'hr': [
        { id: 'EMP008', name: 'Jennifer White', position: 'HR Manager', performance: 89, email: 'jennifer@example.com' }
      ]
    };

    if (department === 'all') {
      return Object.values(departmentEmployees).flat();
    }
    
    return departmentEmployees[department as keyof typeof departmentEmployees] || [];
  };

  const getTeamLead = (department: string) => {
    const teamLeads = {
      'engineering': 'John Smith',
      'marketing': 'Lisa Chen', 
      'sales': 'Emily Brown',
      'hr': 'Jennifer White'
    };
    
    return teamLeads[department as keyof typeof teamLeads] || null;
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    
    setTimeout(() => {
      const employees = getDepartmentEmployees(selectedDepartment);
      const teamLead = selectedDepartment !== 'all' ? getTeamLead(selectedDepartment) : null;
      const departmentName = selectedDepartment === 'all' ? undefined : selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1);
      
      const reportData = {
        employees,
        department: departmentName,
        teamLead,
        reportType: reportType.charAt(0).toUpperCase() + reportType.slice(1),
        dateRange: dateRange.charAt(0).toUpperCase() + dateRange.slice(1)
      };

      const now = new Date();
      let content = '';
      let filename = '';
      let mimeType = '';

      if (format === 'pdf') {
        content = generatePDFContent(reportData);
        filename = `${reportType}_report_${departmentName || 'all'}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.pdf`;
        mimeType = 'application/pdf';
      } else if (format === 'xlsx') {
        content = generateExcelContent(reportData);
        filename = `${reportType}_report_${departmentName || 'all'}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        content = generateExcelContent(reportData);
        filename = `${reportType}_report_${departmentName || 'all'}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;
        mimeType = 'text/csv';
      }

      const success = downloadFile(content, filename, mimeType);
      
      if (success) {
        const newReport = {
          id: Date.now().toString(),
          name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report${departmentName ? ` - ${departmentName}` : ''}`,
          type: reportType,
          format: format.toUpperCase(),
          dateGenerated: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          status: 'Ready',
          isFavorite: false,
          department: departmentName
        };
        
        setGeneratedReports(prev => [newReport, ...prev]);
        
        toast.success('Report generated and downloaded successfully', {
          description: `Your ${reportType} report${departmentName ? ` for ${departmentName} department` : ''} has been downloaded.`
        });
      } else {
        toast.error('Failed to generate report', {
          description: 'There was an error generating the report. Please try again.'
        });
      }
      
      setGenerating(false);
    }, 1500);
  };

  const handleToggleFavorite = (reportId: number, isGenerated: boolean = false) => {
    if (isGenerated) {
      setGeneratedReports(prev => prev.map(report => 
        report.id === reportId.toString() 
          ? { ...report, isFavorite: !report.isFavorite }
          : report
      ));
    } else {
      setRecentReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, isFavorite: !report.isFavorite }
          : report
      ));
      
      // Also update favorites list
      const report = recentReports.find(r => r.id === reportId);
      if (report) {
        if (!report.isFavorite) {
          setFavoriteReports(prev => [...prev, { ...report, isFavorite: true }]);
        } else {
          setFavoriteReports(prev => prev.filter(r => r.id !== reportId));
        }
      }
    }
    
    toast.success('Favorite status updated');
  };

  const handleSaveReport = (reportName: string, reportFormat: string) => {
    const savedReport = {
      id: Date.now(),
      name: reportName,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      type: reportFormat,
      isFavorite: false
    };
    
    setRecentReports(prev => [savedReport, ...prev]);
    toast.success('Report saved successfully');
  };

  const handleDownloadReport = (reportName: string, reportFormat: string, reportTypeData?: string) => {
    const employees = getDepartmentEmployees(selectedDepartment);
    const teamLead = selectedDepartment !== 'all' ? getTeamLead(selectedDepartment) : null;
    const departmentName = selectedDepartment === 'all' ? undefined : selectedDepartment.charAt(0).toUpperCase() + selectedDepartment.slice(1);
    
    const reportData = {
      employees,
      department: departmentName,
      teamLead,
      reportType: reportTypeData || reportType,
      dateRange: dateRange
    };

    const now = new Date();
    let content = '';
    let filename = '';
    let mimeType = '';

    if (reportFormat === 'PDF') {
      content = generatePDFContent(reportData);
      filename = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.pdf`;
      mimeType = 'application/pdf';
    } else if (reportFormat === 'XLSX') {
      content = generateExcelContent(reportData);
      filename = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else {
      content = generateExcelContent(reportData);
      filename = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;
      mimeType = 'text/csv';
    }

    const success = downloadFile(content, filename, mimeType);
    
    if (success) {
      toast.success('Download completed', {
        description: `${reportName} has been downloaded successfully.`
      });
    } else {
      toast.error('Download failed', {
        description: 'There was an error downloading the report. Please try again.'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
      <p className="text-gray-600">Generate custom reports based on your requirements</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Select options to generate a custom report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance">Performance Report</SelectItem>
                    <SelectItem value="financial">Financial Report</SelectItem>
                    <SelectItem value="attendance">Attendance Report</SelectItem>
                    <SelectItem value="project">Project Status Report</SelectItem>
                    <SelectItem value="resource">Resource Allocation Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Export Format</label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select export format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={handleGenerateReport} 
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleSaveReport(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, format.toUpperCase())}
                >
                  Save Config
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Saved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recent">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                <TabsTrigger value="favorites" className="flex-1">Favorites</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="space-y-4">
                {recentReports.map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {report.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleFavorite(report.id)}
                      >
                        <Star className={`h-4 w-4 ${report.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadReport(report.name, report.type)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="favorites" className="space-y-4">
                {favoriteReports.filter(report => report.isFavorite).map((report) => (
                  <div 
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-xs text-gray-500">{report.type} Format</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleToggleFavorite(report.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadReport(report.name, report.type)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Generated Reports Table */}
      {generatedReports.length > 0 && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recently Generated Reports</CardTitle>
            <CardDescription>Reports you've generated in this session</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="capitalize">{report.type}</TableCell>
                    <TableCell>{report.department || 'All'}</TableCell>
                    <TableCell>{report.format}</TableCell>
                    <TableCell>{report.dateGenerated}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">{report.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleFavorite(parseInt(report.id), true)}
                        >
                          <Star className={`h-4 w-4 ${report.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadReport(report.name, report.format, report.type)}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
