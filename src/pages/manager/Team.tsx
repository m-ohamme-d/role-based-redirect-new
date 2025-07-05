
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Users, Plus, Search, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ManagerTeam = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch teams with department and lead info
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          departments(id, name),
          profiles!team_lead_id(name, email)
        `)
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch employees with profile and department info
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select(`
          *,
          profiles!user_id(name, email, role),
          departments(id, name)
        `)
        .order('created_at', { ascending: false });

      if (employeesError) throw employeesError;

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) throw departmentsError;

      setTeams(teamsData || []);
      setEmployees(employeesData || []);
      setDepartments(departmentsData || []);
    } catch (error: any) {
      console.error('Error fetching team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions with proper cleanup
    const teamsChannel = supabase
      .channel('manager-teams-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'teams'
      }, () => {
        console.log('Teams change detected');
        fetchData();
      })
      .subscribe();

    const employeesChannel = supabase
      .channel('manager-employees-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employees'
      }, () => {
        console.log('Employees change detected');
        fetchData();
      })
      .subscribe();

    return () => {
      // Proper cleanup to prevent subscription conflicts
      supabase.removeChannel(teamsChannel);
      supabase.removeChannel(employeesChannel);
    };
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.departments?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEmployeesForTeam = (teamId: string) => {
    return employees.filter(emp => emp.department_id === teamId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4">Loading team data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage teams and team assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teams or departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{teams.length}</p>
                <p className="text-sm text-gray-600">Total Teams</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{teams.filter(t => t.profiles).length}</p>
              <p className="text-sm text-gray-600">Teams with Leads</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => {
          const teamEmployees = getEmployeesForTeam(team.department_id);
          
          return (
            <Card key={team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>
                  <Badge variant="outline">
                    {team.departments?.name || 'No Department'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Team Lead</p>
                  <p className="text-sm text-gray-600">
                    {team.profiles?.name || 'No Lead Assigned'}
                  </p>
                  {team.profiles?.email && (
                    <p className="text-xs text-gray-500">{team.profiles.email}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Team Members</p>
                  <p className="text-sm text-gray-600">
                    {teamEmployees.length} members
                  </p>
                  <div className="mt-2 space-y-1">
                    {teamEmployees.slice(0, 3).map((employee: any) => (
                      <div key={employee.id} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">
                          {employee.profiles?.name || 'Unknown'}
                        </span>
                      </div>
                    ))}
                    {teamEmployees.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{teamEmployees.length - 3} more members
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No teams match your search criteria.' : 'Get started by creating your first team.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagerTeam;
