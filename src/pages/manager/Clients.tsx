
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Users, Plus, Search, Building, TrendingUp, Tag, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ManagerClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTagInputs, setNewTagInputs] = useState<{[key: string]: string}>({});

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Fetch projects with client info
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name, company),
          departments!assigned_department_id(name)
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) throw departmentsError;

      setClients(clientsData || []);
      setProjects(projectsData || []);
      setDepartments(departmentsData || []);
    } catch (error: any) {
      console.error('Error fetching client data:', error);
      toast.error('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Enhanced real-time subscriptions
    const clientsChannel = supabase
      .channel('manager-clients-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients'
      }, () => {
        console.log('Clients change detected');
        fetchData();
      })
      .subscribe();

    const projectsChannel = supabase
      .channel('manager-projects-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => {
        console.log('Projects change detected');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  // Enhanced tag management
  const addTag = async (clientId: string, newTag: string) => {
    if (!newTag.trim()) return;

    try {
      const client = clients.find(c => c.id === clientId);
      const currentTags = client?.tags || [];
      
      if (currentTags.includes(newTag.trim())) {
        toast.error('Tag already exists');
        return;
      }

      const updatedTags = [...currentTags, newTag.trim()];
      
      const { error } = await supabase
        .from('clients')
        .update({ tags: updatedTags })
        .eq('id', clientId);

      if (error) throw error;
      
      setNewTagInputs(prev => ({ ...prev, [clientId]: '' }));
      toast.success('Tag added successfully');
    } catch (error: any) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const removeTag = async (clientId: string, tagToRemove: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      const updatedTags = (client?.tags || []).filter((tag: string) => tag !== tagToRemove);
      
      const { error } = await supabase
        .from('clients')
        .update({ tags: updatedTags })
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Tag removed successfully');
    } catch (error: any) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  // Enhanced department assignment
  const updateClientDepartment = async (clientId: string, departmentId: string) => {
    try {
      const assignedDepartments = departmentId ? [departmentId] : [];
      
      const { error } = await supabase
        .from('clients')
        .update({ assigned_departments: assignedDepartments })
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Department assignment updated');
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast.error('Failed to update department');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.tags || []).some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getProjectsForClient = (clientId: string) => {
    return projects.filter(project => project.client_id === clientId);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-200 text-green-800';
      case 'inactive': return 'bg-red-200 text-red-800';
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4">Loading client data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage client relationships and projects</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-gray-600">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === 'active').length}</p>
                <p className="text-sm text-gray-600">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-gray-600">Active Projects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const clientProjects = getProjectsForClient(client.id);
          const assignedDepartment = client.assigned_departments?.[0];
          
          return (
            <Card key={client.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <p className="text-sm text-gray-600">{client.company}</p>
                  </div>
                  <Badge className={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enhanced department assignment */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Assigned Department</p>
                  <Select
                    value={assignedDepartment || ""}
                    onValueChange={(value) => updateClientDepartment(client.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Department</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced tag management */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(client.tags || []).map((tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs flex items-center gap-1"
                      >
                        <Tag className="h-3 w-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(client.id, tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTagInputs[client.id] || ''}
                      onChange={(e) => setNewTagInputs(prev => ({
                        ...prev,
                        [client.id]: e.target.value
                      }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addTag(client.id, newTagInputs[client.id] || '');
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addTag(client.id, newTagInputs[client.id] || '')}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Contact Information</p>
                  <p className="text-sm text-gray-600">{client.contact_email || 'No email'}</p>
                  <p className="text-sm text-gray-600">{client.contact_phone || 'No phone'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">Projects</p>
                  <p className="text-sm text-gray-600">
                    {clientProjects.length} project{clientProjects.length !== 1 ? 's' : ''}
                  </p>
                  <div className="mt-2 space-y-1">
                    {clientProjects.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{project.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            project.status === 'active' ? 'bg-green-100 text-green-800' :
                            project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                    {clientProjects.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{clientProjects.length - 3} more projects
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

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clients Found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'No clients match your search criteria.' : 'Get started by adding your first client.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagerClients;
