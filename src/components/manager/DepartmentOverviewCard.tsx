
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Department {
  id: number;
  name: string;
  employeeCount: number;
  growth: string;
  trend: 'up' | 'down' | 'neutral';
}

interface DepartmentOverviewCardProps {
  departments: Department[];
}

const DepartmentOverviewCard = ({ departments }: DepartmentOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => (
            <Card key={dept.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <Link to={`/manager/department/${dept.id}`}>
                  <div>
                    <h3 className="font-semibold">{dept.name}</h3>
                    <p className="text-sm text-gray-500">{dept.employeeCount} employees</p>
                  </div>
                </Link>
                <div className={`text-sm font-medium flex items-center mt-2 ${
                  dept.trend === 'up' ? 'text-green-500' : 
                  dept.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {dept.growth}
                  {dept.trend === 'up' && <ArrowUp size={16} className="ml-1" />}
                  {dept.trend === 'down' && <ArrowDown size={16} className="ml-1" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentOverviewCard;
