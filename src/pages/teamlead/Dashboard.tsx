
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, BarChart3, Target } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";

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
  const teamStats = {
    totalMembers: 24,
    activeProjects: 8,
    completionRate: 87,
    avgPerformance: 85
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Team Lead Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Team performance and project management hub</p>
          </div>
          <Link 
            to="/teamlead/settings" 
            className="text-purple-600 hover:text-purple-500 text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm transition-colors"
          >
            Team Lead Settings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <StatCard 
                title="Team Members"
                value={teamStats.totalMembers.toString()}
                icon={<Users size={24} className="text-blue-600" />}
                change="+2 new members"
                trend="up"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <StatCard 
                title="Active Projects"
                value={teamStats.activeProjects.toString()}
                icon={<Target size={24} className="text-green-600" />}
                change="3 completed this month"
                trend="up"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <StatCard 
                title="Completion Rate"
                value={`${teamStats.completionRate}%`}
                icon={<BarChart3 size={24} className="text-purple-600" />}
                change="+5% from last month"
                trend="up"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-4">
              <StatCard 
                title="Avg Performance"
                value={`${teamStats.avgPerformance}%`}
                icon={<User size={24} className="text-orange-600" />}
                change="+3% improvement"
                trend="up"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart 
                data={teamPerformanceData} 
                title="" 
                subtitle="Monthly performance trends"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Target className="h-5 w-5 text-green-600" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={taskCompletionData} 
                title="" 
                subtitle="Current task status breakdown"
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="h-5 w-5 text-purple-600" />
                Team Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-semibold text-blue-800">Engineering Team</h3>
                    <p className="text-sm text-blue-600">15 members</p>
                  </div>
                  <div className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    92% efficiency
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div>
                    <h3 className="font-semibold text-green-800">QA Team</h3>
                    <p className="text-sm text-green-600">6 members</p>
                  </div>
                  <div className="text-sm font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                    88% efficiency
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div>
                    <h3 className="font-semibold text-yellow-800">Design Team</h3>
                    <p className="text-sm text-yellow-600">3 members</p>
                  </div>
                  <div className="text-sm font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                    75% efficiency
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-800">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-green-800">Sprint 23 completed successfully</p>
                  <span className="text-xs text-green-600 ml-auto">1h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-medium text-blue-800">Code review session scheduled</p>
                  <span className="text-xs text-blue-600 ml-auto">3h ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <p className="text-sm font-medium text-purple-800">New feature request submitted</p>
                  <span className="text-xs text-purple-600 ml-auto">6h ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
