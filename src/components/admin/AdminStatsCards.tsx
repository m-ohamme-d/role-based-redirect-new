
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";

interface AdminStats {
  totalUsers: number;
  totalDepartments: number;
  totalTeamMembers: number;
  lockedRecords: number;
  auditLogs: number;
}

interface AdminStatsCardsProps {
  stats: AdminStats;
  loading: boolean;
}

const AdminStatsCards = ({ stats, loading }: AdminStatsCardsProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Total Users"
        value={stats.totalUsers.toString()}
        icon={<Users size={24} />}
        change={`${stats.totalDepartments} departments`}
        trend="neutral"
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
        value={stats.lockedRecords.toString()}
        icon={<FileText size={24} />}
        change={`${stats.totalTeamMembers} total members`}
        trend="up"
      />
      <StatCard 
        title="Audit Logs"
        value={stats.auditLogs.toString()}
        icon={<Activity size={24} />}
        change="+36 today"
        trend="up"
      />
    </div>
  );
};

export default AdminStatsCards;
