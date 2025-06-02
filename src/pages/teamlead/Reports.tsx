
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Calendar, Users, TrendingUp, BarChart3, Shield } from 'lucide-react';
import { generatePDFContent, generateExcelContent, downloadFile, prepareReportData } from '@/utils/reportGenerator';
import { toast } from 'sonner';

// Enhanced team data with proper structure for exports
const teamData = [
  { 
    id: 'TL001', 
    name: 'John Smith', 
    position: 'Senior Developer', 
    department: 'IT', 
    performance: 92, 
    rating: 92,
    email: 'john@company.com' 
  },
  { 
    id: 'TL002', 
    name: 'Sarah Johnson', 
    position: 'UI/UX Designer', 
    department: 'IT', 
    performance: 88, 
    rating: 88,
    email: 'sarah@company.com' 
  },
  { 
    id: 'TL003', 
    name: 'Mike Chen', 
    position: 'Frontend Developer', 
    department: 'IT', 
    performance: 85, 
    rating: 85,
    email: 'mike@company.com' 
  },
  { 
    id: 'TL004', 
    name: 'Lisa Anderson', 
    position: 'Backend Developer', 
    department: 'IT', 
    performance: 90, 
    rating: 90,
    email: 'lisa@company.com' 
  },
];

// Enhanced projects data
const departmentProjects = [
  { 
    id: 1, 
    name: 'Mobile App Development', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    progress: 75,
    deadline: '2024-03-15'
  },
  { 
    id: 2, 
    name: 'Web Platform Redesign', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    progress: 60,
    deadline: '2024-04-01'
  },
  { 
    id: 3, 
    name: 'Patient Management System', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'HealthCare Inc',
    progress: 85,
    deadline: '2024-02-28'
  },
];

const TeamLeadReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const [activeTab, setActiveTab] = useState('overview');

  // Team lead role and department restrictions
  const currentUser = JSON.parse(localStorage.getItem('user') || '{"role": "teamlead", "department": "IT"}');
  const userDepartment = 'IT'; // Restricted to IT department for team lead
  const userRole = 'teamlead';

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'current-week': return 'Current Week';
      case 'current-month': return 'Current Month';
      case 'current-quarter': return 'Current Quarter';
      case 'current-year': return 'Current Year';
      default: return 'Current Month';
    }
  };

  const validateAccess = () => {
    // Team leads can only access their own department data
    if (userRole !== 'teamlead') {
      toast.error('Access denied: Insufficient permissions');
      return false;
    }
    return true;
  };

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    if (!validateAccess()) {
      return;
    }

    try {
      let data;
      let filename;
      
      // Filter data to only include team lead's department
      const filteredTeamData = teamData.filter(member => member.department === userDepartment);
      const filteredProjectData = departmentProjects.filter(project => project.assignedDepartment === userDepartment);
      
      console.log('Generating report for team lead:', {
        userRole,
        userDepartment,
        teamMemberCount: filteredTeamData.length,
        projectCount: filteredProjectData.length
      });

      // Prepare data based on report type with proper structure
      switch (reportType) {
        case 'team-performance':
          data = {
            employees: filteredTeamData,
            reportType: 'Team Performance Report',
            dateRange: getPeriodLabel(selectedPeriod),
            teamLead: currentUser.name || 'Team Lead',
            department: userDepartment,
            userRole: userRole
          };
          filename = `team-performance-${userDepartment}-${selectedPeriod}`;
          break;
        case 'project-status':
          data = {
            projects: filteredProjectData,
            reportType: 'Project Status Report',
            dateRange: getPeriodLabel(selectedPeriod),
            teamLead: currentUser.name || 'Team Lead',
            department: userDepartment,
            userRole: userRole
          };
          filename = `project-status-${userDepartment}-${selectedPeriod}`;
          break;
        case 'department-overview':
          data = {
            employees: filteredTeamData,
            projects: filteredProjectData,
            reportType: 'Department Overview Report',
            dateRange: getPeriodLabel(selectedPeriod),
            teamLead: currentUser.name || 'Team Lead',
            department: userDepartment,
            userRole: userRole
          };
          filename = `department-overview-${userDepartment}-${selectedPeriod}`;
          break;
        default:
          data = {
            employees: filteredTeamData,
            reportType: 'General Report',
            dateRange: getPeriodLabel(selectedPeriod),
            teamLead: currentUser.name || 'Team Lead',
            department: userDepartment,
            userRole: userRole
          };
          filename = `general-report-${userDepartment}-${selectedPeriod}`;
      }

      // Validate data exists
      if (!data.employees?.length && !data.projects?.length) {
        toast.error('No data available for export');
        console.error('No data available for report generation');
        return;
      }

      const timestamp = new Date().toISOString().split('T')[0];
      filename = `${filename}-${timestamp}`;

      if (format === 'pdf') {
        const content = generatePDFContent(data);
        if (!content || content.trim().length === 0) {
          throw new Error('Generated PDF content is empty');
        }
        const success = downloadFile(content, `${filename}.txt`, 'text/plain');
        if (success) {
          console.log('PDF report generated successfully:', {
            reportType: data.reportType,
            department: userDepartment,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange,
            contentLength: content.length
          });
          toast.success('PDF report downloaded successfully');
        } else {
          throw new Error('Failed to download PDF file');
        }
      } else {
        const content = generateExcelContent(data);
        if (!content || content.trim().length === 0) {
          throw new Error('Generated CSV content is empty');
        }
        const success = downloadFile(content, `${filename}.csv`, 'text/csv');
        if (success) {
          console.log('CSV report generated successfully:', {
            reportType: data.reportType,
            department: userDepartment,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange,
            contentLength: content.length
          });
          toast.success('CSV report downloaded successfully');
        } else {
          throw new Error('Failed to download CSV file');
        }
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTeamStats = () => {
    // Only calculate stats for team lead's department
    const departmentTeam = teamData.filter(member => member.department === userDepartment);
    
    if (departmentTeam.length === 0) {
      return {
        avgPerformance: '0.0',
        topPerformer: 'No team members',
        activeProjects: 0,
        totalMembers: 0
      };
    }

    const avgPerformance = departmentTeam.reduce((sum, member) => sum + member.performance, 0) / departmentTeam.length;
    const topPerformer = departmentTeam.reduce((top, member) => 
      member.performance > top.performance ? member : top
    );
    const activeProjects = departmentProjects.filter(p => p.status === 'working' && p.assignedDepartment === userDepartment).length;

    return {
      avgPerformance: avgPerformance.toFixed(1),
      topPerformer: topPerformer.name,
      activeProjects,
      totalMembers: departmentTeam.length
    };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-600">Generate and download performance reports for your team</p>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-600">Department: {userDepartment} | Role: Team Lead</p>
          </div>
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
                <CardDescription>Current team member performance ratings - {userDepartment} Department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamData.filter(member => member.department === userDepartment).map((member) => (
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
                  {departmentProjects.filter(project => project.assignedDepartment === userDepartment).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-gray-600">{project.clientName}</p>
                        <p className="text-xs text-gray-500">Progress: {project.progress}%</p>
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
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Access Restrictions</p>
                    <p className="text-sm text-blue-800">
                      Reports are restricted to your department ({userDepartment}) data only. 
                      You can only download reports for your team members and assigned projects.
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Team members: {stats.totalMembers} | Active projects: {stats.activeProjects}
                    </p>
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
              <CardDescription>Detailed analytics for your team - {userDepartment} Department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800">High Performers</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {teamData.filter(m => m.department === userDepartment && m.performance >= 90).length}
                  </p>
                  <p className="text-sm text-green-700">Members with 90%+ performance</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Good Performers</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {teamData.filter(m => m.department === userDepartment && m.performance >= 80 && m.performance < 90).length}
                  </p>
                  <p className="text-sm text-blue-700">Members with 80-89% performance</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-orange-800">Needs Improvement</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {teamData.filter(m => m.department === userDepartment && m.performance < 80).length}
                  </p>
                  <p className="text-sm text-orange-700">Members below 80% performance</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Project Progress Summary</h3>
                <div className="space-y-2">
                  {departmentProjects.filter(p => p.assignedDepartment === userDepartment).map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <span className="text-sm">{project.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">{project.progress}%</span>
                      </div>
                    </div>
                  ))}
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
