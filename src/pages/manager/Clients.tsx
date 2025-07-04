import { useState } from 'react';
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

// Mock clients data with enhanced structure
const mockClients = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    company: 'TechCorp Inc.',
    status: 'active',
    departments: ['IT', 'Marketing'],
    tags: ['Enterprise', 'Technology', 'Priority'],
    projects: [
      { id: 1, name: 'Mobile App Development', status: 'active', assignedDepartment: 'IT' },
      { id: 2, name: 'Web Platform Redesign', status: 'active', assignedDepartment: 'IT' }
    ],
    contactEmail: 'contact@techcorp.com',
    contactPhone: '+1 (555) 123-4567'
  },
  {
    id: 2,
    name: 'HealthCare Inc',
    company: 'HealthCare Systems',
    status: 'active',
    departments: ['IT'],
    tags: ['Healthcare', 'Compliance'],
    projects: [
      { id: 3, name: 'Patient Management System', status: 'active', assignedDepartment: 'IT' }
    ],
    contactEmail: 'info@healthcare.com',
    contactPhone: '+1 (555) 987-6543'
  },
  {
    id: 3,
    name: 'Retail Masters',
    company: 'Retail Solutions Ltd',
    status: 'inactive',
    departments: ['Sales', 'Marketing'],
    tags: ['Retail', 'E-commerce'],
    projects: [
      { id: 4, name: 'E-commerce Platform', status: 'stopped', assignedDepartment: 'Sales' }
    ],
    contactEmail: 'support@retailmasters.com',
    contactPhone: '+1 (555) 456-7890'
  }
];

