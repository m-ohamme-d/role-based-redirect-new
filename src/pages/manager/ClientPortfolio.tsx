
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Search, Eye, Building, FileText, Filter } from 'lucide-react';

// Enhanced clients data
const allClientsData = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    company: 'TechCorp Inc.', 
    status: 'working',
    projectCount: 3,
    departments: ['IT', 'Marketing'],
    tags: ['Enterprise', 'Technology'],
    projects: [
      { id: 1, name: 'Mobile App Development', status: 'working' },
      { id: 2, name: 'Web Platform Redesign', status: 'working' },
      { id: 3, name: 'API Integration', status: 'working' }
    ],
    contactEmail: 'contact@techcorp.com',
    contactPhone: '+1 (555) 123-4567'
  },
  { 
    id: 2, 
    name: 'HealthCare Inc', 
    company: 'HealthCare Systems', 
    status: 'working',
    projectCount: 2,
    departments: ['IT'],
    tags: ['Healthcare', 'Compliance'],
    projects: [
      { id: 4, name: 'Patient Management System', status: 'working' },
      { id: 5, name: 'Telemedicine Platform', status: 'stopped' }
    ],
    contactEmail: 'info@healthcare.com',
    contactPhone: '+1 (555) 987-6543'
  },
  { 
    id: 3, 
    name: 'Finance Plus', 
    company: 'Financial Services Ltd', 
    status: 'stopped',
    projectCount: 1,
    departments: ['Finance'],
    tags: ['Financial', 'Banking'],
    projects: [
      { id: 6, name: 'Trading Platform', status: 'stopped' }
    ],
    contactEmail: 'support@financeplus.com',
    contactPhone: '+1 (555) 456-7890'
  },
  { 
    id: 4, 
    name: 'Retail Masters', 
    company: 'Retail Solutions', 
    status: 'working',
    projectCount: 2,
    departments: ['Sales', 'Marketing'],
    tags: ['Retail', 'E-commerce'],
    projects: [
      { id: 7, name: 'E-commerce Migration', status: 'working' },
      { id: 8, name: 'Inventory System', status: 'working' }
    ],
    contactEmail: 'contact@retailmasters.com',
    contactPhone: '+1 (555) 321-0987'
  },
  { 
    id: 5, 
    name: 'EduTech Solutions', 
    company: 'Education Technology Ltd', 
    status: 'working',
    projectCount: 1,
    departments: ['IT', 'Sales'],
    tags: ['Education', 'Technology'],
    projects: [
      { id: 9, name: 'Learning Management System', status: 'working' }
    ],
    contactEmail: 'info@edutech.com',
    contactPhone: '+1 (555) 111-2222'
  }
];

const ManagerClientPortfolio = () => {
  const [clients, setClients] = useState(allClientsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDetails, setShowClientDetails] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setShowClientDetails(true);
    console.log('Client selected for details:', client);
  };

  const toggleProjectStatus = (projectId: number) => {
    if (selectedClient) {
      const updatedProjects = selectedClient.projects.map((project: any) => 
        project.id === projectId 
          ? { ...project, status: project.status === 'working' ? 'stopped' : 'working' }
          : project
      );
      
      const updatedClient = { ...selectedClient, projects: updatedProjects };
      setSelectedClient(updatedClient);
      
      // Update in main clients list
      setClients(clients.map(client => 
        client.id === selectedClient.id ? updatedClient : client
      ));
      
      toast.success('Project status updated');
      console.log('Project status toggled:', projectId);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'working' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600">Manage all client relationships and projects</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{clients.length}</p>
                <p className="text-sm text-gray-600">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold text-green-600">{clients.filter(c => c.status === 'working').length}</p>
              <p className="text-sm text-gray-600">Active Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold text-red-600">{clients.filter(c => c.status === 'stopped').length}</p>
              <p className="text-sm text-gray-600">Inactive Clients</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.projectCount, 0)}</p>
              <p className="text-sm text-gray-600">Total Projects</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="working">Working</option>
                <option value="stopped">Stopped</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Project Count</TableHead>
                <TableHead>Departments</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeColor(client.status)} text-white`}>
                      {client.status === 'working' ? 'Working' : 'Stopped'}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.projectCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {client.departments.map((dept, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClientClick(client)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Details Dialog */}
      <Dialog open={showClientDetails} onOpenChange={setShowClientDetails}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {selectedClient?.name} - Project Details
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Company</p>
                  <p className="text-base">{selectedClient.company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge className={`${getStatusBadgeColor(selectedClient.status)} text-white`}>
                    {selectedClient.status === 'working' ? 'Working' : 'Stopped'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Email</p>
                  <p className="text-base">{selectedClient.contactEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Phone</p>
                  <p className="text-base">{selectedClient.contactPhone}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Departments</p>
                <div className="flex gap-2">
                  {selectedClient.departments.map((dept: string, index: number) => (
                    <Badge key={index} variant="outline">{dept}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                <div className="flex gap-2">
                  {selectedClient.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Projects</p>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {selectedClient.projects.map((project: any) => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge 
                              className={`mt-2 ${getStatusBadgeColor(project.status)} text-white`}
                            >
                              {project.status === 'working' ? 'Working' : 'Stopped'}
                            </Badge>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleProjectStatus(project.id)}
                          >
                            Mark as {project.status === 'working' ? 'Stopped' : 'Working'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerClientPortfolio;
