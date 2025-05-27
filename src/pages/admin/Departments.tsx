
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Building, Users, Briefcase, Check, X } from 'lucide-react';

// Mock departments data
const mockDepartments = [
  { 
    id: 1, 
    name: 'IT', 
    teamCount: 3, 
    employeeCount: 35, 
    manager: 'Robert Manager',
    clients: ['TechCorp', 'HealthCare Inc'],
    status: 'active'
  },
  { 
    id: 2, 
    name: 'HR', 
    teamCount: 1, 
    employeeCount: 12, 
    manager: 'Lisa Brown',
    clients: [],
    status: 'active'
  },
  { 
    id: 3, 
    name: 'Sales', 
    teamCount: 2, 
    employeeCount: 28, 
    manager: 'Mike Johnson',
    clients: ['Retail Masters', 'Commerce Plus'],
    status: 'active'
  },
  { 
    id: 4, 
    name: 'Marketing', 
    teamCount: 2, 
    employeeCount: 18, 
    manager: 'Sarah Wilson',
    clients: ['Brand Co', 'Digital Agency'],
    status: 'active'
  },
  { 
    id: 5, 
    name: 'Finance', 
    teamCount: 1, 
    employeeCount: 14, 
    manager: 'David Lee',
    clients: ['Finance Plus'],
    status: 'active'
  },
];

const AdminDepartments = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    status: 'active'
  });

  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager) {
      toast.error('Please fill in all required fields');
      return;
    }

    const department = {
      ...newDepartment,
      id: Math.max(...departments.map(d => d.id)) + 1,
      teamCount: 0,
      employeeCount: 0,
      clients: []
    };

    setDepartments([...departments, department]);
    setNewDepartment({ name: '', manager: '', status: 'active' });
    setShowCreateDialog(false);
    toast.success('Department created successfully');
    console.log('Department created and synced:', department);
  };

  const handleStartEdit = (deptId: number, currentName: string) => {
    setEditingDepartment(deptId);
    setEditName(currentName);
  };

  const handleSaveEdit = (deptId: number) => {
    if (!editName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }

    setDepartments(departments.map(dept => 
      dept.id === deptId ? { ...dept, name: editName.trim() } : dept
    ));
    
    setEditingDepartment(null);
    setEditName('');
    toast.success('Department name updated successfully');
    console.log('Department name updated and synced across dashboards:', { id: deptId, newName: editName });
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditName('');
  };

  const handleDeleteDepartment = (deptId: number) => {
    const department = departments.find(d => d.id === deptId);
    if (department && (department.employeeCount > 0 || department.teamCount > 0)) {
      toast.error(`Cannot delete department with ${department.employeeCount} employees and ${department.teamCount} teams`);
      return;
    }

    setDepartments(departments.filter(dept => dept.id !== deptId));
    toast.success('Department deleted successfully');
    console.log('Department deleted and synced:', deptId);
  };

  const toggleDepartmentStatus = (deptId: number) => {
    setDepartments(departments.map(dept => 
      dept.id === deptId 
        ? { ...dept, status: dept.status === 'active' ? 'inactive' : 'active' } 
        : dept
    ));
    toast.success('Department status updated');
    console.log('Department status toggled:', deptId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Create, rename, and manage departments with team and client links</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dept-name">Department Name</Label>
                <Input
                  id="dept-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="dept-manager">Department Manager</Label>
                <Input
                  id="dept-manager"
                  value={newDepartment.manager}
                  onChange={(e) => setNewDepartment({...newDepartment, manager: e.target.value})}
                  placeholder="Enter manager name"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDepartment}>
                  Create Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-gray-600">Total Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{departments.reduce((sum, dept) => sum + dept.clients.length, 0)}</p>
                <p className="text-sm text-gray-600">Linked Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{departments.filter(d => d.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Active Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {editingDepartment === department.id ? (
                    <div className="flex items-center gap-2">
                      <Input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="max-w-[120px] h-8"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(department.id);
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(department.id)}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <span 
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleStartEdit(department.id, department.name)}
                    >
                      {department.name}
                    </span>
                  )}
                </CardTitle>
                <Badge 
                  variant={department.status === 'active' ? 'default' : 'destructive'}
                  className={`cursor-pointer ${department.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                  onClick={() => toggleDepartmentStatus(department.id)}
                >
                  {department.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Manager: <span className="font-medium">{department.manager}</span></p>
                <p className="text-sm text-gray-600">Teams: <span className="font-medium">{department.teamCount}</span></p>
                <p className="text-sm text-gray-600">Employees: <span className="font-medium">{department.employeeCount}</span></p>
              </div>
              
              {department.clients.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Linked Clients:</p>
                  <div className="flex flex-wrap gap-1">
                    {department.clients.map((client, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {client}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStartEdit(department.id, department.name)}
                  disabled={editingDepartment === department.id}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteDepartment(department.id)}
                  disabled={department.employeeCount > 0 || department.teamCount > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDepartments;
