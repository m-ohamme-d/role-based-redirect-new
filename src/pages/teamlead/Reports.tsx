import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Users, TrendingUp, BarChart3, Award, Lock, FileText, Target, Loader2 } from 'lucide-react';
import { useReportDownload } from '@/hooks/useReportDownload';
import { GenerateReportButton } from '@/components/GenerateReportButton';
import { downloadFile, generatePDFContent } from '@/utils/reportGenerator';
import { toast } from 'sonner';
import { teamData } from '@/data/mockTeamData';
import { departmentProjects } from '@/data/mockProjectData';
import { generateEnhancedPDFContent, generateEnhancedCSVContent } from '@/utils/reportUtils';
import { useAuth } from '@/contexts/AuthContext';
import { usePerformanceReport } from '@/hooks/usePerformanceReport';

const TeamLeadReports = () => {
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const [activeTab, setActiveTab] = useState('overview');
  const { downloadPerformanceReport, loading: oldLoading } = useReportDownload();
  const { fetch, loading } = usePerformanceReport(profile?.role || 'teamlead', profile?.id || '');

  const userDepartment = 'IT';

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'current-week': return 'Current Week';
      case 'current-month': return 'Current Month';
      case 'current-quarter': return 'Current Quarter';
      case 'current-year': return 'Current Year';
      default: return 'Current Month';
    }
  };

  const handleDownloadReport = async (format: 'pdf' | 'csv') => {
    if (!profile?.name || profile?.role !== 'teamlead') {
      toast.error('Access denied: Only team leads can download reports');
      return;
    }

    toast('Download started');
    
    try {
      const data = await fetch();
      if (!data || data.length === 0) {
        toast.error('No records');
        return;
      }

      const reportData = {
        reportType: `Team Lead ${reportType.replace('-', ' ').toUpperCase()} Report`,
        teamLead: profile?.name || 'Unknown',
        department: userDepartment,
        dateRange: getPeriodLabel(selectedPeriod),
        restrictedAccess: true,
        generatedBy: `${profile?.name || 'Unknown'} (Team Lead - ${userDepartment})`,
        employees: data
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'pdf') {
        content = generatePDFContent(reportData);
        filename = `teamlead-report-${reportType}-${selectedPeriod}.txt`;
        mimeType = 'text/plain';
      } else {
        content = 'Name,Position,Performance,Email,Department\n';
        data.forEach((emp: any) => {
          content += `"${emp.profiles?.name || 'N/A'}","${emp.position || 'N/A'}",${emp.performance_rating || 0},"${emp.profiles?.email || 'N/A'}","${emp.departments?.name || 'N/A'}"\n`;
        });
        filename = `teamlead-report-${reportType}-${selectedPeriod}.csv`;
        mimeType = 'text/csv';
      }

      const success = downloadFile(content, filename, mimeType);
      if (success) {
        toast.success(`Report downloaded successfully (${userDepartment} team only)`);
      } else {
        toast.error('Failed to download report');
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error('Failed to generate report');
    }
  };

  const getTeamStats = () => {
    const avgPerformance = teamData.reduce((sum, member) => sum + member.performance, 0) / teamData.length;
    const topPerformer = teamData.reduce((top, member) => 
      member.performance > top.performance ? member : top
    );
    const activeProjects = departmentProjects.filter(p => p.status === 'working').length;
    const totalHours = teamData.reduce((sum, member) => sum + member.hoursWorked, 0);
    const totalTasks = teamData.reduce((sum, member) => sum + member.tasksCompleted, 0);
    const avgClientSatisfaction = teamData.reduce((sum, member) => sum + member.clientSatisfaction, 0) / teamData.length;

    return {
      avgPerformance: avgPerformance.toFixed(1),
      topPerformer: topPerformer.name,
      activeProjects,
      totalMembers: teamData.length,
      totalHours,
      totalTasks,
      avgClientSatisfaction: avgClientSatisfaction.toFixed(1)
    };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Generate and download performance reports for your team</p>
          <p className="text-sm text-gray-500">Department: {userDepartment} | Access: Team Lead Only</p>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
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
                <p className="text-2xl font-bold">{stats.avgPerformance}%</p>
                <p className="text-sm text-gray-600">Avg Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeProjects}</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-lg font-bold text-orange-600">{stats.topPerformer}</p>
                <p className="text-sm text-gray-600">Top Performer</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-indigo-600" />
              <div>
                <p className="text-xl font-bold">{stats.totalHours}</p>
                <p className="text-sm text-gray-600">Total Hours This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-cyan-600" />
              <div>
                <p className="text-xl font-bold">{stats.totalTasks}</p>
                <p className="text-sm text-gray-600">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="text-xl font-bold">{stats.avgClientSatisfaction}/5</p>
                <p className="text-sm text-gray-600">Client Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="download">Download Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Current team member performance ratings with detailed metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamData.map((member) => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.position}</p>
                        </div>
                        <Badge 
                          variant={member.performance >= 90 ? 'default' : member.performance >= 80 ? 'secondary' : 'outline'}
                          className={member.performance >= 90 ? 'bg-green-500' : member.performance >= 80 ? 'bg-blue-500' : ''}
                        >
                          {member.performance}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>Tasks: {member.tasksCompleted}</div>
                        <div>Hours: {member.hoursWorked}</div>
                        <div>Rating: {member.clientSatisfaction}/5</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Projects</CardTitle>
                <CardDescription>Projects assigned to {userDepartment} department with progress tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentProjects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{project.name}</p>
                          <p className="text-sm text-gray-600">{project.clientName}</p>
                        </div>
                        <Badge 
                          variant={project.status === 'working' ? 'default' : 'destructive'}
                          className={project.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                        >
                          {project.progress}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>Budget: {project.budget}</div>
                        <div>Team: {project.teamMembers.length}</div>
                        <div>Milestones: {project.completedMilestones}/{project.milestones}</div>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                Generate Enhanced Reports - Restricted Access
              </CardTitle>
              <CardDescription>Download comprehensive reports with detailed team and project data. Reports include financial data, training records, and performance analytics.</CardDescription>
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
                      <SelectItem value="team-performance">Comprehensive Team Performance</SelectItem>
                      <SelectItem value="project-status">Detailed Project Portfolio</SelectItem>
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

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Report Contents Include:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Detailed employee performance metrics and ratings</li>
                  <li>• Comprehensive project status and financial data</li>
                  <li>• Training records and certification tracking</li>
                  <li>• Client satisfaction scores and feedback</li>
                  <li>• Salary, bonus, and compensation details</li>
                  <li>• Resource allocation and time tracking</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => handleDownloadReport('pdf')}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                  Download Enhanced PDF
                </Button>
                <Button 
                  onClick={() => handleDownloadReport('csv')}
                  disabled={loading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download Enhanced CSV
                </Button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Access Restrictions</p>
                    <ul className="text-sm text-red-700 mt-1 space-y-1">
                      <li>• Reports contain sensitive financial and performance data</li>
                      <li>• Access restricted to {userDepartment} department only</li>
                      <li>• All downloads are logged and monitored</li>
                      <li>• Reports include salary, bonus, and compensation details</li>
                      <li>• Contact your manager for cross-department access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Detailed analytics for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">High Performers</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {teamData.filter(m => m.performance >= 90).length}
                  </p>
                  <p className="text-sm text-green-700">Members with 90%+ performance</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Good Performers</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {teamData.filter(m => m.performance >= 80 && m.performance < 90).length}
                  </p>
                  <p className="text-sm text-blue-700">Members with 80-89% performance</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800">Needs Improvement</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {teamData.filter(m => m.performance < 80).length}
                  </p>
                  <p className="text-sm text-orange-700">Members below 80% performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadReports;
