
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

// Mock designations data
const mockDesignations = [
  { id: 1, name: 'Senior Developer', department: 'IT', count: 8 },
  { id: 2, name: 'Project Lead', department: 'IT', count: 3 },
  { id: 3, name: 'UI Designer', department: 'IT', count: 4 },
  { id: 4, name: 'HR Specialist', department: 'HR', count: 5 },
  { id: 5, name: 'Sales Executive', department: 'Sales', count: 12 },
  { id: 6, name: 'Marketing Manager', department: 'Marketing', count: 6 },
  { id: 7, name: 'Financial Analyst', department: 'Finance', count: 4 },
];

const AdminDesignations = () => {
  const [designations, setDesignations] = useState(mockDesignations);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<any>(null);
  const [newDesignation, setNewDesignation] = useState({
    name: '',
    department: ''
  });

  const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance'];

  const handleCreateDesignation = () => {
    if (!newDesignation.name || !newDesignation.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const designation = {
      ...newDesignation,
      id: Math.max(...designations.map(d => d.id)) + 1,
      count: 0
    };

    setDesignations([...designations, designation]);
    setNewDesignation({ name: '', department: '' });
    setShowCreateDialog(false);
    toast.success('Designation created successfully');
    console.log('New designation created:', designation);
  };

  const handleEditDesignation = () => {
    if (!selectedDesignation) return;

    setDesignations(designations.map(designation => 
      designation.id === selectedDesignation.id ? selectedDesignation : designation
    ));
    setShowEditDialog(false);
    setSelectedDesignation(null);
    toast.success('Designation updated successfully');
    console.log('Designation updated:', selectedDesignation);
  };

  const handleDeleteDesignation = (designationId: number) => {
    const designation = designations.find(d => d.id === designationId);
    if (designation && designation.count > 0) {
      toast.error(`Cannot delete designation with ${designation.count} assigned members`);
      return;
    }

    setDesignations(designations.filter(designation => designation.id !== designationId));
    toast.success('Designation deleted successfully');
    console.log('Designation deleted:', designationId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Designation Management</h1>
          <p className="text-gray-600">Create and manage custom designations for team members</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Designation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Designation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="designation-name">Designation Name</Label>
                <Input
                  id="designation-name"
                  value={newDesignation.name}
                  onChange={(e) => setNewDesignation({...newDesignation, name: e.target.value})}
                  placeholder="Enter designation name"
                />
              </div>
              <div>
                <Label htmlFor="designation-dept">Department</Label>
                <select
                  id="designation-dept"
                  value={newDesignation.department}
                  onChange={(e) => setNewDesignation({...newDesignation, department: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDesignation}>
                  Create Designation
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
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{designations.length}</p>
                <p className="text-sm text-gray-600">Total Designations</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{designations.reduce((sum, d) => sum + d.count, 0)}</p>
              <p className="text-sm text-gray-600">Assigned Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{departments.length}</p>
              <p className="text-sm text-gray-600">Departments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{designations.filter(d => d.count === 0).length}</p>
              <p className="text-sm text-gray-600">Unassigned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designations.map((designation) => (
          <Card key={designation.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  {designation.name}
                </CardTitle>
                <Badge variant="outline">{designation.department}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Department: <span className="font-medium">{designation.department}</span></p>
                <p className="text-sm text-gray-600">Assigned Members: <span className="font-medium">{designation.count}</span></p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDesignation(designation);
                    setShowEditDialog(true);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteDesignation(designation.id)}
                  disabled={designation.count > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Designation Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Designation</DialogTitle>
          </DialogHeader>
          {selectedDesignation && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-designation-name">Designation Name</Label>
                <Input
                  id="edit-designation-name"
                  value={selectedDesignation.name}
                  onChange={(e) => setSelectedDesignation({...selectedDesignation, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-designation-dept">Department</Label>
                <select
                  id="edit-designation-dept"
                  value={selectedDesignation.department}
                  onChange={(e) => setSelectedDesignation({...selectedDesignation, department: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditDesignation}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDesignations;
