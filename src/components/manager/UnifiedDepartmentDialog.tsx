
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Building } from 'lucide-react';
import { toast } from 'sonner';
import { useDepartments } from '@/hooks/useDepartments';

interface UnifiedDepartmentDialogProps {
  teams: any[];
  setTeams: (teams: any[]) => void;
}

const UnifiedDepartmentDialog = ({ teams, setTeams }: UnifiedDepartmentDialogProps) => {
  const { addDepartment } = useDepartments();
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

    const success = addDepartment(newDept.name.trim());
    if (!success) {
      toast.error('Department already exists');
      return;
    }
    toast.success('Department added successfully');

    const team = {
      id: Math.max(0, ...teams.map(t => t.id)) + 1,
      name: `${newDept.name.trim()} Team`,
      lead: newDept.teamLead.trim(),
      leadEmail: newDept.leadEmail || `${newDept.teamLead.trim().toLowerCase().replace(' ', '.')}@company.com`,
      leadPhone: newDept.leadPhone || '+1 (555) 000-0000',
      members: [],
      department: newDept.name.trim(),
      performance: 0,
    };
    setTeams([...teams, team]);
    toast.success(`Team created and team lead ${newDept.teamLead} assigned`);

    setNewDept({ name: '', description: '', teamLead: '', leadEmail: '', leadPhone: '' });
    setShowDialog(false);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Building className="h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Department & Assign Team Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Department Name *</label>
            <Input
              value={newDept.name}
              onChange={e => setNewDept({ ...newDept, name: e.target.value })}
              placeholder="Enter department name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={newDept.description}
              onChange={e => setNewDept({ ...newDept, description: e.target.value })}
              placeholder="Brief description of the department (optional)"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Team Lead Name *</label>
            <Input
              value={newDept.teamLead}
              onChange={e => setNewDept({ ...newDept, teamLead: e.target.value })}
              placeholder="Assign a team lead"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Team Lead Email (optional)</label>
            <Input
              value={newDept.leadEmail}
              onChange={e => setNewDept({ ...newDept, leadEmail: e.target.value })}
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Team Lead Phone (optional)</label>
            <Input
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

export default UnifiedDepartmentDialog;
