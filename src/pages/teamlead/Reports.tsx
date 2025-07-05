
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  Users, 
  Clock, 
  Target,
  Building,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';
import { generatePerformanceReport, exportPerformanceReportPDF, downloadFile } from '@/utils/reportGenerator';
import { generateEnhancedCSVContent } from '@/utils/reportUtils';

const TeamLeadReports = () => {
  const { profile } = useAuth();
  const { data: reportData, loading: reportLoading, error } = usePerformanceReport(
    profile?.role || 'teamlead', 
    profile?.id || ''
  );
  
  const [reportType, setReportType] = useState('Performance Review');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [department, setDepartment] = useState('All Departments');
  const [isGenerating, setIsGenerating] = useState(false);

  // Enhanced report generation with better error handling
  const handleGenerateReport = async () => {
    if (!reportData) {
      toast.error('No data available for report generation');
      return;
    }

    setIsGenerating(true);
    toast.info('Generating PDF report...');

    try {
      const reportConfig = {
        reportType,
        dateRange,
        department,
        teamLead: profile?.name || 'Unknown',
        generatedBy: profile?.name || 'System',
        generatedAt: new Date().toISOString()
      };

      const performanceReport = generatePerformanceReport(reportData, reportType);
      if (!performanceReport) {
        toast.error('Failed to generate report data');
        return;
      }

      // Add configuration to report data
      const enhancedReportData = {
        ...performanceReport,
        ...reportConfig
      };

      await exportPerformanceReportPDF(
        enhancedReportData, 
        `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhanced CSV download with better data validation
  const handleDownloadCSV = () => {
    if (!reportData) {
      toast.error('No data available for CSV export');
      return;
    }

    toast.info('Generating CSV file...');

    try {
      const reportConfig = {
        reportType,
        dateRange,
        department,
        teamLead: profile?.name || 'Unknown',
        generatedBy: profile?.name || 'System'
      };

      const csvContent = generateEnhancedCSVContent(
        reportConfig,
        reportData.employees || [],
        reportData.projects || []
      );

      if (!csvContent || csvContent.trim() === '' || csvContent === 'Name,Position,Email,Performance\n') {
        toast.error('No data available to export');
        return;
      }

      const success = downloadFile(
        csvContent,
        `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
        'text/csv'
      );

      if (!success) {
        toast.error('Failed to download CSV file');
      }
    } catch (error: any) {
      console.error('Error generating CSV:', error);
      toast.error('Failed to generate CSV: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-200 text-green-800';
      case 'active': return 'bg-blue-200 text-blue-800';
      case 'on-hold': return 'bg-yellow-200 text-yellow-800';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Enhanced loading and error states
  if (reportLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4">Loading report data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
            <p className="text-gray-600">Generate and download performance reports</p>
          </div>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading report data: {error}. Please check your permissions and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasData = reportData && (
    (reportData.employees && reportData.employees.length > 0) ||
    (reportData.projects && reportData.projects.length > 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Generate and download performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDownloadCSV}
            variant="outline"
            disabled={isGenerating || !hasData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Enhanced performance metrics with better data validation */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{reportData?.reportMetrics?.totalEmployees || 0}</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {reportData?.reportMetrics?.avgPerformance ? 
                    reportData.reportMetrics.avgPerformance.toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-gray-600">Avg Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reportData?.reportMetrics?.activeProjects || 0}</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {reportData?.reportMetrics?.completionRate ? 
                    reportData.reportMetrics.completionRate.toFixed(1) : '0'}%
                </p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced report generation section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Performance Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance Review">Performance Review</SelectItem>
                  <SelectItem value="Project Summary">Project Summary</SelectItem>
                  <SelectItem value="Team Overview">Team Overview</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                  <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
                  <SelectItem value="This Year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  {reportData?.departments?.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || !hasData}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {isGenerating ? 'Generating...' : 'Generate PDF Report'}
            </Button>
            {!hasData && (
              <Alert className="flex-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  No data available for report generation. Please check that you have employees or projects assigned.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance Overview */}
      {reportData?.employees && reportData.employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Team Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.employees.slice(0, 5).map((member: any) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium">{member.profiles?.name || 'Unknown'}</h4>
                      <p className="text-sm text-gray-600">{member.position || 'No position'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      {member.departments?.name || 'No Department'}
                    </Badge>
                    <span className="text-sm font-medium">
                      {member.performance_rating || 0}% Performance
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Status Overview */}
      {reportData?.projects && reportData.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.projects.slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">
                      Client: {project.clients?.name || 'No client'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">
                      {project.departments?.name || 'No Department'}
                    </Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status || 'unknown'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {(!reportData?.employees || reportData.employees.length === 0) && 
       (!reportData?.projects || reportData.projects.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600">
              No employee or project data found for report generation.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamLeadReports;
