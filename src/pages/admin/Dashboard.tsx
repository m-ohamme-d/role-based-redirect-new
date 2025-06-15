
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Activity } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import SystemHealthCard from "@/components/admin/SystemHealthCard";
import RecentActivityCard from "@/components/admin/RecentActivityCard";
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
        <RecentActivityCard />
        <SystemHealthCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
