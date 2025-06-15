
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity, BarChart2, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your system today.</p>
          </div>
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            System Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">+8 from last month</p>
                </div>
                <div className="h-14 w-14 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">System Security</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">99.8%</p>
                  <p className="text-sm text-gray-600 mt-2 font-medium">No recent threats</p>
                </div>
                <div className="h-14 w-14 bg-green-500 rounded-xl flex items-center justify-center">
                  <Shield className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Locked Records</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lockedRecords}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">+5 from last week</p>
                </div>
                <div className="h-14 w-14 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Database className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Audit Logs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.auditLogs}</p>
                  <p className="text-sm text-green-600 mt-2 font-medium">+36 today</p>
                </div>
                <div className="h-14 w-14 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Activity className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg border border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">User Activity</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Active users over time</p>
                </div>
                <Select defaultValue="thismonth">
                  <SelectTrigger className="w-36 bg-gray-50">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thismonth">This Month</SelectItem>
                    <SelectItem value="lastmonth">Last Month</SelectItem>
                    <SelectItem value="thisyear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
                <LineChart 
                  data={userActivityData}
                  title=""
                  subtitle=""
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">User Distribution</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Users by role</p>
                </div>
                <Select defaultValue="thismonth">
                  <SelectTrigger className="w-36 bg-gray-50">
                    <SelectValue placeholder="This Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thismonth">This Month</SelectItem>
                    <SelectItem value="lastmonth">Last Month</SelectItem>
                    <SelectItem value="thisyear">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-80">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg border border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900">Recent User Activity</CardTitle>
                <Button variant="ghost" className="text-blue-600 text-sm font-medium hover:bg-blue-50">
                  View All Activity
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 ${activity.color} rounded-full mt-2 flex-shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <span className="text-xs text-gray-500 mt-1">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900">System Health</CardTitle>
              <p className="text-sm text-gray-600">Monitor your system performance</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Server Uptime</span>
                    <span className="text-sm font-bold text-gray-900">99.9%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '99.9%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Database Load</span>
                    <span className="text-sm font-bold text-gray-900">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                    <span className="text-sm font-bold text-gray-900">72%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">API Request Rate</span>
                    <span className="text-sm font-bold text-gray-900">28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-500 h-3 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
