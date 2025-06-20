
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, BarChart3, Building } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

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
  const departments = [
    { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' as const },
    { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' as const },
    { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' as const },
    { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' as const },
    { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' as const },
  ];

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Manager Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive team management and insights</p>
          </div>
          <Link 
            to="/manager/settings" 
            className="text-blue-600 hover:text-blue-500 text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            Manager Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <StatCard 
                title="Total Employees"
                value={totalEmployees.toString()}
                icon={<Users size={24} className="text-blue-600" />}
                change="+5.3% from last month"
                trend="up"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <StatCard 
                title="New Employees"
                value="12"
                icon={<User size={24} className="text-green-600" />}
                change="+2 from last week"
                trend="up"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <StatCard 
                title="Departments"
                value={departments.length.toString()}
                icon={<Building size={24} className="text-purple-600" />}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4">
              <StatCard 
                title="Average Performance"
                value="78%"
                icon={<BarChart3 size={24} className="text-orange-600" />}
                change="+2.5% from last quarter"
                trend="up"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Employee Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={employeeOverviewData} 
                title="" 
                subtitle="Employee count over time"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Department Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={employeeProgressData} 
                title="" 
                subtitle="Average performance by department"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Building className="h-5 w-5 text-purple-600" />
                Department Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
                    <div>
                      <h3 className="font-semibold text-gray-800">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.employeeCount} employees</p>
                    </div>
                    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      dept.trend === 'up' ? 'text-green-700 bg-green-100' : 
                      dept.trend === 'down' ? 'text-red-700 bg-red-100' : 'text-gray-700 bg-gray-100'
                    }`}>
                      {dept.growth}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-green-800">New team member onboarded in IT</p>
                  <span className="text-xs text-green-600 ml-auto">2h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-medium text-blue-800">Performance review completed for Sales</p>
                  <span className="text-xs text-blue-600 ml-auto">5h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm font-medium text-yellow-800">Monthly reports due tomorrow</p>
                  <span className="text-xs text-yellow-600 ml-auto">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
