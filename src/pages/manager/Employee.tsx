
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Calendar, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock employee data
const employeesData = {
  101: { 
    id: 101, 
    name: 'John Smith', 
    position: 'Senior Developer', 
    department: 'IT',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    hireDate: '2020-05-15',
    performance: 95,
    avatar: 'https://i.pravatar.cc/150?u=101',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    projects: [
      { name: 'Project Alpha', role: 'Lead Developer', status: 'Completed' },
      { name: 'Project Beta', role: 'Developer', status: 'In Progress' },
    ],
    evaluations: [
      { date: '2023-12-01', rating: 4.8, comment: 'Excellent work on Project Alpha' },
      { date: '2023-06-01', rating: 4.7, comment: 'Great team player and technical skills' },
    ]
  },
  // Add more employees as needed
};

const ManagerEmployee = () => {
  const { employeeId } = useParams<{employeeId: string}>();
  const [employee, setEmployee] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    if (employeeId && employeesData[Number(employeeId)]) {
      setEmployee(employeesData[Number(employeeId)]);
    }
  }, [employeeId]);

  if (!employee) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Employee not found</h2>
        <Link to="/manager/dashboard">
          <Button className="mt-4">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to={`/manager/department/${employee.department === 'IT' ? 1 : employee.department === 'HR' ? 2 : 3}`} className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Employee Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback>{employee.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{employee.name}</h2>
            <p className="text-gray-600">{employee.position}</p>
            <p className="text-sm text-gray-500">{employee.department} Department</p>
            
            <div className="mt-6 w-full">
              <div className="flex items-center py-2 border-t">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{employee.email}</span>
              </div>
              <div className="flex items-center py-2 border-t">
                <Phone className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{employee.phone}</span>
              </div>
              <div className="flex items-center py-2 border-t">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-6 w-full">
              <h3 className="font-semibold text-left mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {employee.skills.map((skill: string, index: number) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Current Performance</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-3 mr-2">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${employee.performance}%` }}
                  ></div>
                </div>
                <span className="font-medium">{employee.performance}%</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <div className="space-y-2 mb-6">
              {employee.projects.map((project: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-gray-600">{project.role}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-semibold mb-2">Performance History</h3>
            <div className="space-y-2">
              {employee.evaluations.map((eval: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">{new Date(eval.date).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <span className="mr-1">{eval.rating.toFixed(1)}</span>
                      <Star className="h-4 w-4 fill-yellow-500 stroke-yellow-500" />
                    </div>
                  </div>
                  <p className="text-sm mt-1">{eval.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerEmployee;
