
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Mock department data
const departmentsData = {
  1: { id: 1, name: 'IT', description: 'Information Technology department' },
  2: { id: 2, name: 'HR', description: 'Human Resources department' },
  3: { id: 3, name: 'Sales', description: 'Sales and Marketing department' },
  4: { id: 4, name: 'Marketing', description: 'Marketing department' },
  5: { id: 5, name: 'Finance', description: 'Finance and Accounting department' },
};

// Mock employees by department
const employeesByDepartment = {
  1: [
    { id: 101, name: 'John Smith', position: 'Senior Developer', performance: 95, email: 'john@example.com' },
    { id: 102, name: 'Emily Wilson', position: 'UX Designer', performance: 88, email: 'emily@example.com' },
    { id: 103, name: 'Michael Brown', position: 'Backend Developer', performance: 92, email: 'michael@example.com' },
    { id: 104, name: 'Sarah Johnson', position: 'Frontend Developer', performance: 90, email: 'sarah@example.com' },
  ],
  2: [
    { id: 201, name: 'David Lee', position: 'HR Manager', performance: 89, email: 'david@example.com' },
    { id: 202, name: 'Lisa Chen', position: 'Recruiter', performance: 85, email: 'lisa@example.com' },
  ],
  3: [
    { id: 301, name: 'Robert Wilson', position: 'Sales Manager', performance: 93, email: 'robert@example.com' },
    { id: 302, name: 'Jennifer Smith', position: 'Sales Representative', performance: 87, email: 'jennifer@example.com' },
    { id: 303, name: 'Thomas Miller', position: 'Account Executive', performance: 91, email: 'thomas@example.com' },
  ],
  4: [
    { id: 401, name: 'Karen White', position: 'Marketing Manager', performance: 94, email: 'karen@example.com' },
    { id: 402, name: 'Daniel Brown', position: 'Digital Marketing Specialist', performance: 86, email: 'daniel@example.com' },
  ],
  5: [
    { id: 501, name: 'Steven Clark', position: 'Financial Analyst', performance: 90, email: 'steven@example.com' },
    { id: 502, name: 'Mary Johnson', position: 'Accountant', performance: 88, email: 'mary@example.com' },
  ],
};

const ManagerDepartment = () => {
  const { deptId } = useParams<{deptId: string}>();
  const [department, setDepartment] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would be an API call
    if (deptId && departmentsData[Number(deptId)]) {
      setDepartment(departmentsData[Number(deptId)]);
      setEmployees(employeesByDepartment[Number(deptId)] || []);
    }
  }, [deptId]);

  if (!department) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Department not found</h2>
        <Link to="/manager/dashboard">
          <Button className="mt-4">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/manager/dashboard" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{department.name} Department</h1>
          <p className="text-gray-600">{department.description}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employees ({employees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(employee => (
              <Link key={employee.id} to={`/manager/employee/${employee.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.position}</p>
                    <div className="mt-2 flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${employee.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{employee.performance}%</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagerDepartment;
