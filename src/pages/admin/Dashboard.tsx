import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { stats, departments, loading, error } = useAdminData();

  const userActivityData = [
    { name: 'Jan', value: 45 },
    { name: 'Feb', value: 52 },
    { name: 'Mar', value: 48 },
    { name: 'Apr', value: 65 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 72 },
    { name: 'Jul', value: 75 },
  ];

  const userDistributionData = [
    { name: 'Admin', value: 5 },
    { name: 'Manager', value: 15 },
    { name: 'Team Lead', value: 25 },
    { name: 'User', value: 85 },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Robert Manager',
      action: 'added a new team member',
      time: '2 hours ago',
      color: 'bg-green-500'
    },
    {
      id: 2,
      user: 'Sarah Lead',
      action: 'updated performance ratings',
      time: '5 hours ago',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      user: 'New user registered',
      action: 'Emily Davis',
      time: '1 day ago',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
      {/* Header */}
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 129}</div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-sm text-green-600 font-medium">+8 from last month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">99.8%</div>
              <p className="text-sm text-gray-600">System Security</p>
              <p className="text-sm text-gray-600">No recent threats</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats?.lockedRecords || 42}</div>
              <p className="text-sm text-gray-600">Locked Records</p>
              <p className="text-sm text-green-600 font-medium">+5 from last week</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats?.auditLogs || 1256}</div>
              <p className="text-sm text-gray-600">Audit Logs</p>
              <p className="text-sm text-green-600 font-medium">+36 today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">User Activity</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Active users over time</p>
              </div>
              <Select defaultValue="thismonth">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="This Month" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                  <SelectItem value="thisyear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <LineChart 
                data={userActivityData}
                title=""
                subtitle=""
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">User Distribution</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Users by role</p>
              </div>
              <Select defaultValue="thismonth">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="This Month" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  <SelectItem value="thismonth">This Month</SelectItem>
                  <SelectItem value="lastmonth">Last Month</SelectItem>
                  <SelectItem value="thisyear">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <BarChart 
                data={userDistributionData}
                title=""
                subtitle=""
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent User Activity */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="link" className="text-blue-600 p-0 h-auto font-normal">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">System Health</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Server Uptime</span>
                  <span className="text-sm font-medium text-gray-900">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Database Load</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                  <span className="text-sm font-medium text-gray-900">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">API Request Rate</span>
                  <span className="text-sm font-medium text-gray-900">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '28%' }} />
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
