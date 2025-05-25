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

const Reports = () => {
  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<Array<{
    id: string;
    name: string;
    type: string;
    format: string;
    dateGenerated: string;
    status: string;
    isFavorite: boolean;
  }>>([]);

  const [recentReports, setRecentReports] = useState([
    { id: 1, name: 'Performance Q1', date: 'May 15, 2025', type: 'PDF', isFavorite: false },
    { id: 2, name: 'Department Budget', date: 'May 10, 2025', type: 'XLSX', isFavorite: true },
    { id: 3, name: 'Team Metrics', date: 'May 5, 2025', type: 'PDF', isFavorite: false },
    { id: 4, name: 'Resource Allocation', date: 'Apr 28, 2025', type: 'CSV', isFavorite: true }
  ]);

  const [favoriteReports, setFavoriteReports] = useState([
    { id: 1, name: 'Monthly Team Performance', type: 'PDF', isFavorite: true },
    { id: 2, name: 'Resource Usage Summary', type: 'XLSX', isFavorite: true },
    { id: 3, name: 'Department KPIs', type: 'PDF', isFavorite: true }
  ]);

  const generateReportData = (reportType: string) => {
    const now = new Date();
    const data = [];

    switch (reportType) {
      case 'performance':
        return [
          ['Employee ID', 'Name', 'Department', 'Performance Score', 'Goals Met', 'Last Review'],
          ['EMP001', 'John Smith', 'Engineering', '92%', '8/10', '2025-05-20'],
          ['EMP002', 'Sarah Johnson', 'Marketing', '88%', '7/9', '2025-05-18'],
          ['EMP003', 'Mike Davis', 'Sales', '95%', '9/10', '2025-05-22'],
          ['EMP004', 'Lisa Chen', 'Engineering', '90%', '8/9', '2025-05-19'],
          ['EMP005', 'David Wilson', 'HR', '85%', '6/8', '2025-05-21']
        ];

      case 'financial':
        return [
          ['Department', 'Budget Allocated', 'Budget Used', 'Remaining', 'Percentage Used', 'Status'],
          ['Engineering', '$150,000', '$142,500', '$7,500', '95%', 'On Track'],
          ['Marketing', '$80,000', '$75,200', '$4,800', '94%', 'On Track'],
          ['Sales', '$120,000', '$98,400', '$21,600', '82%', 'Under Budget'],
          ['HR', '$60,000', '$55,800', '$4,200', '93%', 'On Track'],
          ['Operations', '$90,000', '$89,100', '$900', '99%', 'Almost Exceeded']
        ];

      case 'attendance':
        return [
          ['Employee ID', 'Name', 'Department', 'Days Present', 'Days Absent', 'Attendance %', 'Late Arrivals'],
          ['EMP001', 'John Smith', 'Engineering', '22', '0', '100%', '2'],
          ['EMP002', 'Sarah Johnson', 'Marketing', '21', '1', '95.5%', '1'],
          ['EMP003', 'Mike Davis', 'Sales', '22', '0', '100%', '0'],
          ['EMP004', 'Lisa Chen', 'Engineering', '20', '2', '90.9%', '3'],
          ['EMP005', 'David Wilson', 'HR', '22', '0', '100%', '1']
        ];

      case 'project':
        return [
          ['Project ID', 'Project Name', 'Manager', 'Status', 'Progress', 'Due Date', 'Team Size'],
          ['PRJ001', 'Website Redesign', 'John Smith', 'In Progress', '75%', '2025-06-15', '5'],
          ['PRJ002', 'Mobile App Launch', 'Sarah Johnson', 'In Progress', '60%', '2025-07-01', '8'],
          ['PRJ003', 'Database Migration', 'Mike Davis', 'Completed', '100%', '2025-05-30', '3'],
          ['PRJ004', 'Marketing Campaign', 'Lisa Chen', 'Planning', '25%', '2025-08-15', '4'],
          ['PRJ005', 'Security Audit', 'David Wilson', 'In Progress', '40%', '2025-06-30', '2']
        ];

      case 'resource':
        return [
          ['Resource Type', 'Total Available', 'Currently Used', 'Available', 'Utilization %', 'Department'],
          ['Laptops', '50', '45', '5', '90%', 'IT'],
          ['Meeting Rooms', '8', '6', '2', '75%', 'All'],
          ['Software Licenses', '100', '85', '15', '85%', 'All'],
          ['Vehicles', '5', '4', '1', '80%', 'Sales'],
          ['Workstations', '60', '58', '2', '97%', 'All']
        ];

      default:
        return [['Data', 'Value'], ['Sample', '100']];
    }
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    
    // Mock report generation
    setTimeout(() => {
      const newReport = {
        id: Date.now().toString(),
        name: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        type: reportType,
        format: format.toUpperCase(),
        dateGenerated: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        status: 'Ready',
        isFavorite: false
      };
      
      setGeneratedReports(prev => [newReport, ...prev]);
      setGenerating(false);
      
      toast.success('Report generated successfully', {
        description: `Your ${reportType} report is ready for download.`
      });
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
    const now = new Date();
    const dateStamp = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const timeStamp = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const fullTimestamp = `${dateStamp} at ${timeStamp}`;
    
    // Get data based on report type
    const reportData = generateReportData(reportTypeData || reportType);
    
    let content = '';
    let mimeType = '';
    let fileName = '';
    
    if (reportFormat === 'PDF') {
      // Create formatted text content for PDF
      content = `Report: ${reportName}\nGenerated on: ${fullTimestamp}\n\n`;
      content += reportData.map(row => row.join(' | ')).join('\n');
      mimeType = 'text/plain'; // Browser will treat as text for demo
      fileName = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.txt`;
    } else if (reportFormat === 'XLSX') {
      // Create tab-separated content for Excel
      content = `# Report: ${reportName}\n# Generated on: ${fullTimestamp}\n\n`;
      content += reportData.map(row => row.join('\t')).join('\n');
      mimeType = 'text/tab-separated-values';
      fileName = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.tsv`;
    } else if (reportFormat === 'CSV') {
      // Create proper CSV content
      content = `# Report: ${reportName}\n# Generated on: ${fullTimestamp}\n`;
      content += reportData.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      mimeType = 'text/csv';
      fileName = `${reportName.replace(/\s+/g, '_')}_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;
    }
    
    try {
      // Create blob and download
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started', {
        description: `${reportName} generated on ${dateStamp} is being downloaded to your Downloads folder.`
      });
    } catch (error) {
      console.error('Download failed:', error);
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
