
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ArrowUp, ArrowDown, User } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

// Mock data for charts
const employeeOverviewData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 59 },
  { name: 'Mar', value: 80 },
  { name: 'Apr', value: 81 },
  { name: 'May', value: 56 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 40 },
];

const employeeProgressData = [
  { name: 'IT', value: 85 },
  { name: 'HR', value: 65 },
  { name: 'Sales', value: 76 },
  { name: 'Marketing', value: 90 },
  { name: 'Finance', value: 70 },
];

// Mock departments
const departments = [
  { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
  { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
  { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
  { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
  { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
];

const ManagerDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <Link to="/manager/profile" className="text-blue-600 hover:underline text-sm font-medium">
          View Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees"
          value="107"
          icon={<Users size={24} />}
          change="+5.3% from last month"
          trend="up"
        />
        <StatCard 
          title="New Employees"
          value="12"
          icon={<User size={24} />}
          change="+2 from last week"
          trend="up"
        />
        <StatCard 
          title="Departments"
          value="5"
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Average Performance"
          value="78%"
          icon={<BarChart3 size={24} />}
          change="+2.5% from last quarter"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={employeeOverviewData} 
          title="Employee Overview" 
          subtitle="Employee count over time"
        />
        <BarChart 
          data={employeeProgressData} 
          title="Department Performance" 
          subtitle="Average performance by department"
        />
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Department Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(dept => (
                <Link key={dept.id} to={`/manager/department/${dept.id}`}>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{dept.name}</h3>
                          <p className="text-sm text-gray-500">{dept.employeeCount} employees</p>
                        </div>
                        <div className={`text-sm font-medium flex items-center ${
                          dept.trend === 'up' ? 'text-green-500' : 
                          dept.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                        }`}>
                          {dept.growth}
                          {dept.trend === 'up' && <ArrowUp size={16} className="ml-1" />}
                          {dept.trend === 'down' && <ArrowDown size={16} className="ml-1" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
