
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity, Bell, Settings, LogOut } from "lucide-react";
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
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white shadow-sm"></div>
        <div className="flex-1 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white shadow-sm"></div>
        <div className="flex-1 p-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600">Admin</h2>
          <p className="text-sm text-gray-500">Welcome, Mohammed Altamash</p>
        </div>
        
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              Dashboard
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <Users className="w-5 h-5 mr-3" />
              Users
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2H5v-2h10z" clipRule="evenodd" />
                </svg>
              </div>
              Departments
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <Database className="w-5 h-5 mr-3" />
              Records
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <Activity className="w-5 h-5 mr-3" />
              Audit Log
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <Bell className="w-5 h-5 mr-3" />
              Notifications
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd" />
                </svg>
              </div>
              Reports
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              Support
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </a>
            
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
              </div>
              Profile
            </a>
          </div>
          
          <div className="mt-8 px-3">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400" />
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">M</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 129}</div>
                <p className="text-sm text-gray-600 mt-1">Total Users</p>
                <p className="text-sm text-green-600 mt-1 font-medium">+8 from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900">99.8%</div>
                <p className="text-sm text-gray-600 mt-1">System Security</p>
                <p className="text-sm text-gray-600 mt-1">No recent threats</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900">{stats?.lockedRecords || 42}</div>
                <p className="text-sm text-gray-600 mt-1">Locked Records</p>
                <p className="text-sm text-green-600 mt-1 font-medium">+5 from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-gray-900">{stats?.auditLogs || 1256}</div>
                <p className="text-sm text-gray-600 mt-1">Audit Logs</p>
                <p className="text-sm text-green-600 mt-1 font-medium">+36 today</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">User Activity</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Active users over time</p>
                  </div>
                  <Select defaultValue="thismonth">
                    <SelectTrigger className="w-32">
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
                <div className="h-64">
                  <LineChart 
                    data={userActivityData}
                    title=""
                    subtitle=""
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">User Distribution</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Users by role</p>
                  </div>
                  <Select defaultValue="thismonth">
                    <SelectTrigger className="w-32">
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
          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
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

            <Card className="bg-white">
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
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Database Load</span>
                      <span className="text-sm font-medium text-gray-900">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                      <span className="text-sm font-medium text-gray-900">72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">API Request Rate</span>
                      <span className="text-sm font-medium text-gray-900">28%</span>
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
      </div>
    </div>
  );
};

export default AdminDashboard;
