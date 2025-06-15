
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Edit2, Trash2 } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  employeeCount: number;
  teamLeads: string[];
  description?: string;
}

interface DepartmentCardProps {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (id: number) => void;
}

const DepartmentCard = ({ department, onEdit, onDelete }: DepartmentCardProps) => {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          {department.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">{department.description}</p>
          <p className="text-sm font-medium mt-2">{department.employeeCount} employees</p>
        </div>

        {department.teamLeads.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Team Leads:</p>
            <div className="flex flex-wrap gap-1">
              {department.teamLeads.map((lead, index) => (
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
            onClick={() => onEdit(department)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(department.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
