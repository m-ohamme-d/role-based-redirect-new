import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/integrations/supabase/client';
import { ManagerClientCard } from '@/components/manager/ManagerClientCard';

const ManagerClients = () => {
  const { departments } = useDepartments();
  const { clients: realClients, loading: clientsLoading, createClient, updateClient, deleteClient, addProject, updateProject } = useClients();
  const [clients, setClients] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data to merge with real data
  const mockClients = [
    {
      id: 'mock-1',
      name: 'TechCorp Solutions',
      company: 'TechCorp Inc.',
      status: 'active',
      assigned_departments: ['IT', 'Marketing'],
      tags: ['Enterprise', 'Technology', 'Priority'],
      contact_email: 'contact@techcorp.com',
      contact_phone: '+1 (555) 123-4567',
      projects: [
        { id: 'proj-1', name: 'Enterprise Dashboard', status: 'active' },
        { id: 'proj-2', name: 'Mobile App', status: 'active' }
      ],
      isMock: true
    },
    {
      id: 'mock-2',
      name: 'HealthCare Inc',
      company: 'HealthCare Systems',
      status: 'active',
      assigned_departments: ['IT'],
      tags: ['Healthcare', 'Compliance'],
      contact_email: 'info@healthcare.com',
      contact_phone: '+1 (555) 987-6543',
      projects: [
        { id: 'proj-3', name: 'Patient Portal', status: 'active' }
      ],
      isMock: true
    },
    {
      id: 'mock-3',
      name: 'Retail Masters',
      company: 'Retail Solutions Ltd',
      status: 'inactive',
      assigned_departments: ['Sales', 'Marketing'],
      tags: ['Retail', 'E-commerce'],
      contact_email: 'support@retailmasters.com',
      contact_phone: '+1 (555) 456-7890',
      projects: [
        { id: 'proj-4', name: 'E-commerce Platform', status: 'inactive' }
      ],
      isMock: true
    }
  ];

  // Get deleted mock IDs from localStorage
  const getDeletedMockIds = () => {
    const deleted = localStorage.getItem('deletedMockClients');
    return deleted ? JSON.parse(deleted) : [];
  };

  // Save deleted mock ID to localStorage
  const saveDeletedMockId = (clientId: string) => {
    const deletedIds = getDeletedMockIds();
    if (!deletedIds.includes(clientId)) {
      deletedIds.push(clientId);
      localStorage.setItem('deletedMockClients', JSON.stringify(deletedIds));
    }
  };

  // Filter and merge mock data with real data
  const mergeClientsData = () => {
    const deletedMockIds = getDeletedMockIds();
    const activeMockClients = mockClients.filter(client => !deletedMockIds.includes(client.id));
    
    // Merge mock clients with real clients
    const mergedClients = [...activeMockClients, ...realClients];
    setClients(mergedClients);
  };

  useEffect(() => {
    mergeClientsData();
  }, [realClients]);

  // Set up real-time subscription for clients data  
  useEffect(() => {
    const channel = supabase
      .channel(`manager-clients-updates-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Client change detected:', payload);
          // Refresh the merged data when clients change
          mergeClientsData();
          toast.info('Client data updated');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up client subscription');
      supabase.removeChannel(channel);
    };
  }, [realClients]);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    status: 'active' as const,
    assigned_departments: [] as string[],
    tags: [] as string[],
    contact_email: '',
    contact_phone: ''
  });
  const [newProject, setNewProject] = useState({ 
    name: '', 
    status: 'active' as const,
    assigned_department_id: '' 
  });
  const [newTag, setNewTag] = useState('');

  if (clientsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    return client.status === activeTab;
  });

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.company) {
      toast.error('Please fill in required fields');
      return;
    }

    const success = await createClient(newClient);
    if (success) {
      // Reset form
      setNewClient({
        name: '', 
        company: '', 
        status: 'active', 
        assigned_departments: [], 
        tags: [],
        contact_email: '', 
        contact_phone: ''
      });
      setShowCreateDialog(false);
    }
  };

  const handleEditClient = async () => {
    if (!selectedClient) return;

    if (selectedClient.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === selectedClient.id 
          ? { ...selectedClient }
          : c
      ));
      toast.success('Client updated successfully');
      setShowEditDialog(false);
      setSelectedClient(null);
    } else {
      // Update real client via Supabase
      const success = await updateClient(selectedClient.id, selectedClient);
      if (success) {
        setShowEditDialog(false);
        setSelectedClient(null);
      }
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Handle mock client deletion by saving to localStorage
      saveDeletedMockId(clientId);
      setClients(clients.filter(c => c.id !== clientId));
      toast.success('Mock client removed (will not reappear)');
    } else {
      // Handle real client deletion via Supabase
      await deleteClient(clientId);
    }
  };

  const toggleClientStatus = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      ));
      toast.success('Client status updated');
    } else {
      // Update real client via Supabase
      await updateClient(clientId, {
        status: client.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const handleAddProject = async () => {
    if (!newProject.name || !selectedClient) return;

    const success = await addProject(selectedClient.id, newProject);
    if (success) {
      setNewProject({ name: '', status: 'active', assigned_department_id: '' });
    }
  };

  const assignProjectToDepartment = async (projectId: string, departmentId: string) => {
    await updateProject(projectId, { assigned_department_id: departmentId });
  };

  const addTag = () => {
    if (!newTag || !newClient.tags) return;
    
    if (newClient.tags.includes(newTag)) {
      toast.error('Tag already exists');
      return;
    }
    
    setNewClient({
      ...newClient,
      tags: [...newClient.tags, newTag]
    });
    setNewTag('');
  };

  const removeTag = (tagIndex: number) => {
    setNewClient({
      ...newClient,
      tags: newClient.tags.filter((_, index) => index !== tagIndex)
    });
  };

  const removeTagFromClient = async (clientId: string, tagToRemove: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, tags: c.tags.filter(tag => tag !== tagToRemove) }
          : c
      ));
      toast.success('Tag removed');
    } else {
      // Update real client via Supabase
      await updateClient(clientId, {
        tags: client.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleClientUpdate = (updatedClient: any) => {
    if (updatedClient.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === updatedClient.id ? updatedClient : c
      ));
      toast.success('Client updated successfully');
    } else {
      // Update real client via Supabase
      updateClient(updatedClient.id, updatedClient);
    }
  };

  const handleProjectAdd = async (clientId: string, projectData: any) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Add project to mock client
      const newProject = {
        id: `proj-${Date.now()}`,
        name: projectData.name,
        status: projectData.status,
        assigned_department_id: projectData.assigned_department_id
      };
      
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, projects: [...(c.projects || []), newProject] }
          : c
      ));
      toast.success('Project added successfully');
    } else {
      // Add project via Supabase
      await addProject(clientId, projectData);
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: any) => {
    // Find the client that contains this project
    const client = clients.find(c => 
      c.projects?.some(p => p.id === projectId)
    );
    
    if (!client) return;

    if (client.isMock) {
      // Update project in mock client
      setClients(clients.map(c => 
        c.id === client.id 
          ? {
              ...c, 
              projects: c.projects?.map(p => 
                p.id === projectId ? { ...p, ...updates } : p
              )
            }
          : c
      ));
      toast.success('Project updated successfully');
    } else {
      // Update project via Supabase
      await updateProject(projectId, updates);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600">Manage clients, projects, and department assignments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label htmlFor="company-name">Company Name *</Label>
                  <Input
                    id="company-name"
                    value={newClient.company}
                    onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newClient.contact_email}
                    onChange={(e) => setNewClient({...newClient, contact_email: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={newClient.contact_phone}
                    onChange={(e) => setNewClient({...newClient, contact_phone: e.target.value})}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>

              <div>
                <Label>Assigned Departments</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!newClient.assigned_departments.includes(value)) {
                      setNewClient({...newClient, assigned_departments: [...newClient.assigned_departments, value]});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select departments" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newClient.assigned_departments.map((dept, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => setNewClient({
                        ...newClient, 
                        assigned_departments: newClient.assigned_departments.filter((_, i) => i !== index)
                      })}
                    >
                      {dept} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Enter tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newClient.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => removeTag(index)}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClient}>
                  Create Client
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({clients.filter(c => c.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({clients.filter(c => c.status === 'inactive').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <ManagerClientCard
                key={client.id}
                client={client}
                departments={departments}
                onUpdateClient={handleClientUpdate}
                onToggleStatus={toggleClientStatus}
                onEditClient={(client) => {
                  setSelectedClient({...client});
                  setShowEditDialog(true);
                }}
                onRemoveTag={removeTagFromClient}
                onAddProject={handleProjectAdd}
                onUpdateProject={handleProjectUpdate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Client Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Client Name</Label>
                  <Input
                    value={selectedClient.name}
                    onChange={(e) => setSelectedClient({...selectedClient, name: e.target.value})}
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <Label>Company Name</Label>
                  <Input
                    value={selectedClient.company}
                    onChange={(e) => setSelectedClient({...selectedClient, company: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={selectedClient.contact_email || ''}
                    onChange={(e) => setSelectedClient({...selectedClient, contact_email: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={selectedClient.contact_phone || ''}
                    onChange={(e) => setSelectedClient({...selectedClient, contact_phone: e.target.value})}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>

              <div>
                <Label>Assigned Departments</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!selectedClient.assigned_departments?.includes(value)) {
                      setSelectedClient({
                        ...selectedClient, 
                        assigned_departments: [...(selectedClient.assigned_departments || []), value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add departments" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClient.assigned_departments?.map((dept, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => setSelectedClient({
                        ...selectedClient, 
                        assigned_departments: selectedClient.assigned_departments?.filter((_, i) => i !== index) || []
                      })}
                    >
                      {dept} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add new tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        if (newTag && !selectedClient.tags?.includes(newTag)) {
                          setSelectedClient({
                            ...selectedClient,
                            tags: [...(selectedClient.tags || []), newTag]
                          });
                          setNewTag('');
                        }
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={() => {
                      if (newTag && !selectedClient.tags?.includes(newTag)) {
                        setSelectedClient({
                          ...selectedClient,
                          tags: [...(selectedClient.tags || []), newTag]
                        });
                        setNewTag('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedClient.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => setSelectedClient({
                        ...selectedClient,
                        tags: selectedClient.tags?.filter((_, i) => i !== index) || []
                      })}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={selectedClient.status}
                  onValueChange={(value) => setSelectedClient({...selectedClient, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditClient}>
                  Update Client
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ManagerClients;