
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, FileText, Calendar, Users, TrendingUp, BarChart3, Lock, Star, Clock, Target, Award } from 'lucide-react';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
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
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
    joinDate: '2022-01-15',
    lastReview: '2024-11-01',
    profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    productivity: 95,
    collaboration: 88,
    timeliness: 94,
    innovation: 89
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    position: 'UI/UX Designer', 
    department: 'IT', 
    performance: 88, 
    email: 'sarah@company.com',
    projects: ['Design System', 'User Research', 'Mobile UI'],
    skills: ['Figma', 'User Research', 'Prototyping', 'Adobe Creative Suite'],
    joinDate: '2022-03-10',
    lastReview: '2024-10-28',
    profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    productivity: 91,
    collaboration: 95,
    timeliness: 87,
    innovation: 93
  },
  { 
    id: 3, 
    name: 'Mike Chen', 
    position: 'Frontend Developer', 
    department: 'IT', 
    performance: 85, 
    email: 'mike@company.com',
    projects: ['Web Platform', 'Component Library', 'Performance Optimization'],
    skills: ['Vue.js', 'CSS', 'JavaScript', 'Webpack'],
    joinDate: '2023-06-01',
    lastReview: '2024-11-05',
    profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    productivity: 88,
    collaboration: 82,
    timeliness: 90,
    innovation: 78
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
    profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    productivity: 93,
    collaboration: 87,
    timeliness: 95,
    innovation: 85
  },
  { 
    id: 5, 
    name: 'Robert Wilson', 
    position: 'QA Engineer', 
    department: 'IT', 
    performance: 78, 
    email: 'robert@company.com',
    projects: ['Test Automation', 'Quality Assurance', 'Bug Tracking'],
    skills: ['Selenium', 'Jest', 'Cypress', 'Testing Methodologies'],
    joinDate: '2023-09-15',
    lastReview: '2024-11-10',
    profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    productivity: 82,
    collaboration: 75,
    timeliness: 80,
    innovation: 70
  },
];

// Enhanced projects data with comprehensive details
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
    teamMembers: ['John Smith', 'Mike Chen'],
    budget: '$125,000',
    priority: 'High',
    description: 'Cross-platform mobile application with real-time features'
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
    teamMembers: ['Sarah Johnson', 'Mike Chen'],
    budget: '$85,000',
    priority: 'Medium',
    description: 'Complete UI/UX overhaul with modern design principles'
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
    teamMembers: ['Lisa Anderson', 'John Smith'],
    budget: '$200,000',
    priority: 'High',
    description: 'HIPAA-compliant patient data management system'
  },
  { 
    id: 4, 
    name: 'E-commerce Integration', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'RetailMax Corp',
    progress: 41,
    startDate: '2024-11-01',
    expectedCompletion: '2025-04-30',
    teamMembers: ['Lisa Anderson', 'Robert Wilson'],
    budget: '$150,000',
    priority: 'Medium',
    description: 'Payment gateway and inventory management integration'
  },
];

// Performance trend data for enhanced visualizations
const performanceTrendData = [
  { name: 'Jan', teamAvg: 82, individual: 85, satisfaction: 78 },
  { name: 'Feb', teamAvg: 84, individual: 87, satisfaction: 82 },
  { name: 'Mar', teamAvg: 86, individual: 89, satisfaction: 85 },
  { name: 'Apr', teamAvg: 85, individual: 88, satisfaction: 84 },
  { name: 'May', teamAvg: 88, individual: 91, satisfaction: 87 },
  { name: 'Jun', teamAvg: 90, individual: 93, satisfaction: 89 },
  { name: 'Jul', teamAvg: 89, individual: 92, satisfaction: 88 },
  { name: 'Aug', teamAvg: 91, individual: 94, satisfaction: 91 },
  { name: 'Sep', teamAvg: 88, individual: 91, satisfaction: 89 },
  { name: 'Oct', teamAvg: 92, individual: 95, satisfaction: 93 },
  { name: 'Nov', teamAvg: 90, individual: 93, satisfaction: 91 },
  { name: 'Dec', teamAvg: 93, individual: 96, satisfaction: 95 }
];

const projectStatusData = [
  { name: 'Q1', completed: 12, inProgress: 8, delayed: 2 },
  { name: 'Q2', completed: 15, inProgress: 10, delayed: 1 },
  { name: 'Q3', completed: 18, inProgress: 12, delayed: 3 },
  { name: 'Q4', completed: 22, inProgress: 14, delayed: 2 }
];

