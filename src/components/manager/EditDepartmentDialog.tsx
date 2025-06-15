
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface EditDepartmentDialogProps {
  department: Department | null;
  onSave: (department: Department) => void;
  onClose: () => void;
}

const EditDepartmentDialog = ({ department, onSave, onClose }: EditDepartmentDialogProps) => {
  const handleSave = () => {
    if (!department) return;
    onSave(department);
    onClose();
    toast.success('Department updated successfully');
  };

  return (
    <Dialog open={!!department} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>
        {department && (
          <div className="space-y-4">
            <div>
              <Label>Department Name</Label>
              <Input
                value={department.name}
                onChange={(e) => onSave({...department, name: e.target.value})}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={department.description || ''}
                onChange={(e) => onSave({...department, description: e.target.value})}
                placeholder="Enter department description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Update Department
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditDepartmentDialog;
