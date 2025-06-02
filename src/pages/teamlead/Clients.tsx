
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Upload, Building, Tag, User, Shield } from "lucide-react";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  departments: string[];
  tags: string[];
  image?: File | null;
  projects: string[];
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

const TeamLeadClients = () => {
  // Only show clients assigned to IT department (Team Lead's department)
  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: 'TechCorp Solutions',
      status: 'Active',
      departments: ['IT'],
      tags: ['High Priority', 'Long-term'],
      projects: ['Web Development', 'Mobile App'],
      contactPerson: 'John Smith',
      email: 'john@techcorp.com',
      phone: '+1-555-0123',
      address: '123 Tech Street, Silicon Valley',
      image: null
    },
    {
      id: 2,
      name: 'HealthCare Systems',
      status: 'Active',
      departments: ['IT'],
      tags: ['Healthcare', 'Critical'],
      projects: ['Database Migration', 'Security Audit'],
      contactPerson: 'Dr. Sarah Wilson',
      email: 'sarah@healthcare.com',
      phone: '+1-555-0456',
      address: '456 Medical Center, Health District',
      image: null
    },
    {
      id: 3,
      name: 'DataTech Solutions',
      status: 'Inactive',
      departments: ['IT'],
      tags: ['Data Analytics'],
      projects: ['Analytics Platform'],
      contactPerson: 'Mike Johnson',
      email: 'mike@datatech.com',
      phone: '+1-555-0789',
      address: '789 Data Street, Tech Park',
      image: null
    }
  ]);

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: '',
    status: 'Active',
    departments: ['IT'], // Default to IT department for Team Lead
    tags: [],
    projects: [],
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });
  const [newTag, setNewTag] = useState('');
  const [showManagerApprovalDialog, setShowManagerApprovalDialog] = useState(false);
  const [clientToDeactivate, setClientToDeactivate] = useState<Client | null>(null);
  const [approvalReason, setApprovalReason] = useState('');

  const handleAddClient = () => {
    if (newClient.name?.trim()) {
      const client: Client = {
        id: Math.max(...clients.map(c => c.id)) + 1,
        name: newClient.name.trim(),
        status: newClient.status as 'Active' | 'Inactive',
        departments: ['IT'], // Team Lead can only assign to IT
        tags: newClient.tags || [],
        projects: newClient.projects || [],
        contactPerson: newClient.contactPerson || '',
        email: newClient.email || '',
        phone: newClient.phone || '',
        address: newClient.address || '',
        image: null
      };
      
      const updatedClients = [...clients, client];
      setClients(updatedClients);
      
      setNewClient({
        name: '',
        status: 'Active',
        departments: ['IT'],
        tags: [],
        projects: [],
        contactPerson: '',
        email: '',
        phone: '',
        address: ''
      });
      setShowAddClient(false);
      
      console.log('Team Lead added client:', client);
      console.log('Updated clients:', updatedClients);
      toast.success('Client added successfully');
    }
  };

  const handleUpdateClient = () => {
    if (editingClient) {
      const updatedClients = clients.map(c => c.id === editingClient.id ? editingClient : c);
      setClients(updatedClients);
      setEditingClient(null);
      
      console.log('Team Lead updated client:', editingClient);
      console.log('Updated clients:', updatedClients);
      toast.success('Client updated successfully');
    }
  };

  const handleImageUpload = (clientId: number, file: File) => {
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, image: file } : client
    );
    setClients(updatedClients);
    console.log('Client image uploaded for client:', clientId);
    toast.success('Client image uploaded successfully');
  };

  const addTag = (clientId: number) => {
    if (newTag.trim()) {
      const updatedClients = clients.map(client => 
        client.id === clientId 
          ? { ...client, tags: [...client.tags, newTag.trim()] }
          : client
      );
      setClients(updatedClients);
      setNewTag('');
      toast.success('Tag added successfully');
    }
  };

  const removeTag = (clientId: number, tagToRemove: string) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, tags: client.tags.filter(tag => tag !== tagToRemove) }
        : client
    );
    setClients(updatedClients);
    toast.success('Tag removed successfully');
  };

  const requestClientDeactivation = (client: Client) => {
    setClientToDeactivate(client);
    setShowManagerApprovalDialog(true);
  };

  const submitDeactivationRequest = () => {
    if (clientToDeactivate && approvalReason.trim()) {
      // In a real app, this would send a request to the manager
      console.log('Deactivation request submitted:', {
        clientId: clientToDeactivate.id,
        clientName: clientToDeactivate.name,
        reason: approvalReason,
        requestedBy: 'Team Lead',
        timestamp: new Date().toISOString()
      });
      
      toast.success('Deactivation request sent to manager for approval', {
        description: `Request for ${clientToDeactivate.name} pending manager approval`
      });
      
      setShowManagerApprovalDialog(false);
      setClientToDeactivate(null);
      setApprovalReason('');
    }
  };

  const toggleClientStatus = (client: Client) => {
    if (client.status === 'Active') {
      // Request manager approval for deactivation
      requestClientDeactivation(client);
    } else {
      // Can reactivate without approval
      const updatedClients = clients.map(c => 
        c.id === client.id ? { ...c, status: 'Active' as const } : c
      );
      setClients(updatedClients);
      toast.success('Client reactivated successfully');
    }
  };

  const activeClients = clients.filter(c => c.status === 'Active');
  const inactiveClients = clients.filter(c => c.status === 'Inactive');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600">Manage clients assigned to your IT department</p>
        </div>
        <Dialog open={showAddClient} onOpenChange={setShowAddClient}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newClient.name || ''}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Company name"
                />
                <Select
                  value={newClient.status}
                  onValueChange={(value) => setNewClient({...newClient, status: value as 'Active' | 'Inactive'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newClient.contactPerson || ''}
                  onChange={(e) => setNewClient({...newClient, contactPerson: e.target.value})}
                  placeholder="Contact person"
                />
                <Input
                  value={newClient.email || ''}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newClient.phone || ''}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                  placeholder="Phone"
                />
              </div>
              <Textarea
                value={newClient.address || ''}
                onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                placeholder="Address"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddClient(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient}>
                  Add Client
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Clients ({activeClients.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Clients ({inactiveClients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeClients.map(client => (
              <Card key={client.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-500" />
                      </div>
                      <span>{client.name}</span>
                    </CardTitle>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Contact: {client.contactPerson}</p>
                    <p className="text-sm text-gray-600">Email: {client.email}</p>
                    <p className="text-sm text-gray-600">Phone: {client.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Projects:</p>
                    <div className="flex flex-wrap gap-1">
                      {client.projects.map((project, index) => (
                        <Badge key={index} variant="outline">{project}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {client.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeTag(client.id, tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        className="text-xs"
                        onKeyPress={(e) => e.key === 'Enter' && addTag(client.id)}
                      />
                      <Button size="sm" onClick={() => addTag(client.id)}>
                        <Tag className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingClient(client)}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleClientStatus(client)}
                      className="text-orange-600 hover:text-orange-700"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Mark Inactive
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveClients.map(client => (
              <Card key={client.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-500" />
                      </div>
                      <span>{client.name}</span>
                    </CardTitle>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Contact: {client.contactPerson}</p>
                    <p className="text-sm text-gray-600">Email: {client.email}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleClientStatus(client)}
                      className="text-green-600 hover:text-green-700"
                    >
                      Reactivate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Manager Approval Dialog for Deactivation */}
      <Dialog open={showManagerApprovalDialog} onOpenChange={setShowManagerApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Manager Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center gap-2 text-yellow-800">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Manager Approval Required</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Deactivating a client requires manager approval. Please provide a reason for this request.
              </p>
            </div>
            
            <div>
              <Label>Client to Deactivate</Label>
              <p className="font-medium">{clientToDeactivate?.name}</p>
            </div>
            
            <div>
              <Label htmlFor="approval-reason">Reason for Deactivation</Label>
              <Textarea
                id="approval-reason"
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                placeholder="Please explain why this client should be deactivated..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowManagerApprovalDialog(false)}>
                Cancel
              </Button>
              <Button onClick={submitDeactivationRequest} disabled={!approvalReason.trim()}>
                Submit Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      {editingClient && (
        <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({...editingClient, name: e.target.value})}
                  placeholder="Company name"
                />
                <Select
                  value={editingClient.status}
                  onValueChange={(value) => setEditingClient({...editingClient, status: value as 'Active' | 'Inactive'})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={editingClient.contactPerson}
                  onChange={(e) => setEditingClient({...editingClient, contactPerson: e.target.value})}
                  placeholder="Contact person"
                />
                <Input
                  value={editingClient.email}
                  onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                  placeholder="Email"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingClient(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateClient}>
                  Update Client
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamLeadClients;