const skillsDistributionData = [
  { name: 'Frontend', value: 35, members: 3 },
  { name: 'Backend', value: 28, members: 2 },
  { name: 'Design', value: 22, members: 1 },
  { name: 'QA', value: 15, members: 1 }
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
          console.log('RESTRICTED PDF report generated:', {
            reportType: data.reportType,
            department: userDepartment,
            teamLead: currentUser.name,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange,
            restrictedAccess: true
          });
          toast.success(`PDF report downloaded successfully (${userDepartment} team only)`);
        } else {
          toast.error('Failed to download PDF report');
        }
      } else {
        const content = generateExcelContent(data);
        const success = downloadFile(content, `${filename}.csv`, 'text/csv');
        if (success) {
          console.log('RESTRICTED CSV report generated:', {
            reportType: data.reportType,
            department: userDepartment,
            teamLead: currentUser.name,
            employeeCount: data.employees?.length || 0,
            projectCount: data.projects?.length || 0,
            period: data.dateRange,
            restrictedAccess: true
          });
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
    const avgProjectProgress = departmentProjects.reduce((sum, project) => sum + project.progress, 0) / departmentProjects.length;

    return {
      avgPerformance: avgPerformance.toFixed(1),
      topPerformer: topPerformer.name,
      activeProjects,
      totalMembers: teamData.length,
      avgProjectProgress: avgProjectProgress.toFixed(1),
      highPerformers: teamData.filter(m => m.performance >= 90).length,
      projectsOnTrack: departmentProjects.filter(p => p.progress >= 70).length
    };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Reports Dashboard</h1>
          <p className="text-gray-600">Comprehensive analytics and reporting for your team</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Department: {userDepartment}
            </Badge>
            <Badge variant="secondary" className="text-xs">Team Lead Access Only</Badge>
          </div>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-800">{stats.totalMembers}</p>
                <p className="text-sm text-blue-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-800">{stats.avgPerformance}%</p>
                <p className="text-sm text-green-600">Avg Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-800">{stats.activeProjects}</p>
                <p className="text-sm text-purple-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-800">{stats.avgProjectProgress}%</p>
                <p className="text-sm text-orange-600">Project Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-800">{stats.highPerformers}</p>
                <p className="text-sm text-yellow-600">High Performers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="download">Download Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart 
              data={performanceTrendData} 
              title="Performance Trends" 
              subtitle="Team vs Individual performance over time"
            />
            <BarChart 
              data={projectStatusData} 
              title="Project Status Overview" 
              subtitle="Quarterly project completion statistics"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Member Overview</CardTitle>
                <CardDescription>Quick performance snapshot of all team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamData.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={member.profileImage} alt={member.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={member.performance} className="w-20" />
                        <Badge 
                          variant={member.performance >= 90 ? 'default' : member.performance >= 80 ? 'secondary' : 'outline'}
                          className={member.performance >= 90 ? 'bg-green-500' : member.performance >= 80 ? 'bg-blue-500' : ''}
                        >
                          {member.performance}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Distribution</CardTitle>
                <CardDescription>Team expertise breakdown by domain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsDistributionData.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-sm text-gray-600">{skill.members} members</span>
                      </div>
                      <Progress value={skill.value} className="h-2" />
                      <p className="text-xs text-gray-500">{skill.value}% of team expertise</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {teamData.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.profileImage} alt={member.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.position}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall</span>
                      <Badge variant="outline">{member.performance}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Productivity</span>
                        <span>{member.productivity}%</span>
                      </div>
                      <Progress value={member.productivity} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Collaboration</span>
                        <span>{member.collaboration}%</span>
                      </div>
                      <Progress value={member.collaboration} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Timeliness</span>
                        <span>{member.timeliness}%</span>
                      </div>
                      <Progress value={member.timeliness} className="h-1" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Innovation</span>
                        <span>{member.innovation}%</span>
                      </div>
                      <Progress value={member.innovation} className="h-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departmentProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.clientName}</CardDescription>
                    </div>
                    <Badge 
                      variant={project.priority === 'High' ? 'destructive' : 'secondary'}
                      className={project.priority === 'High' ? '' : 'bg-yellow-100 text-yellow-800'}
                    >
                      {project.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-gray-600">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Date</p>
                        <p className="font-medium">{project.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected End</p>
                        <p className="font-medium">{project.expectedCompletion}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Budget</p>
                      <p className="font-semibold text-green-600">{project.budget}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Team Members</p>
                      <div className="flex flex-wrap gap-1">
                        {project.teamMembers.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Description</p>
                      <p className="text-sm">{project.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="download" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  Generate Reports - Restricted Access
                </CardTitle>
                <CardDescription>Download detailed reports for your team only. Cross-department access is restricted.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                >
                  <FileText className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => handleDownloadReport('csv')}
                  variant="outline"
                  className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lock className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
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
      </Tabs>
    </div>
  );
};

export default TeamLeadReports;
