
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, BarChart3, Target } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

// Mock data for charts
const teamPerformanceData = [
  { name: 'Jan', value: 78 },
  { name: 'Feb', value: 82 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 80 },
  { name: 'May', value: 88 },
  { name: 'Jun', value: 92 },
  { name: 'Jul', value: 89 },
];

const taskCompletionData = [
  { name: 'Completed', value: 85 },
  { name: 'In Progress', value: 12 },
  { name: 'Pending', value: 8 },
  { name: 'Overdue', value: 3 },
];

const TeamLeadDashboard = () => {
  // Mock data for team stats
  const teamStats = {
    totalMembers: 24,
    activeProjects: 8,
    completionRate: 87,
    avgPerformance: 85
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Lead Dashboard</h1>
        <Link to="/teamlead/settings" className="text-blue-600 hover:underline text-sm font-medium">
          Team Lead Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Team Members"
          value={teamStats.totalMembers.toString()}
          icon={<Users size={24} />}
          change="+2 new members"
          trend="up"
        />
        <StatCard 
          title="Active Projects"
          value={teamStats.activeProjects.toString()}
          icon={<Target size={24} />}
          change="3 completed this month"
          trend="up"
        />
        <StatCard 
          title="Completion Rate"
          value={`${teamStats.completionRate}%`}
          icon={<BarChart3 size={24} />}
          change="+5% from last month"
          trend="up"
        />
        <StatCard 
          title="Avg Performance"
          value={`${teamStats.avgPerformance}%`}
          icon={<User size={24} />}
          change="+3% improvement"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={teamPerformanceData} 
          title="Team Performance" 
          subtitle="Monthly performance trends"
        />
        <BarChart 
          data={taskCompletionData} 
          title="Task Distribution" 
          subtitle="Current task status breakdown"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Engineering Team</h3>
                  <p className="text-sm text-gray-600">15 members</p>
                </div>
                <div className="text-sm font-medium text-green-600">
                  92% efficiency
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h3 className="font-medium">QA Team</h3>
                  <p className="text-sm text-gray-600">6 members</p>
                </div>
                <div className="text-sm font-medium text-green-600">
                  88% efficiency
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h3 className="font-medium">Design Team</h3>
                  <p className="text-sm text-gray-600">3 members</p>
                </div>
                <div className="text-sm font-medium text-yellow-600">
                  75% efficiency
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Sprint 23 completed successfully</p>
                <span className="text-xs text-gray-500 ml-auto">1h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">Code review session scheduled</p>
                <span className="text-xs text-gray-500 ml-auto">3h ago</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">New feature request submitted</p>
                <span className="text-xs text-gray-500 ml-auto">6h ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
