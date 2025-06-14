import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown, User, BarChart3, Eye, Bell, UserPlus } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for charts
const employeeOverviewData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 40 },
];

const employeeProgressData = [
  { name: 'IT', value: 85 },
  { name: 'HR', value: 65 },
  { name: 'Sales', value: 76 },
  { name: 'Marketing', value: 90 },
  { name: 'Finance', value: 70 },
];

// Mock clients data with enhanced structure
const clientsData = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    company: 'TechCorp Inc.', 
    status: 'working',
    projects: [
      { id: 1, name: 'Mobile App Development', status: 'working' },
      { id: 2, name: 'Web Platform Redesign', status: 'working' }
    ]
  },
  { 
    id: 2, 
    name: 'HealthCare Inc', 
    company: 'HealthCare Systems', 
    status: 'working',
    projects: [
      { id: 3, name: 'Patient Management System', status: 'working' },
      { id: 4, name: 'Telemedicine Platform', status: 'stopped' }
    ]
  },
  { 
    id: 3, 
    name: 'Finance Plus', 
    company: 'Financial Services Ltd', 
    status: 'stopped',
    projects: [
      { id: 5, name: 'Trading Platform', status: 'stopped' }
    ]
  },
  { 
    id: 4, 
    name: 'Retail Masters', 
    company: 'Retail Solutions', 
    status: 'working',
    projects: [
      { id: 6, name: 'E-commerce Migration', status: 'working' }
    ]
  },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [departments] = useState([
    { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
    { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
    { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
    { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
    { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
  ]);

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [showAssignProjectDialog, setShowAssignProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setShowClientDialog(true);
  };

  const handleViewAllClients = () => {
    navigate('/manager/clients');
    console.log('Navigating to full client portfolio');
  };

  const toggleProjectStatus = (projectId: number) => {
    if (selectedClient) {
      const updatedProjects = selectedClient.projects.map((project: any) => 
        project.id === projectId 
          ? { ...project, status: project.status === 'working' ? 'stopped' : 'working' }
          : project
      );
      setSelectedClient({ ...selectedClient, projects: updatedProjects });
      toast.success('Project status updated');
    }
  };

  const handleAssignProject = (project: any) => {
    setSelectedProject(project);
    setShowAssignProjectDialog(true);
  };

  const assignProjectToDepartment = (departmentName: string) => {
    if (selectedProject && selectedClient) {
      const updatedProjects = selectedClient.projects.map((project: any) => 
        project.id === selectedProject.id 
          ? { ...project, department: departmentName }
          : project
      );
      setSelectedClient({ ...selectedClient, projects: updatedProjects });
      setShowAssignProjectDialog(false);
      setSelectedProject(null);
      toast.success(`Project "${selectedProject.name}" assigned to ${departmentName} department`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <div className="flex gap-2">
          <Dialog open={showAlertsDialog} onOpenChange={setShowAlertsDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-yellow-500" />
                Send Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Performance Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Send performance report reminders to all Team Leads
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAlertsDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    toast.success('Performance report alert sent to all Team Leads');
                    setShowAlertsDialog(false);
                  }}>
                    Send Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees"
          value="107"
          icon={<Users size={24} color="#2563eb" />} /* Blue */
          change="+5.3% from last month"
          trend="up"
        />
        <StatCard 
          title="New Employees"
          value="12"
          icon={<User size={24} color="#22c55e" />} /* Green */
          change="+2 from last week"
          trend="up"
        />
        <StatCard 
          title="Departments"
          value={departments.length.toString()}
          icon={<Users size={24} color="#10b981" />} /* Emerald */
        />
        <StatCard 
          title="Average Performance"
          value="78%"
          icon={<BarChart3 size={24} color="#f59e42" />} /* Orange */
          change="+2.5% from last quarter"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={employeeOverviewData} 
          title="Employee Overview" 
          subtitle="Employee count over time"
        />
        <BarChart 
          data={employeeProgressData} 
          title="Department Performance" 
          subtitle="Average performance by department"
        />
      </div>

      {/* Clients Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Portfolio</CardTitle>
            <Button 
              onClick={handleViewAllClients}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4 text-sky-600" />
              View All Clients
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientsData.slice(0, 3).map(client => (
              <Card 
                key={client.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClientClick(client)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.company}</p>
                    <Badge 
                      variant={client.status === 'working' ? 'default' : 'destructive'}
                      className={client.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {client.status === 'working' ? 'Working' : 'Stopped'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Map - Read Only */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map(dept => (
              <Card key={dept.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <Link to={`/manager/department/${dept.id}`}>
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-sm text-gray-500">{dept.employeeCount} employees</p>
                    </div>
                  </Link>
                  <div className={`text-sm font-medium flex items-center mt-2 ${
                    dept.trend === 'up' ? 'text-green-500' : 
                    dept.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {dept.growth}
                    {dept.trend === 'up' && <ArrowUp size={16} className="ml-1" color="#22c55e" />}  {/* Green */}
                    {dept.trend === 'down' && <ArrowDown size={16} className="ml-1" color="#ef4444" />} {/* Red */}
                    {dept.trend === 'neutral' && null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Client Projects Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?.name} - Projects
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedClient?.projects.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={project.status === 'working' ? 'default' : 'destructive'}
                          className={`${project.status === 'working' ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          {project.status === 'working' ? 'Working' : 'Stopped'}
                        </Badge>
                        {project.department && (
                          <Badge variant="outline">
                            {project.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleProjectStatus(project.id)}
                      >
                        {project.status === 'working'
                          ? <ArrowDown className="mr-1 text-red-500" size={16} />
                          : <ArrowUp className="mr-1 text-green-500" size={16} />}
                        Mark as {project.status === 'working' ? 'Stopped' : 'Working'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignProject(project)}
                        className="flex items-center gap-2"
                      >
                        <UserPlus className="h-4 w-4 text-blue-500" />
                        Assign Dept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Project Dialog */}
      <Dialog open={showAssignProjectDialog} onOpenChange={setShowAssignProjectDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Assign Project to Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProject && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{selectedProject.name}</h3>
                <p className="text-sm text-gray-600">
                  Current: {selectedProject.department || 'Unassigned'}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Department:</label>
              <Select onValueChange={assignProjectToDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAssignProjectDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;
