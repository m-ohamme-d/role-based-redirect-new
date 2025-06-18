
import { useState } from 'react';
import { toast } from 'sonner';
import AddDepartmentDialog from './AddDepartmentDialog';
import EditDepartmentDialog from './EditDepartmentDialog';
import DepartmentCard from './DepartmentCard';

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

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

  const handleAddDepartment = (newDepartment: Omit<Department, 'id'>) => {
    const department: Department = {
      id: Math.max(...departments.map(d => d.id)) + 1,
      ...newDepartment,
    };

    const updatedDepartments = [...departments, department];
    setDepartments(updatedDepartments);
    console.log('Department added:', department);
    console.log('Updated departments:', updatedDepartments);
  };

  const handleEditDepartment = (department: Department) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === department.id ? department : dept
    );
    
    setDepartments(updatedDepartments);
    console.log('Department updated:', department);
    console.log('Updated departments:', updatedDepartments);
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
        <AddDepartmentDialog onAddDepartment={handleAddDepartment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onEdit={setEditingDepartment}
            onDelete={handleDeleteDepartment}
          />
        ))}
      </div>

      <EditDepartmentDialog
        department={editingDepartment}
        onSave={handleEditDepartment}
        onClose={() => setEditingDepartment(null)}
      />
    </div>
  );
};

export default DepartmentManager;
