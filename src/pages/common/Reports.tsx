import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { format as formatDate } from 'date-fns';
import { downloadTeamReportPDF } from "@/utils/downloadTeamReport"; // teamlead direct PDF
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

// Types (optional / for clarity)
interface TeamMember {
  id: string | number;
  name: string;
  designation?: string;
  position?: string;
  photo?: string;
  rating?: number;
  performance?: number;
  notes?: string;
  comment?: string;
  comments?: string;
}

function Reports(props: { role?: string }) {
  const { role = "" } = props;

  // Report options / state
  const [departmentId, setDepartmentId] = useState<string>("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const isTeamLead = role?.toLowerCase?.() === "teamlead";

  const [reportType, setReportType] = useState('performance');
  const [dateRange, setDateRange] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [generating, setGenerating] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<'all' | 'engineering' | 'marketing' | 'sales' | 'hr'>('all');

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

  const [recentReports, setRecentReports] = useState<Array<{
    id: number;
    name: string;
    date: string;
    type: string;
    isFavorite: boolean;
  }>>([
    { id: 1, name: 'Performance Report - Q4', date: 'December 15, 2024', type: 'PDF', isFavorite: false },
    { id: 2, name: 'Financial Report - November', date: 'December 1, 2024', type: 'XLSX', isFavorite: true },
    { id: 3, name: 'Attendance Report - Monthly', date: 'November 30, 2024', type: 'CSV', isFavorite: false }
  ]);

  const [favoriteReports, setFavoriteReports] = useState<Array<{
    id: number;
    name: string;
    date: string;
    type: string;
    isFavorite: boolean;
  }>>([
    { id: 2, name: 'Financial Report - November', date: 'December 1, 2024', type: 'XLSX', isFavorite: true }
  ]);

  // Mock data source used by the page (same as before)
  const getDepartmentEmployees = (department: string): TeamMember[] => {
    const departmentEmployees: Record<string, TeamMember[]> = {
      engineering: [
        { id: 'TL001', name: 'John Smith', position: 'Developer', performance: 85, notes: 'Excellent performance' },
        { id: 'TL002', name: 'Sarah Johnson', position: 'Designer', performance: 92, notes: 'Consistent high quality work' },
        { id: 'TL003', name: 'Michael Brown', position: 'QA Tester', performance: 78, notes: 'Good attention to detail' },
        { id: 'TL004', name: 'Emily Davis', position: 'Developer', performance: 88, notes: 'Fast learner' },
        { id: 'TL005', name: 'Robert Wilson', position: 'Developer', performance: 75, notes: 'Needs mentoring' },
      ],
      marketing: [
        { id: 'EMP004', name: 'Lisa Chen', position: 'Marketing Manager', performance: 90 },
        { id: 'EMP005', name: 'David Wilson', position: 'Content Specialist', performance: 85 }
      ],
      sales: [
        { id: 'EMP006', name: 'Emily Brown', position: 'Sales Manager', performance: 94 },
        { id: 'EMP007', name: 'Robert Lee', position: 'Sales Representative', performance: 87 }
      ],
      hr: [
        { id: 'EMP008', name: 'Jennifer White', position: 'HR Manager', performance: 89 }
      ]
    };

    if (department === 'all') {
      return Object.values(departmentEmployees).flat();
    }
    return departmentEmployees[department] || [];
  };

  // TeamLead: direct PDF from this page’s dataset (no /export, no mock fallback elsewhere)
  const handleGenerateReport = async () => {
    if (isTeamLead) {
      try {
        setGenerating(true);

        // Build rows from the same dataset the page shows
        const source = getDepartmentEmployees(selectedDepartment);
        const rows = (source || []).map((e) => ({
          photo: e.photo ?? "", // left blank unless you provide a data URL
          id: e.id ?? "",
          name: e.name ?? "",
          designation: e.position ?? e.designation ?? "—",
          rating:
            typeof e.performance === "number"
              ? `${e.performance}%`
              : (typeof e.rating === "number" ? `${e.rating}%` : "—"),
          notes: e.notes ?? e.comment ?? e.comments ?? "—",
        }));

        console.log("TL export rows ->", rows.length, rows[0]);

        await downloadTeamReportPDF(rows, {
          title: "Team Performance Report",
          departmentId: selectedDepartment,
          dateFrom,
          dateTo,
        });
      } finally {
        setGenerating(false);
      }
      return;
    }

    // Keep non-TeamLead roles disabled (as before)
    console.log("Saved report generation disabled");
    setGenerating(false);
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

  // Saved report download remains disabled for Team Lead
  const handleDownloadReport = (reportName: string, reportFormat: string, reportTypeData?: string) => {
    if (isTeamLead) {
      console.log("Saved report download is intentionally disabled for TeamLead (use Generate Report)");
      return;
    }
    console.log("Saved report download disabled");
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
                <Select value={selectedDepartment} onValueChange={(v) => setSelectedDepartment(v as any)}>
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
                  type="button"
                  className="flex-1"
                  onClick={handleGenerateReport}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSaveReport(
                      `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
                      format.toUpperCase()
                    )
                  }
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
}

export default Reports;
