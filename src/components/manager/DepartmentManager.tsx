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
  // Unified create department fields
  const [newDept, setNewDept] = useState({
    name: '',
    description: '',
    teamLead: '',
    leadEmail: '',
    leadPhone: '',
  });

  const handleAddDepartment = () => {
    if (!newDept.name.trim() || !newDept.teamLead.trim()) {
      toast.error('Department name and Team Lead are required');
      return;
    }

    const department: Department = {
      id: Math.max(...departments.map(d => d.id)) + 1,
      name: newDept.name.trim(),
      employeeCount: 0,
      teamLeads: [newDept.teamLead.trim()],
      description: newDept.description.trim(),
    };

    const updatedDepartments = [...departments, department];
    setDepartments(updatedDepartments);

    setNewDept({ name: '', description: '', teamLead: '', leadEmail: '', leadPhone: '' });
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
              <span>+ Add Department</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Department & Team Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dept-name">Department Name *</Label>
                <Input
                  id="dept-name"
                  value={newDept.name}
                  onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="dept-description">Description</Label>
                <Input
                  id="dept-description"
                  value={newDept.description}
                  onChange={e => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Enter department description (optional)"
                />
              </div>
              <div>
                <Label htmlFor="team-lead">Team Lead Name *</Label>
                <Input
                  id="team-lead"
                  value={newDept.teamLead}
                  onChange={e => setNewDept({ ...newDept, teamLead: e.target.value })}
                  placeholder="Assign a team lead"
                />
              </div>
              <div>
                <Label htmlFor="team-lead-email">Team Lead Email (optional)</Label>
                <Input
                  id="team-lead-email"
                  value={newDept.leadEmail}
                  onChange={e => setNewDept({ ...newDept, leadEmail: e.target.value })}
                  placeholder="teamlead@company.com"
                />
              </div>
              <div>
                <Label htmlFor="team-lead-phone">Team Lead Phone (optional)</Label>
                <Input
                  id="team-lead-phone"
                  value={newDept.leadPhone}
                  onChange={e => setNewDept({ ...newDept, leadPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
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
