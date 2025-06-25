
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Database, Activity } from "lucide-react";

type Stats = {
  totalUsers: number;
  lockedRecords: number;
  auditLogs: number;
};

interface DashboardStatsCardsProps {
  stats: Stats;
}

const DashboardStatsCards = ({ stats }: DashboardStatsCardsProps) => (
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
);

export default DashboardStatsCards;
