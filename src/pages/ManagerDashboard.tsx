import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, BarChart3, Settings, Calendar, Eye } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useAuth } from '@/contexts/AuthContext';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const { departments } = useDepartments();

  const handleLogout = async () => {
    await signOut();
  };

  const handleViewAllClients = () => {
    console.log('Navigating to client portfolio with departments:', departments);
    navigate('/manager/clients');
  };

  const handleSettingsNavigation = () => {
    navigate('/manager/settings');
  };

  const handleProfileNavigation = () => {
    navigate('/manager/profile');
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile.name}!</p>
            <p className="text-sm text-gray-500">Managing {departments.length} departments</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage your team members across {departments.length} departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View and manage your team's activities and assignments across all departments.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Active Departments:</p>
                <div className="flex flex-wrap gap-1">
                  {departments.slice(0, 3).map(dept => (
                    <span key={dept} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {dept}
                    </span>
                  ))}
                  {departments.length > 3 && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      +{departments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Analytics
              </CardTitle>
              <CardDescription>
                View performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track team performance and project progress across departments.
              </p>
              <Button 
                onClick={handleViewAllClients}
                className="w-full flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View All Clients
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Schedule
              </CardTitle>
              <CardDescription>
                Manage schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Plan and organize team schedules and meetings across all departments.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow" onClick={handleSettingsNavigation}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Customize your manager dashboard settings and department preferences.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Department Overview</CardTitle>
              <CardDescription>
                Current departments synced from Admin dashboard ({departments.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {departments.map((dept) => (
                  <div key={dept} className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="font-medium text-gray-900">{dept}</p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest team updates and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">Team project milestone completed</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">Department list updated from Admin dashboard</p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm">Weekly report due tomorrow</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
