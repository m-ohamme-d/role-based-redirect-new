
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Building } from 'lucide-react';
import { toast } from 'sonner';

interface Department {
  id: number;
  name: string;
  employeeCount: number;
  teamLeads: string[];
  description?: string;
}

const DepartmentManager = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'IT', employeeCount: 35, teamLeads: ['Sarah Lead'], description: 'Information Technology Department' },
    { id: 2, name: 'HR', employeeCount: 12, teamLeads: ['Mike HR'], description: 'Human Resources Department' },
    { id: 3, name: 'Sales', employeeCount: 28, teamLeads: ['John Sales'], description: 'Sales Department' },
    { id: 4, name: 'Marketing', employeeCount: 18, teamLeads: ['Lisa Marketing'], description: 'Marketing Department' },
    { id: 5, name: 'Finance', employeeCount: 14, teamLeads: ['Robert Finance'], description: 'Finance Department' },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    teamLeads: [] as string[]
  });

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast.error('Department name is required');
      return;
    }

    const department: Department = {
      id: Math.max(...departments.map(d => d.id)) + 1,
      name: newDepartment.name.trim(),
      employeeCount: 0,
      teamLeads: newDepartment.teamLeads,
      description: newDepartment.description.trim()
    };

    const updatedDepartments = [...departments, department];
    setDepartments(updatedDepartments);
    
    setNewDepartment({ name: '', description: '', teamLeads: [] });
    setShowAddDialog(false);
    
    console.log('Department added:', department);
    console.log('Updated departments:', updatedDepartments);
    toast.success('Department added successfully');
  };

  const handleEditDepartment = () => {
    if (!editingDepartment) return;

    const updatedDepartments = departments.map(dept => 
      dept.id === editingDepartment.id ? editingDepartment : dept
    );
    
    setDepartments(updatedDepartments);
    setEditingDepartment(null);
    
    console.log('Department updated:', editingDepartment);
    console.log('Updated departments:', updatedDepartments);
    toast.success('Department updated successfully');
  };

  const handleDeleteDepartment = (deptId: number) => {
    const updatedDepartments = departments.filter(dept => dept.id !== deptId);
    setDepartments(updatedDepartments);
    console.log('Department deleted, updated list:', updatedDepartments);
    toast.success('Department deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Department Management</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dept-name">Department Name *</Label>
                <Input
                  id="dept-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="dept-description">Description</Label>
                <Input
                  id="dept-description"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  placeholder="Enter department description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDepartment}>
                  Add Department
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {dept.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">{dept.description}</p>
                <p className="text-sm font-medium mt-2">{dept.employeeCount} employees</p>
              </div>

              {dept.teamLeads.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Team Leads:</p>
                  <div className="flex flex-wrap gap-1">
                    {dept.teamLeads.map((lead, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lead}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingDepartment({...dept})}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteDepartment(dept.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Department Dialog */}
      <Dialog open={!!editingDepartment} onOpenChange={() => setEditingDepartment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          {editingDepartment && (
            <div className="space-y-4">
              <div>
                <Label>Department Name</Label>
                <Input
                  value={editingDepartment.name}
                  onChange={(e) => setEditingDepartment({...editingDepartment, name: e.target.value})}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editingDepartment.description || ''}
                  onChange={(e) => setEditingDepartment({...editingDepartment, description: e.target.value})}
                  placeholder="Enter department description"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingDepartment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDepartment}>
                  Update Department
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManager;
