
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Building2, Tag, FolderOpen, X } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { useClients } from '@/hooks/useClients';

const ManagerClients = () => {
  const { departments } = useDepartments();
  const { clients, loading: clientsLoading, createClient, updateClient, deleteClient, addProject, updateProject } = useClients();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
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

  // Helper function to get department names from IDs
  const getDepartmentNames = (departmentIds: string[] | null) => {
    if (!departmentIds || departmentIds.length === 0) return [];
    return departmentIds.map(id => {
      const dept = departments.find(d => d === id);
      return dept || id; // Fallback to ID if department name not found
    });
  };

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

    const success = await updateClient(selectedClient.id, selectedClient);
    if (success) {
      setShowEditDialog(false);
      setSelectedClient(null);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient(clientId);
  };

  const toggleClientStatus = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
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
    if (client) {
      await updateClient(clientId, {
        tags: client.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const addTagToClient = async (clientId: string, newTagValue: string) => {
    if (!newTagValue.trim()) return;
    
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const existingTags = client.tags || [];
      if (existingTags.includes(newTagValue)) {
        toast.error('Tag already exists');
        return;
      }
      
      await updateClient(clientId, {
        tags: [...existingTags, newTagValue]
      });
      toast.success('Tag added successfully');
    }
  };

  const updateClientDepartments = async (clientId: string, departmentId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      const currentDepts = client.assigned_departments || [];
      let updatedDepts;
      
      if (currentDepts.includes(departmentId)) {
        // Remove department if already assigned
        updatedDepts = currentDepts.filter(id => id !== departmentId);
      } else {
        // Add department if not assigned
        updatedDepts = [...currentDepts, departmentId];
      }
      
      await updateClient(clientId, {
        assigned_departments: updatedDepts
      });
      toast.success('Department assignment updated');
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
              <Card key={client.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {client.name}
                    </CardTitle>
                    <Badge 
                      variant={client.status === 'active' ? 'default' : 'destructive'}
                      className={`cursor-pointer ${client.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                      onClick={() => toggleClientStatus(client.id)}
                    >
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{client.company}</p>
                    <p className="text-xs text-gray-500">{client.contact_email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Departments:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {getDepartmentNames(client.assigned_departments)?.map((dept, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs cursor-pointer hover:bg-red-100"
                          onClick={() => {
                            const deptId = client.assigned_departments?.[index];
                            if (deptId) updateClientDepartments(client.id, deptId);
                          }}
                        >
                          {dept} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <Select
                      value=""
                      onValueChange={(value) => updateClientDepartments(client.id, value)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Add department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.filter(dept => !client.assigned_departments?.includes(dept)).map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Projects: {client.projects?.length || 0}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        setSelectedClient(client);
                        setShowProjectDialog(true);
                      }}
                    >
                      <FolderOpen className="h-4 w-4" />
                      Manage Projects
                    </Button>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Tags:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {client.tags && client.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs cursor-pointer hover:bg-red-100"
                          onClick={() => removeTagFromClient(client.id, tag)}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Add tag and press Enter"
                      className="h-8 text-xs"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          addTagToClient(client.id, target.value);
                          target.value = '';
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedClient({...client});
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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

      {/* Projects Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?.name} - Project Management
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name"
              />
              <Select 
                value={newProject.assigned_department_id}
                onValueChange={(value) => setNewProject({...newProject, assigned_department_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddProject} className="w-full">Add Project</Button>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedClient?.projects?.map((project: any) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge 
                            variant={project.status === 'active' ? 'default' : 'destructive'}
                            className={project.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
                          >
                            {project.status}
                          </Badge>
                          {project.assigned_department_id && (
                            <Badge variant="outline">
                              {project.assigned_department_id}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={project.assigned_department_id || ''}
                          onValueChange={(value) => assignProjectToDepartment(project.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateProject(project.id, {
                              status: project.status === 'active' ? 'stopped' : 'active'
                            });
                          }}
                        >
                          Toggle Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerClients;
