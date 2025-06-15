
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Department {
  id: number;
  name: string;
  employeeCount: number;
  teamLeads: string[];
  description?: string;
}

interface AddDepartmentDialogProps {
  onAddDepartment: (department: Omit<Department, 'id'>) => void;
}

const AddDepartmentDialog = ({ onAddDepartment }: AddDepartmentDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
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

    const department = {
      name: newDept.name.trim(),
      employeeCount: 0,
      teamLeads: [newDept.teamLead.trim()],
      description: newDept.description.trim(),
    };

    onAddDepartment(department);
    setNewDept({ name: '', description: '', teamLead: '', leadEmail: '', leadPhone: '' });
    setShowDialog(false);
    toast.success('Department added successfully');
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDepartment}>
              Add Department
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDepartmentDialog;
