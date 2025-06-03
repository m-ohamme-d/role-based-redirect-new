import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Calendar, Users, TrendingUp, BarChart3, Lock, Award, Clock, Target } from 'lucide-react';
import { generatePDFContent, generateExcelContent, downloadFile, prepareReportData } from '@/utils/reportGenerator';
import { toast } from 'sonner';

// Enhanced team data with more realistic and comprehensive information
const teamData = [
  { 
    id: 1, 
    name: 'John Smith', 
    position: 'Senior Developer', 
    department: 'IT', 
    performance: 92, 
    email: 'john@company.com',
    projects: ['Mobile App Development', 'API Integration', 'Database Optimization'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    joinDate: '2022-01-15',
    lastReview: '2024-11-01',
    hoursWorked: 168,
    tasksCompleted: 34,
    clientSatisfaction: 4.8,
    productivity: 95,
    collaboration: 88,
    timeliness: 92
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    position: 'UI/UX Designer', 
    department: 'IT', 
    performance: 88, 
    email: 'sarah@company.com',
    projects: ['Design System', 'User Research', 'Mobile App UI'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
    joinDate: '2022-03-10',
    lastReview: '2024-10-28',
    hoursWorked: 160,
    tasksCompleted: 28,
    clientSatisfaction: 4.6,
    productivity: 86,
    collaboration: 92,
    timeliness: 85
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    position: 'Frontend Developer', 
    department: 'IT', 
    performance: 85, 
    email: 'mike@company.com',
    projects: ['Web Platform', 'Component Library', 'E-commerce Frontend'],
    skills: ['Vue.js', 'CSS', 'JavaScript', 'Webpack'],
    joinDate: '2023-06-01',
    lastReview: '2024-11-05',
    hoursWorked: 164,
    tasksCompleted: 31,
    clientSatisfaction: 4.4,
    productivity: 83,
    collaboration: 87,
    timeliness: 86
  },
  { 
    id: 4, 
    name: 'Lisa Anderson', 
    position: 'Backend Developer', 
    department: 'IT', 
    performance: 90, 
    email: 'lisa@company.com',
    projects: ['Database Optimization', 'Security Implementation', 'API Development'],
    skills: ['Python', 'PostgreSQL', 'Docker', 'AWS'],
    joinDate: '2021-09-20',
    lastReview: '2024-10-30',
    hoursWorked: 172,
    tasksCompleted: 29,
    clientSatisfaction: 4.7,
    productivity: 91,
    collaboration: 89,
    timeliness: 90
  },
  { 
    id: 5, 
    name: 'Emily Wilson', 
    position: 'QA Engineer', 
    department: 'IT', 
    performance: 87, 
    email: 'emily@company.com',
    projects: ['Test Automation', 'Quality Assurance', 'Bug Tracking'],
    skills: ['Selenium', 'Jest', 'Cypress', 'Manual Testing'],
    joinDate: '2022-11-15',
    lastReview: '2024-11-10',
    hoursWorked: 156,
    tasksCompleted: 42,
    clientSatisfaction: 4.5,
    productivity: 88,
    collaboration: 85,
    timeliness: 89
  }
];

// Enhanced projects data
const departmentProjects = [
  { 
    id: 1, 
    name: 'Mobile App Development', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    progress: 78,
    startDate: '2024-08-01',
    expectedCompletion: '2024-12-15',
    teamMembers: ['John Smith', 'Mike Chen', 'Sarah Johnson'],
    budget: '$125,000',
    priority: 'High',
    hoursSpent: 450,
    milestones: 8,
    completedMilestones: 6
  },
  { 
    id: 2, 
    name: 'Web Platform Redesign', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    progress: 65,
    startDate: '2024-09-15',
    expectedCompletion: '2025-01-30',
    teamMembers: ['Sarah Johnson', 'Mike Chen', 'Emily Wilson'],
    budget: '$85,000',
    priority: 'Medium',
    hoursSpent: 320,
    milestones: 6,
    completedMilestones: 4
  },
  { 
    id: 3, 
    name: 'Patient Management System', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'HealthCare Inc',
    progress: 52,
    startDate: '2024-10-01',
    expectedCompletion: '2025-03-15',
    teamMembers: ['Lisa Anderson', 'John Smith', 'Emily Wilson'],
    budget: '$200,000',
    priority: 'High',
    hoursSpent: 280,
    milestones: 10,
    completedMilestones: 5
  },
  { 
    id: 4, 
    name: 'E-commerce Platform', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'Retail Masters',
    progress: 89,
    startDate: '2024-07-01',
    expectedCompletion: '2024-12-01',
    teamMembers: ['Mike Chen', 'Lisa Anderson'],
    budget: '$95,000',
    priority: 'Medium',
    hoursSpent: 520,
    milestones: 7,
    completedMilestones: 6
  }
];

const TeamLeadReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const [activeTab, setActiveTab] = useState('overview');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
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

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    if (!currentUser.name || currentUser.role !== 'teamlead') {
      toast.error('Access denied: Only team leads can download reports');
      return;
    }

    let data;
    let filename;
    
    switch (reportType) {
      case 'team-performance':
        data = prepareReportData(teamData, 'teamlead', userDepartment);
        data.reportType = 'Team Performance Report';
        data.teamLead = currentUser.name;
        data.department = userDepartment;
        filename = `team-performance-${userDepartment}-${selectedPeriod}`;
        break;
      case 'project-status':
        data = prepareReportData(departmentProjects, 'teamlead', userDepartment);
        data.reportType = 'Project Status Report';
        data.projects = departmentProjects;
        data.teamLead = currentUser.name;
        data.department = userDepartment;
        filename = `project-status-${userDepartment}-${selectedPeriod}`;
        break;
      default:
        toast.error('Invalid report type selected');
        return;
    }

    data.dateRange = getPeriodLabel(selectedPeriod);
    data.restrictedAccess = true;
    data.generatedBy = `${currentUser.name} (Team Lead - ${userDepartment})`;

    try {
      if (format === 'pdf') {
        const content = generatePDFContent(data);
        const success = downloadFile(content, `${filename}.txt`, 'text/plain');
        if (success) {
          toast.success(`PDF report downloaded successfully (${userDepartment} team only)`);
        } else {
          toast.error('Failed to download PDF report');
        }
      } else {
        const content = generateExcelContent(data);
        const success = downloadFile(content, `${filename}.csv`, 'text/csv');
        if (success) {
          toast.success(`CSV report downloaded successfully (${userDepartment} team only)`);
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
              <Clock className="h-6 w-6 text-indigo-600" />
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
                Generate Reports - Restricted Access
              </CardTitle>
              <CardDescription>Download detailed reports for your team only. You cannot access reports from other departments.</CardDescription>
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
                      <SelectItem value="team-performance">My Team Performance</SelectItem>
                      <SelectItem value="project-status">My Team Projects</SelectItem>
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

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-800 font-medium">Access Restrictions</p>
                    <ul className="text-sm text-red-700 mt-1 space-y-1">
                      <li>• Reports are restricted to your department ({userDepartment}) only</li>
                      <li>• You cannot download reports for other teams or departments</li>
                      <li>• All report downloads are logged and monitored</li>
                      <li>• Contact your manager for cross-department reports</li>
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
