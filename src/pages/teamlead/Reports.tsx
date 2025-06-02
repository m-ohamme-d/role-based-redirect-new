
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Calendar, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { generatePDFContent, generateExcelContent, downloadFile, prepareReportData } from '@/utils/reportGenerator';
import { toast } from 'sonner';

// Mock team data for team lead's specific department
const teamData = [
  { id: 1, name: 'John Smith', position: 'Senior Developer', department: 'IT', performance: 92, email: 'john@company.com' },
  { id: 2, name: 'Sarah Johnson', position: 'UI/UX Designer', department: 'IT', performance: 88, email: 'sarah@company.com' },
  { id: 3, name: 'Mike Chen', position: 'Frontend Developer', department: 'IT', performance: 85, email: 'mike@company.com' },
  { id: 4, name: 'Lisa Anderson', position: 'Backend Developer', department: 'IT', performance: 90, email: 'lisa@company.com' },
];

// Mock projects data for the team lead's department
const departmentProjects = [
  { id: 1, name: 'Mobile App Development', status: 'working', assignedDepartment: 'IT', clientName: 'TechCorp Solutions' },
  { id: 2, name: 'Web Platform Redesign', status: 'working', assignedDepartment: 'IT', clientName: 'TechCorp Solutions' },
  { id: 3, name: 'Patient Management System', status: 'working', assignedDepartment: 'IT', clientName: 'HealthCare Inc' },
];

const TeamLeadReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userDepartment = 'IT'; // This would come from user session/context

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'current-week': return 'Current Week';
      case 'current-month': return 'Current Month';
      case 'current-quarter': return 'Current Quarter';
      case 'current-year': return 'Current Year';
      default: return 'Current Month';
    }
  };

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    let data;
    let filename;
    
    // Prepare data based on report type and user role restrictions
    switch (reportType) {
      case 'team-performance':
        data = prepareReportData(teamData, 'teamlead', userDepartment);
        data.reportType = 'Team Performance Report';
        filename = `team-performance-${selectedPeriod}`;
        break;
      case 'project-status':
        data = prepareReportData(departmentProjects, 'teamlead', userDepartment);
        data.reportType = 'Project Status Report';
        data.projects = departmentProjects;
        filename = `project-status-${selectedPeriod}`;
        break;
      case 'department-overview':
        data = prepareReportData([...teamData, ...departmentProjects], 'teamlead', userDepartment);
        data.reportType = 'Department Overview Report';
        data.employees = teamData;
        data.projects = departmentProjects;
        filename = `department-overview-${selectedPeriod}`;
        break;
      default:
        data = prepareReportData(teamData, 'teamlead', userDepartment);
        data.reportType = 'General Report';
        filename = `general-report-${selectedPeriod}`;
    }

    data.dateRange = getPeriodLabel(selectedPeriod);
    data.teamLead = currentUser.name || 'Team Lead';
    data.department = userDepartment;

    try {
      if (format === 'pdf') {
        const content = generatePDFContent(data);
        const success = downloadFile(content, `${filename}.txt`, 'text/plain');
        if (success) {
          console.log('PDF report generated:', {
            reportType: data.reportType,
            department: userDepartment,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange
          });
          toast.success('PDF report downloaded successfully');
        } else {
          toast.error('Failed to download PDF report');
        }
      } else {
        const content = generateExcelContent(data);
        const success = downloadFile(content, `${filename}.csv`, 'text/csv');
        if (success) {
          console.log('CSV report generated:', {
            reportType: data.reportType,
            department: userDepartment,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange
          });
          toast.success('CSV report downloaded successfully');
        } else {
          toast.error('Failed to download CSV report');
        }
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

    return {
      avgPerformance: avgPerformance.toFixed(1),
      topPerformer: topPerformer.name,
      activeProjects,
      totalMembers: teamData.length
    };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Generate and download performance reports for your team</p>
          <p className="text-sm text-gray-500">Department: {userDepartment}</p>
        </div>
      </div>

      {/* Summary Cards */}
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
            <div>
              <p className="text-lg font-bold text-orange-600">{stats.topPerformer}</p>
              <p className="text-sm text-gray-600">Top Performer</p>
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
                <CardDescription>Current team member performance ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamData.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Projects</CardTitle>
                <CardDescription>Projects assigned to {userDepartment} department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departmentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.clientName}</p>
                      </div>
                      <Badge 
                        variant={project.status === 'working' ? 'default' : 'destructive'}
                        className={project.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                      >
                        {project.status}
                      </Badge>
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
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Download detailed reports for your team's performance and projects</CardDescription>
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
                      <SelectItem value="team-performance">Team Performance</SelectItem>
                      <SelectItem value="project-status">Project Status</SelectItem>
                      <SelectItem value="department-overview">Department Overview</SelectItem>
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
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => handleDownloadReport('csv')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Reports are restricted to your department ({userDepartment}) data only. 
                  You can only download reports for your team members and assigned projects.
                </p>
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