const ManagerClients = () => {
  const { departments } = useDepartments();
  const [clients, setClients] = useState(mockClients);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    status: 'active',
    departments: [] as string[],
    tags: [] as string[],
    contactEmail: '',
    contactPhone: '',
    projects: []
  });
  const [newProject, setNewProject] = useState({ 
    name: '', 
    status: 'active', 
    assignedDepartment: '' 
  });
  const [newTag, setNewTag] = useState('');

  const filteredClients = clients.filter(client => {
    if (activeTab === 'all') return true;
    return client.status === activeTab;
  });

  const handleCreateClient = () => {
    if (!newClient.name || !newClient.company) {
      toast.error('Please fill in required fields');
      return;
    }

    const client = {
      ...newClient,
      id: Math.max(...clients.map(c => c.id)) + 1,
      projects: []
    };

    const updatedClients = [...clients, client];
    setClients(updatedClients);
    
    // Reset form
    setNewClient({
      name: '', company: '', status: 'active', departments: [], tags: [],
      contactEmail: '', contactPhone: '', projects: []
    });
    setShowCreateDialog(false);
    
    console.log('Client created successfully:', client);
    toast.success('Client created successfully');
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? selectedClient : client
    );
    
    setClients(updatedClients);
    setShowEditDialog(false);
    setSelectedClient(null);
    
    console.log('Client updated successfully:', selectedClient);
    toast.success('Client updated successfully');
  };

  const handleDeleteClient = (clientId: number) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    console.log('Client deleted, updated list:', updatedClients);
    toast.success('Client deleted successfully');
  };

  const toggleClientStatus = (clientId: number) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, status: client.status === 'active' ? 'inactive' : 'active' }
        : client
    );
    setClients(updatedClients);
    console.log('Client status updated:', updatedClients);
    toast.success('Client status updated');
  };

  const addProject = () => {
    if (!newProject.name || !selectedClient) return;

    const project = {
      ...newProject,
      id: Date.now()
    };

    const updatedClient = {
      ...selectedClient,
      projects: [...selectedClient.projects, project]
    };

    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? updatedClient : client
    );
    
    setClients(updatedClients);
    setSelectedClient(updatedClient);
    setNewProject({ name: '', status: 'active', assignedDepartment: '' });
    
    if (project.assignedDepartment) {
      toast.success(`Project added and assigned to ${project.assignedDepartment} department`);
    } else {
      toast.success('Project added successfully');
    }
  };

  const assignProjectToDepartment = (projectId: number, department: string) => {
    if (!selectedClient) return;

    const updatedProjects = selectedClient.projects.map((project: any) => 
      project.id === projectId 
        ? { ...project, assignedDepartment: department }
        : project
    );

    const updatedClient = { ...selectedClient, projects: updatedProjects };
    const updatedClients = clients.map(client => 
      client.id === selectedClient.id ? updatedClient : client
    );
    
    setClients(updatedClients);
    setSelectedClient(updatedClient);
    toast.success(`Project assigned to ${department} department`);
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

  const addTagToClient = (clientId: number, tag: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, tags: [...client.tags, tag] }
        : client
    );
    setClients(updatedClients);
    toast.success('Tag added to client');
  };

  const removeTagFromClient = (clientId: number, tagToRemove: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, tags: client.tags.filter(tag => tag !== tagToRemove) }
        : client
    );
    setClients(updatedClients);
    toast.success('Tag removed from client');
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
                    value={newClient.contactEmail}
                    onChange={(e) => setNewClient({...newClient, contactEmail: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input
                    id="contact-phone"
                    value={newClient.contactPhone}
                    onChange={(e) => setNewClient({...newClient, contactPhone: e.target.value})}
                    placeholder="Enter contact phone"
                  />
                </div>
              </div>

              <div>
                <Label>Assigned Departments</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!newClient.departments.includes(value)) {
                      setNewClient({...newClient, departments: [...newClient.departments, value]});
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
                  {newClient.departments.map((dept, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => setNewClient({
                        ...newClient, 
                        departments: newClient.departments.filter((_, i) => i !== index)
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
                    <p className="text-xs text-gray-500">{client.contactEmail}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Departments:</p>
                    <div className="flex flex-wrap gap-1">
                      {client.departments.map((dept, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Projects: {client.projects.length}</p>
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

                  {client.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {client.tags.map((tag, index) => (
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
                    </div>
                  )}

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

      {/* Edit Client Dialog - keeping existing code structure but with enhanced tag management */}
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
                    value={selectedClient.contactEmail}
                    onChange={(e) => setSelectedClient({...selectedClient, contactEmail: e.target.value})}
                    placeholder="Enter contact email"
                  />
                </div>
                <div>
                  <Label>Contact Phone</Label>
                  <Input
                    value={selectedClient.contactPhone}
                    onChange={(e) => setSelectedClient({...selectedClient, contactPhone: e.target.value})}
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

              <div>
                <Label>Assigned Departments</Label>
                <Select 
                  onValueChange={(value) => {
                    if (!selectedClient.departments.includes(value)) {
                      setSelectedClient({
                        ...selectedClient, 
                        departments: [...selectedClient.departments, value]
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
                  {selectedClient.departments.map((dept: string, index: number) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                      onClick={() => setSelectedClient({
                        ...selectedClient, 
                        departments: selectedClient.departments.filter((_: string, i: number) => i !== index)
                      })}
                    >
                      {dept} ×
                    </Badge>
                  ))}
                </div>
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
                value={newProject.assignedDepartment}
                onValueChange={(value) => setNewProject({...newProject, assignedDepartment: value})}
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
            <Button onClick={addProject} className="w-full">Add Project</Button>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {selectedClient?.projects.map((project: any) => (
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
                          {project.assignedDepartment && (
                            <Badge variant="outline">
                              {project.assignedDepartment}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={project.assignedDepartment || ''}
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
                            const updatedProjects = selectedClient.projects.map((p: any) =>
                              p.id === project.id 
                                ? { ...p, status: p.status === 'active' ? 'stopped' : 'active' }
                                : p
                            );
                            const updatedClient = { ...selectedClient, projects: updatedProjects };
                            setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
                            setSelectedClient(updatedClient);
                            toast.success('Project status updated');
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
