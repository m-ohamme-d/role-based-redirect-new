import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Users, TrendingUp, BarChart3, Award, Lock, FileText, Target } from 'lucide-react';
import { useReportDownload } from '@/hooks/useReportDownload';
import { GenerateReportButton } from '@/components/GenerateReportButton';
import { downloadFile } from '@/utils/reportGenerator';
import { toast } from 'sonner';

// Enhanced team data with comprehensive realistic information
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
    timeliness: 92,
    salary: '$85,000',
    bonus: '$8,500',
    trainingHours: 24,
    certifications: ['AWS Certified', 'React Professional'],
    teamLead: 'Michael Johnson',
    location: 'New York',
    workType: 'Hybrid'
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
    timeliness: 85,
    salary: '$72,000',
    bonus: '$7,200',
    trainingHours: 32,
    certifications: ['UX Certification', 'Design Thinking'],
    teamLead: 'Michael Johnson',
    location: 'San Francisco',
    workType: 'Remote'
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
    timeliness: 86,
    salary: '$68,000',
    bonus: '$6,800',
    trainingHours: 18,
    certifications: ['Vue.js Certified', 'JavaScript ES6'],
    teamLead: 'Michael Johnson',
    location: 'Austin',
    workType: 'Hybrid'
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
    timeliness: 90,
    salary: '$82,000',
    bonus: '$8,200',
    trainingHours: 28,
    certifications: ['Python Professional', 'AWS Solutions Architect'],
    teamLead: 'Michael Johnson',
    location: 'Seattle',
    workType: 'On-site'
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
    timeliness: 89,
    salary: '$65,000',
    bonus: '$6,500',
    trainingHours: 20,
    certifications: ['ISTQB Certified', 'Automation Testing'],
    teamLead: 'Michael Johnson',
    location: 'Chicago',
    workType: 'Remote'
  }
];

// Enhanced projects data with comprehensive details
const departmentProjects = [
  { 
    id: 1, 
    name: 'Mobile App Development', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    clientIndustry: 'Technology',
    progress: 78,
    startDate: '2024-08-01',
    expectedCompletion: '2024-12-15',
    actualCompletion: null,
    teamMembers: ['John Smith', 'Mike Chen', 'Sarah Johnson'],
    budget: '$125,000',
    actualCost: '$98,000',
    priority: 'High',
    hoursSpent: 450,
    milestones: 8,
    completedMilestones: 6,
    riskLevel: 'Low',
    clientSatisfaction: 4.7,
    technologies: ['React Native', 'Node.js', 'MongoDB'],
    projectManager: 'Michael Johnson'
  },
  { 
    id: 2, 
    name: 'Web Platform Redesign', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'TechCorp Solutions',
    clientIndustry: 'Technology',
    progress: 65,
    startDate: '2024-09-15',
    expectedCompletion: '2025-01-30',
    actualCompletion: null,
    teamMembers: ['Sarah Johnson', 'Mike Chen', 'Emily Wilson'],
    budget: '$85,000',
    actualCost: '$55,000',
    priority: 'Medium',
    hoursSpent: 320,
    milestones: 6,
    completedMilestones: 4,
    riskLevel: 'Medium',
    clientSatisfaction: 4.5,
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    projectManager: 'Michael Johnson'
  },
  { 
    id: 3, 
    name: 'Patient Management System', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'HealthCare Inc',
    clientIndustry: 'Healthcare',
    progress: 52,
    startDate: '2024-10-01',
    expectedCompletion: '2025-03-15',
    actualCompletion: null,
    teamMembers: ['Lisa Anderson', 'John Smith', 'Emily Wilson'],
    budget: '$200,000',
    actualCost: '$104,000',
    priority: 'High',
    hoursSpent: 280,
    milestones: 10,
    completedMilestones: 5,
    riskLevel: 'High',
    clientSatisfaction: 4.8,
    technologies: ['Python', 'Django', 'PostgreSQL'],
    projectManager: 'Michael Johnson'
  },
  { 
    id: 4, 
    name: 'E-commerce Platform', 
    status: 'working', 
    assignedDepartment: 'IT', 
    clientName: 'Retail Masters',
    clientIndustry: 'Retail',
    progress: 89,
    startDate: '2024-07-01',
    expectedCompletion: '2024-12-01',
    actualCompletion: null,
    teamMembers: ['Mike Chen', 'Lisa Anderson'],
    budget: '$95,000',
    actualCost: '$84,500',
    priority: 'Medium',
    hoursSpent: 520,
    milestones: 7,
    completedMilestones: 6,
    riskLevel: 'Low',
    clientSatisfaction: 4.6,
    technologies: ['Vue.js', 'Python', 'MySQL'],
    projectManager: 'Michael Johnson'
  }
];

const TeamLeadReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [reportType, setReportType] = useState('team-performance');
  const [activeTab, setActiveTab] = useState('overview');
  const { downloadPerformanceReport, loading } = useReportDownload();

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

  const generateEnhancedPDFContent = (data: any) => {
    return `
=== ${data.reportType} ===
Generated: ${new Date().toLocaleString()}
Period: ${data.dateRange}
Department: ${data.department}
Team Lead: ${data.teamLead}

=== EXECUTIVE SUMMARY ===
Total Team Members: ${teamData.length}
Average Performance: ${(teamData.reduce((sum, member) => sum + member.performance, 0) / teamData.length).toFixed(1)}%
Total Hours Worked: ${teamData.reduce((sum, member) => sum + member.hoursWorked, 0)}
Total Tasks Completed: ${teamData.reduce((sum, member) => sum + member.tasksCompleted, 0)}
Average Client Satisfaction: ${(teamData.reduce((sum, member) => sum + member.clientSatisfaction, 0) / teamData.length).toFixed(1)}/5

=== TEAM PERFORMANCE DETAILS ===
${teamData.map(member => `
Employee: ${member.name}
Position: ${member.position}
Email: ${member.email}
Performance Rating: ${member.performance}%
Tasks Completed: ${member.tasksCompleted}
Hours Worked: ${member.hoursWorked}
Client Satisfaction: ${member.clientSatisfaction}/5
Productivity: ${member.productivity}%
Collaboration: ${member.collaboration}%
Timeliness: ${member.timeliness}%
Salary: ${member.salary}
Bonus: ${member.bonus}
Training Hours: ${member.trainingHours}
Certifications: ${member.certifications.join(', ')}
Work Type: ${member.workType}
Location: ${member.location}
Projects: ${member.projects.join(', ')}
Skills: ${member.skills.join(', ')}
Join Date: ${member.joinDate}
Last Review: ${member.lastReview}
`).join('\n')}

=== PROJECT STATUS REPORT ===
${departmentProjects.map(project => `
Project: ${project.name}
Client: ${project.clientName} (${project.clientIndustry})
Status: ${project.status}
Progress: ${project.progress}%
Budget: ${project.budget}
Actual Cost: ${project.actualCost}
Priority: ${project.priority}
Risk Level: ${project.riskLevel}
Start Date: ${project.startDate}
Expected Completion: ${project.expectedCompletion}
Team Members: ${project.teamMembers.join(', ')}
Technologies: ${project.technologies.join(', ')}
Hours Spent: ${project.hoursSpent}
Milestones: ${project.completedMilestones}/${project.milestones}
Client Satisfaction: ${project.clientSatisfaction}/5
Project Manager: ${project.projectManager}
`).join('\n')}

=== FINANCIAL SUMMARY ===
Total Project Budgets: $${departmentProjects.reduce((sum, project) => sum + parseInt(project.budget.replace(/[$,]/g, '')), 0).toLocaleString()}
Total Actual Costs: $${departmentProjects.reduce((sum, project) => sum + parseInt(project.actualCost.replace(/[$,]/g, '')), 0).toLocaleString()}
Total Team Salaries: $${teamData.reduce((sum, member) => sum + parseInt(member.salary.replace(/[$,]/g, '')), 0).toLocaleString()}
Total Bonuses: $${teamData.reduce((sum, member) => sum + parseInt(member.bonus.replace(/[$,]/g, '')), 0).toLocaleString()}

=== TRAINING & DEVELOPMENT ===
Total Training Hours: ${teamData.reduce((sum, member) => sum + member.trainingHours, 0)}
Total Certifications: ${teamData.reduce((sum, member) => sum + member.certifications.length, 0)}

=== ACCESS LOG ===
Report Generated By: ${data.generatedBy}
Access Level: Team Lead - ${data.department} Department Only
Timestamp: ${new Date().toISOString()}
`;
  };

  const generateEnhancedCSVContent = (data: any) => {
    const teamCSV = `
Employee Name,Position,Email,Performance %,Tasks Completed,Hours Worked,Client Satisfaction,Productivity %,Collaboration %,Timeliness %,Salary,Bonus,Training Hours,Certifications,Work Type,Location,Join Date,Last Review
${teamData.map(member => 
  `"${member.name}","${member.position}","${member.email}",${member.performance},${member.tasksCompleted},${member.hoursWorked},${member.clientSatisfaction},${member.productivity},${member.collaboration},${member.timeliness},"${member.salary}","${member.bonus}",${member.trainingHours},"${member.certifications.join('; ')}","${member.workType}","${member.location}","${member.joinDate}","${member.lastReview}"`
).join('\n')}

PROJECT DATA:
Project Name,Client,Industry,Status,Progress %,Budget,Actual Cost,Priority,Risk Level,Start Date,Expected Completion,Team Size,Technologies,Hours Spent,Milestones,Client Satisfaction,Project Manager
${departmentProjects.map(project => 
  `"${project.name}","${project.clientName}","${project.clientIndustry}","${project.status}",${project.progress},"${project.budget}","${project.actualCost}","${project.priority}","${project.riskLevel}","${project.startDate}","${project.expectedCompletion}",${project.teamMembers.length},"${project.technologies.join('; ')}",${project.hoursSpent},"${project.completedMilestones}/${project.milestones}",${project.clientSatisfaction},"${project.projectManager}"`
).join('\n')}
`;
    return teamCSV;
  };

  const handleDownloadReport = (format: 'pdf' | 'csv') => {
    if (!currentUser.name || currentUser.role !== 'teamlead') {
      toast.error('Access denied: Only team leads can download reports');
      return;
    }

    let data;
    let filename;
    let content;
    
    switch (reportType) {
      case 'team-performance':
        data = {
          reportType: 'Team Performance Report',
          teamLead: currentUser.name,
          department: userDepartment,
          dateRange: getPeriodLabel(selectedPeriod),
          restrictedAccess: true,
          generatedBy: `${currentUser.name} (Team Lead - ${userDepartment})`
        };
        filename = `team-performance-${userDepartment}-${selectedPeriod}`;
        break;
      case 'project-status':
        data = {
          reportType: 'Project Status Report',
          projects: departmentProjects,
          teamLead: currentUser.name,
          department: userDepartment,
          dateRange: getPeriodLabel(selectedPeriod),
          restrictedAccess: true,
          generatedBy: `${currentUser.name} (Team Lead - ${userDepartment})`
        };
        filename = `project-status-${userDepartment}-${selectedPeriod}`;
        break;
      default:
        toast.error('Invalid report type selected');
        return;
    }

    try {
      if (format === 'pdf') {
        content = generateEnhancedPDFContent(data);
        const success = downloadFile(content, `${filename}.txt`, 'text/plain');
        if (success) {
          toast.success(`PDF report downloaded successfully (${userDepartment} team only)`);
        } else {
          toast.error('Failed to download PDF report');
        }
      } else {
        content = generateEnhancedCSVContent(data);
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
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Download Enhanced PDF
                </Button>
                <Button 
                  onClick={() => handleDownloadReport('csv')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
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
