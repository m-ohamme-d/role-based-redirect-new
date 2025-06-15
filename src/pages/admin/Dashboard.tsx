
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity, BarChart2, Building } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import DepartmentStatsCard from "@/components/admin/DepartmentStatsCard";
import SystemHealthCard from "@/components/admin/SystemHealthCard";
import RecentActivityCard from "@/components/admin/RecentActivityCard";
import RealtimePerformanceWidget from "@/components/RealtimePerformanceWidget";
import AuditLogViewer from "@/components/admin/AuditLogViewer";
import ReportingDashboard from "@/components/admin/ReportingDashboard";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { stats, departments, loading, error } = useAdminData();

  const barChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
    { name: 'Jun', value: 239 },
  ];

  const lineChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 500 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 389 },
    { name: 'Jun', value: 439 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Comprehensive system administration and analytics</p>
          </div>
          <div className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
            Real-time data updates enabled
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm shadow-lg">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
              Analytics & Reports
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
              Audit Logs
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700">
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DepartmentStatsCard departments={departments} loading={loading} />
              <SystemHealthCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BarChart2 className="h-5 w-5 text-blue-600" />
                    Monthly User Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={barChartData}
                    title=""
                    subtitle="New user registrations per month"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Activity className="h-5 w-5 text-green-600" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={lineChartData}
                    title=""
                    subtitle="Response time metrics over time"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimePerformanceWidget />
              <RecentActivityCard />
            </div>

            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Activity className="h-5 w-5 text-orange-600" />
                  System Metrics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <p className="text-sm text-blue-700 font-medium">Active Users</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.totalDepartments}</div>
                    <p className="text-sm text-green-700 font-medium">Departments</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{stats.totalTeamMembers}</div>
                    <p className="text-sm text-purple-700 font-medium">Team Members</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats.auditLogs}</div>
                    <p className="text-sm text-red-700 font-medium">Audit Logs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportingDashboard />
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <AuditLogViewer />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RealtimePerformanceWidget />
              <SystemHealthCard />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BarChart2 className="h-5 w-5 text-purple-600" />
                    System Load
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={barChartData}
                    title=""
                    subtitle="Resource utilization over time"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Activity className="h-5 w-5 text-orange-600" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={lineChartData}
                    title=""
                    subtitle="API response time metrics"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
