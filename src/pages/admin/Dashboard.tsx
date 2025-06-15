
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import SystemHealthCard from "@/components/admin/SystemHealthCard";
import RecentActivityCard from "@/components/admin/RecentActivityCard";
import AdminStatsCards from "@/components/admin/AdminStatsCards";
import DepartmentStatsCard from "@/components/admin/DepartmentStatsCard";
import { useAdminData } from "@/hooks/useAdminData";
import { Link } from "react-router-dom";

// Mock data for charts - these would ideally come from analytics tables
const userActivityData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 49 },
  { name: 'Apr', value: 63 },
  { name: 'May', value: 59 },
  { name: 'Jun', value: 68 },
  { name: 'Jul', value: 72 },
];

const AdminDashboard = () => {
  const { stats, departments, loading, error } = useAdminData();

  // Transform departments data for bar chart
  const roleTotalData = [
    { name: 'Admin', value: 4 },
    { name: 'Manager', value: 12 },
    { name: 'Team Lead', value: departments.length },
    { name: 'Members', value: stats.totalTeamMembers },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Card className="shadow-lg border-0 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">Error loading dashboard data: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link to="/admin/settings" className="text-blue-600 hover:underline text-sm font-medium">
          System Settings
        </Link>
      </div>

      <AdminStatsCards stats={stats} loading={loading} />

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
        <RecentActivityCard />
        <SystemHealthCard />
      </div>

      <DepartmentStatsCard departments={departments} loading={loading} />
    </div>
  );
};

export default AdminDashboard;
