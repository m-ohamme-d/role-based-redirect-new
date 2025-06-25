
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Trash2, Building } from 'lucide-react';
import { toast } from 'sonner';
import { useDepartments } from '@/hooks/useDepartments';

interface DepartmentManagementCardProps {
  teams: any[];
}

const DepartmentManagementCard = ({ teams }: DepartmentManagementCardProps) => {
  const { departments, updateDepartment, deleteDepartment } = useDepartments();
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');

  const handleStartEditDepartment = (deptName: string) => {
    setEditingDepartment(deptName);
    setEditDepartmentName(deptName);
  };

  const handleSaveEditDepartment = (oldName: string) => {
    if (!editDepartmentName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }

    if (editDepartmentName.trim().length < 2) {
      toast.error('Department name must be at least 2 characters long');
      return;
    }

    if (updateDepartment(oldName, editDepartmentName.trim())) {
      setEditingDepartment(null);
      setEditDepartmentName('');
      toast.success('Department updated successfully - synced with Admin dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

  const handleDeleteDepartment = (deptName: string) => {
    const teamsUsingDept = teams.filter(team => team.department === deptName);
    if (teamsUsingDept.length > 0) {
      toast.error(`Cannot delete department "${deptName}" - it has ${teamsUsingDept.length} team(s) assigned to it`);
      return;
    }

    if (deleteDepartment(deptName)) {
      toast.success('Department deleted successfully - synced with Admin dashboard');
    } else {
      toast.error('Failed to delete department');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Department Management
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {departments.map((dept) => (
            <div key={dept} className="flex items-center gap-2 p-2 border rounded">
              {editingDepartment === dept ? (
                <div className="flex items-center gap-1 w-full">
                  <Input 
                    value={editDepartmentName} 
                    onChange={(e) => setEditDepartmentName(e.target.value)}
                    className="h-6 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEditDepartment(dept);
                      if (e.key === 'Escape') setEditingDepartment(null);
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={() => handleSaveEditDepartment(dept)} className="h-6 w-6 p-0">
                    ✓
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingDepartment(null)} className="h-6 w-6 p-0">
                    ✕
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-sm flex-1">{dept}</span>
                  <Button size="sm" variant="ghost" onClick={() => handleStartEditDepartment(dept)} className="h-6 w-6 p-0">
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteDepartment(dept)} className="h-6 w-6 p-0">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Changes sync automatically with Admin dashboard
        </p>
      </CardContent>
    </Card>
  );
};

export default DepartmentManagementCard;
