
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Edit2, Tag, Building, Users, TrendingUp, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ClientPortfolio = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [newTag, setNewTag] = useState('');
  const [editingTags, setEditingTags] = useState<string[]>([]);

  // Fetch clients and departments from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch clients with department names
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          *,
          departments:assigned_departments(id, name)
        `)
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Fetch all departments for dropdowns
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('id, name')
        .order('name');

      if (deptError) throw deptError;

      setClients(clientsData || []);
      setDepartments(deptData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription for clients
    const clientChannel = supabase
      .channel('manager-clients-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clients'
      }, () => {
        console.log('Client change detected');
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(clientChannel);
    };
  }, []);

  const handleAddTag = async (clientId: string, currentTags: string[]) => {
    if (!newTag.trim()) return;
    
    const updatedTags = [...currentTags, newTag.trim()];
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ tags: updatedTags })
        .eq('id', clientId);

      if (error) throw error;
      
      setNewTag('');
      toast.success('Tag added successfully');
    } catch (error: any) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (clientId: string, currentTags: string[], tagToRemove: string) => {
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    
    try {
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

  const handleEditTags = (client: any) => {
    setSelectedClient(client);
    setEditingTags(client.tags || []);
    setShowEditDialog(true);
  };

  const handleSaveTags = async () => {
    if (!selectedClient) return;
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ tags: editingTags })
        .eq('id', selectedClient.id);

      if (error) throw error;
      
      setShowEditDialog(false);
      setSelectedClient(null);
      setEditingTags([]);
      toast.success('Tags updated successfully');
    } catch (error: any) {
      console.error('Error updating tags:', error);
      toast.error('Failed to update tags');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
        <span className="ml-4">Loading client portfolio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600">Manage client relationships and department assignments</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Portfolio Stats */}
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
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-gray-600">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{clients.filter(c => c.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending Clients</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
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
              <div>
                <p className="text-sm font-medium text-gray-700">Contact</p>
                <p className="text-sm text-gray-600">{client.contact_email}</p>
                <p className="text-sm text-gray-600">{client.contact_phone}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Assigned Departments</p>
                <div className="flex flex-wrap gap-1">
                  {client.assigned_departments?.map((deptId: string) => {
                    const dept = departments.find(d => d.id === deptId);
                    return dept ? (
                      <Badge key={deptId} variant="outline" className="text-xs">
                        {dept.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Tags</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTags(client)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {client.tags?.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1">
                      <Tag className="h-2 w-2" />
                      {tag}
                    </Badge>
                  )) || <span className="text-xs text-gray-500">No tags</span>}
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="text-xs"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTag(client.id, client.tags || []);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddTag(client.id, client.tags || [])}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Tags Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tags - {selectedClient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {editingTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-red-100"
                      onClick={() => {
                        setEditingTags(editingTags.filter((_, i) => i !== index));
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTags}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPortfolio;
