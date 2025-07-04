
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Building, Users, Briefcase, Check, X, AlertTriangle } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';

// Mock departments data with enhanced details
const AdminDepartments = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  
  // Enhanced department data structure
  const [departmentDetails, setDepartmentDetails] = useState<Record<string, any>>({
    'IT': { teamCount: 3, employeeCount: 35, manager: 'Robert Manager', clients: ['TechCorp', 'HealthCare Inc'], status: 'active' },
    'HR': { teamCount: 1, employeeCount: 12, manager: 'Lisa Brown', clients: [], status: 'active' },
    'Sales': { teamCount: 2, employeeCount: 28, manager: 'Mike Johnson', clients: ['Retail Masters', 'Commerce Plus'], status: 'active' },
    'Marketing': { teamCount: 2, employeeCount: 18, manager: 'Sarah Wilson', clients: ['Brand Co', 'Digital Agency'], status: 'active' },
    'Finance': { teamCount: 1, employeeCount: 14, manager: 'David Lee', clients: ['Finance Plus'], status: 'active' },
    'Administration': { teamCount: 1, employeeCount: 8, manager: 'Admin Lead', clients: [], status: 'active' }
  });

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    status: 'active'
  });
  
  // For enhanced department options
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState({
    budget: '',
    location: '',
    workType: 'hybrid'
  });

  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (addDepartment(newDepartment.name)) {
      // Add default details for new department
      setDepartmentDetails(prev => ({
        ...prev,
        [newDepartment.name]: {
          teamCount: 0,
          employeeCount: 0,
          manager: newDepartment.manager,
          clients: [],
          status: newDepartment.status,
          options: showAdvancedOptions ? departmentOptions : null
        }
      }));

      setNewDepartment({ name: '', manager: '', status: 'active' });
      setDepartmentOptions({ budget: '', location: '', workType: 'hybrid' });
      setShowAdvancedOptions(false);
      setShowCreateDialog(false);
      toast.success('Department created successfully - synced to Manager dashboard');
    } else {
      toast.error('Department already exists');
    }
  };

  const handleStartEdit = (deptName: string) => {
    setEditingDepartment(deptName);
    setEditName(deptName);
  };

  const handleSaveEdit = (oldName: string) => {
    if (!editName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }

    if (updateDepartment(oldName, editName.trim())) {
      // Update department details with new name
      setDepartmentDetails(prev => {
        const { [oldName]: oldDetails, ...rest } = prev;
        return {
          ...rest,
          [editName.trim()]: oldDetails || { teamCount: 0, employeeCount: 0, manager: '', clients: [], status: 'active' }
        };
      });

      setEditingDepartment(null);
      setEditName('');
      toast.success('Department name updated successfully - synced to Manager dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setEditName('');
  };

  const confirmDeleteDepartment = (deptName: string) => {
    // Allow deletion even with teams or users
    if (deleteDepartment(deptName)) {
      // Remove department details
      setDepartmentDetails(prev => {
        const { [deptName]: removed, ...rest } = prev;
        return rest;
      });

      toast.success('Department deleted successfully - synced to Manager dashboard');
    } else {
      toast.error('Failed to delete department');
    }
  };

  const toggleDepartmentStatus = (deptName: string) => {
    setDepartmentDetails(prev => ({
      ...prev,
      [deptName]: {
        ...prev[deptName],
        status: prev[deptName]?.status === 'active' ? 'inactive' : 'active'
      }
    }));
    toast.success('Department status updated - synced to Manager dashboard');
  };

  // Get department details or default values
  const getDepartmentDetails = (deptName: string) => {
    return departmentDetails[deptName] || {
      teamCount: 0,
      employeeCount: 0,
      manager: 'Not assigned',
      clients: [],
      status: 'active'
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Create, rename, and manage departments with team and client links</p>
          <p className="text-sm text-blue-600">Changes automatically sync to Manager dashboard</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
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
              
              <div className="flex items-center justify-between py-2">
                <p className="text-sm font-medium">Advanced Options</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                >
                  {showAdvancedOptions ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showAdvancedOptions && (
                <div className="space-y-3 border p-3 rounded-md">
                  <div>
                    <Label htmlFor="dept-budget">Budget</Label>
                    <Input
                      id="dept-budget"
                      value={departmentOptions.budget}
                      onChange={(e) => setDepartmentOptions({...departmentOptions, budget: e.target.value})}
                      placeholder="Annual budget"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept-location">Location</Label>
                    <Input
                      id="dept-location"
                      value={departmentOptions.location}
                      onChange={(e) => setDepartmentOptions({...departmentOptions, location: e.target.value})}
                      placeholder="Office location"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept-worktype">Work Type</Label>
                    <select
                      id="dept-worktype"
                      value={departmentOptions.workType}
                      onChange={(e) => setDepartmentOptions({...departmentOptions, workType: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">Onsite</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              )}
              
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
                <p className="text-2xl font-bold">
                  {Object.values(departmentDetails).reduce((sum, dept) => sum + (dept?.employeeCount || 0), 0)}
                </p>
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
                <p className="text-2xl font-bold">
                  {Object.values(departmentDetails).reduce((sum, dept) => sum + (dept?.clients?.length || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">Linked Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">
                {Object.entries(departmentDetails).filter(([name, details]) => 
                  departments.includes(name) && details?.status === 'active'
                ).length}
              </p>
              <p className="text-sm text-gray-600">Active Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((deptName) => {
          const details = getDepartmentDetails(deptName);
          return (
            <Card key={deptName} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {editingDepartment === deptName ? (
                      <div className="flex items-center gap-2">
                        <Input 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          className="max-w-[120px] h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(deptName);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(deptName)}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => handleStartEdit(deptName)}
                      >
                        {deptName}
                      </span>
                    )}
                  </CardTitle>
                  <Badge 
                    variant={details.status === 'active' ? 'default' : 'destructive'}
                    className={`cursor-pointer ${details.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                    onClick={() => toggleDepartmentStatus(deptName)}
                  >
                    {details.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Manager: <span className="font-medium">{details.manager}</span></p>
                  <p className="text-sm text-gray-600">Teams: <span className="font-medium">{details.teamCount}</span></p>
                  <p className="text-sm text-gray-600">Employees: <span className="font-medium">{details.employeeCount}</span></p>
                </div>
                
                {details.clients.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Linked Clients:</p>
                    <div className="flex flex-wrap gap-1">
                      {details.clients.map((client: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {client}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {details.options && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Department Options:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {details.options.budget && (
                        <p className="text-gray-600">Budget: <span className="font-medium">{details.options.budget}</span></p>
                      )}
                      {details.options.location && (
                        <p className="text-gray-600">Location: <span className="font-medium">{details.options.location}</span></p>
                      )}
                      <p className="text-gray-600">Work Type: <span className="font-medium">{details.options.workType || 'Hybrid'}</span></p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartEdit(deptName)}
                    disabled={editingDepartment === deptName}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the "{deptName}" department? 
                          {details.employeeCount > 0 && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md">
                              <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                              <span className="text-orange-600">
                                Warning: This department has {details.employeeCount} employees and {details.teamCount} teams.
                                All team and employee associations will be lost.
                              </span>
                            </div>
                          )}
                          This action cannot be undone and will sync across all dashboards.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => confirmDeleteDepartment(deptName)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Department
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDepartments;
