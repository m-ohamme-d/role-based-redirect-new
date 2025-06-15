
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, BarChart3, Building } from "lucide-react";
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

const ManagerDashboard = () => {
  // Mock data for departments
  const departments = [
    { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
    { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
    { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
    { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
    { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
  ];

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <Link to="/manager/settings" className="text-blue-600 hover:underline text-sm font-medium">
          Manager Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Employees"
          value={totalEmployees.toString()}
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
          value={departments.length.toString()}
          icon={<Building size={24} />}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{dept.name}</h3>
                    <p className="text-sm text-gray-600">{dept.employeeCount} employees</p>
                  </div>
                  <div className={`text-sm font-medium ${
                    dept.trend === 'up' ? 'text-green-600' : 
                    dept.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {dept.growth}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">New team member onboarded in IT</p>
                <span className="text-xs text-gray-500 ml-auto">2h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Performance review completed for Sales</p>
                <span className="text-xs text-gray-500 ml-auto">5h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <p className="text-sm">Monthly reports due tomorrow</p>
                <span className="text-xs text-gray-500 ml-auto">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
