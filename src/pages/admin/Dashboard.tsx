
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Activity } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

// Mock data for charts
const userActivityData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 49 },
  { name: 'Apr', value: 63 },
  { name: 'May', value: 59 },
  { name: 'Jun', value: 68 },
  { name: 'Jul', value: 72 },
];

const roleTotalData = [
  { name: 'Admin', value: 4 },
  { name: 'Manager', value: 12 },
  { name: 'Team Lead', value: 28 },
  { name: 'User', value: 85 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link to="/admin/settings" className="text-blue-600 hover:underline text-sm font-medium">
          System Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users"
          value="129"
          icon={<Users size={24} />}
          change="+8 from last month"
          trend="up"
        />
        <StatCard 
          title="System Security"
          value="99.8%"
          icon={<Shield size={24} />}
          change="No recent threats"
          trend="neutral"
        />
        <StatCard 
          title="Locked Records"
          value="42"
          icon={<FileText size={24} />}
          change="+5 from last week"
          trend="up"
        />
        <StatCard 
          title="Audit Logs"
          value="1,256"
          icon={<Activity size={24} />}
          change="+36 today"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={userActivityData} 
          title="User Activity" 
          subtitle="Active users over time"
        />
        <BarChart 
          data={roleTotalData} 
          title="User Distribution" 
          subtitle="Users by role"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Robert Manager added a new team member</p>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Sarah Lead updated performance ratings</p>
                <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">New user registered: Emily Davis</p>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link to="/admin/audit-log" className="text-blue-600 hover:underline text-sm">
                View All Activity
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Server Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Database Load</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Storage Usage</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">API Request Rate</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
