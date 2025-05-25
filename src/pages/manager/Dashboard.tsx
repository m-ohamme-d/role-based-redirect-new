
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown, User, BarChart3, Plus, Edit2, Bell } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

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

// Mock clients data
const clientsData = [
  { id: 1, name: 'TechCorp Solutions', practice: 'Software Development', activeProjects: 3 },
  { id: 2, name: 'HealthCare Inc', practice: 'Healthcare IT', activeProjects: 2 },
  { id: 3, name: 'Finance Plus', practice: 'Financial Services', activeProjects: 4 },
  { id: 4, name: 'Retail Masters', practice: 'E-commerce Solutions', activeProjects: 1 },
];

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
    { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
    { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
    { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
    { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
  ]);

  const [editingDept, setEditingDept] = useState<number | null>(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [editDeptName, setEditDeptName] = useState('');
  const [showAddDept, setShowAddDept] = useState(false);
  const [showClients, setShowClients] = useState(false);

  const handleEditDepartment = (deptId: number, currentName: string) => {
    setEditingDept(deptId);
    setEditDeptName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingDept && editDeptName.trim()) {
      setDepartments(departments.map(dept => 
        dept.id === editingDept ? { ...dept, name: editDeptName.trim() } : dept
      ));
      setEditingDept(null);
      setEditDeptName('');
      toast.success('Department name updated successfully');
    }
  };

  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      const newDept = {
        id: Math.max(...departments.map(d => d.id)) + 1,
        name: newDeptName.trim(),
        employeeCount: 0,
        growth: '0%',
        trend: 'neutral' as const
      };
      setDepartments([...departments, newDept]);
      setNewDeptName('');
      setShowAddDept(false);
      toast.success('Department added successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowClients(true)}
            className="text-sm font-medium"
          >
            View Clients
          </Button>
          <Link to="/manager/profile" className="text-blue-600 hover:underline text-sm font-medium">
            View Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees"
          value="107"
          icon={<Users size={24} />}
          change="+5.3% from last month"
          trend="up"
        />
        <StatCard 
          title="New Employees"
          value="12"
          icon={<User size={24} />}
          change="+2 from last week"
          trend="up"
        />
        <StatCard 
          title="Departments"
          value={departments.length.toString()}
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Average Performance"
          value="78%"
          icon={<BarChart3 size={24} />}
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

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Department Map</CardTitle>
            <Dialog open={showAddDept} onOpenChange={setShowAddDept}>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="Enter department name"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddDept(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDepartment}>
                      Add Department
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => (
                <div key={dept.id}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/manager/department/${dept.id}`} className="flex-1">
                          <div>
                            <h3 className="font-semibold">{dept.name}</h3>
                            <p className="text-sm text-gray-500">{dept.employeeCount} employees</p>
                          </div>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(dept.id, dept.name)}
                          className="p-1 h-auto"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className={`text-sm font-medium flex items-center ${
                        dept.trend === 'up' ? 'text-green-500' : 
                        dept.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {dept.growth}
                        {dept.trend === 'up' && <ArrowUp size={16} className="ml-1" />}
                        {dept.trend === 'down' && <ArrowDown size={16} className="ml-1" />}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {editingDept === dept.id && (
                    <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                      <Input
                        value={editDeptName}
                        onChange={(e) => setEditDeptName(e.target.value)}
                        className="mb-2"
                        placeholder="Department name"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingDept(null)}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Dialog */}
      <Dialog open={showClients} onOpenChange={setShowClients}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Client Portfolio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {clientsData.map(client => (
              <Card key={client.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{client.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{client.practice}</p>
                      <p className="text-sm text-blue-600">{client.activeProjects} active projects</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Projects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;
