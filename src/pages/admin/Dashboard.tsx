import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { useAdminData } from "@/hooks/useAdminData";
import DashboardHeader from "@/components/admin/DashboardHeader";
import DashboardStatsCards from "@/components/admin/DashboardStatsCards";
import RecentActivityCard from "@/components/admin/RecentActivityCard";
import SystemHealthCard from "@/components/admin/SystemHealthCard";

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
      <DashboardHeader />

      <DashboardStatsCards stats={{
        totalUsers: stats?.totalUsers || 129,
        lockedRecords: stats?.lockedRecords || 42,
        auditLogs: stats?.auditLogs || 1256
      }} />

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
        <RecentActivityCard />
        <SystemHealthCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
