
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Database, Activity, BarChart2, Building } from "lucide-react";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import DepartmentStatsCard from "@/components/admin/DepartmentStatsCard";
import SystemHealthCard from "@/components/admin/SystemHealthCard";
import RecentActivityCard from "@/components/admin/RecentActivityCard";
import RealtimePerformanceWidget from "@/components/RealtimePerformanceWidget";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { stats, departments, loading, error } = useAdminData();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Real-time data updates enabled
        </div>
      </div>

      <AdminStatsCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentStatsCard departments={departments} loading={loading} />
        <SystemHealthCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RealtimePerformanceWidget />
        <RecentActivityCard />
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-600" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalDepartments}</div>
              <p className="text-sm text-gray-600">Departments</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalTeamMembers}</div>
              <p className="text-sm text-gray-600">Team Members</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.auditLogs}</div>
              <p className="text-sm text-gray-600">Audit Logs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
