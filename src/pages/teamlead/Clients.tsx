
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Building, Tag, Shield } from "lucide-react";
import { toast } from "sonner";
import { useClientData } from '@/hooks/useClientData';

interface NewClient {
  name: string;
  company: string;
  status: 'active' | 'inactive';
  contact_email?: string;
  contact_phone?: string;
}

const TeamLeadClients = () => {
  const { 
    clients, 
    loading, 
    addClient, 
    updateClient, 
    addClientTag, 
    removeClientTag, 
    getClientTags, 
    getClientProjects 
  } = useClientData();

  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [newClient, setNewClient] = useState<NewClient>({
    name: '',
    company: '',
    status: 'active',
    contact_email: '',
    contact_phone: ''
  });
  const [newTag, setNewTag] = useState('');
  const [showManagerApprovalDialog, setShowManagerApprovalDialog] = useState(false);
  const [clientToDeactivate, setClientToDeactivate] = useState<any>(null);
  const [approvalReason, setApprovalReason] = useState('');

  const handleAddClient = async () => {
    if (newClient.name?.trim() && newClient.company?.trim()) {
      const success = await addClient({
        name: newClient.name.trim(),
        company: newClient.company.trim(),
        status: newClient.status,
        contact_email: newClient.contact_email?.trim() || null,
        contact_phone: newClient.contact_phone?.trim() || null
      });
      
      if (success) {
        setNewClient({
          name: '',
          company: '',
          status: 'active',
          contact_email: '',
          contact_phone: ''
        });
        setShowAddClient(false);
        toast.success('Client added successfully');
      } else {
        toast.error('Failed to add client');
      }
    } else {
      toast.error('Please fill in required fields');
    }
  };

  const handleUpdateClient = async () => {
    if (editingClient) {
      const success = await updateClient(editingClient.id, {
        name: editingClient.name,
        company: editingClient.company,
        status: editingClient.status,
        contact_email: editingClient.contact_email,
        contact_phone: editingClient.contact_phone
      });
      
      if (success) {
        setEditingClient(null);
        toast.success('Client updated successfully');
      } else {
        toast.error('Failed to update client');
      }
    }
  };

  const addTag = async (clientId: string) => {
    if (newTag.trim()) {
      const success = await addClientTag(clientId, newTag.trim());
      if (success) {
        setNewTag('');
        toast.success('Tag added successfully');
      } else {
        toast.error('Failed to add tag');
      }
    }
  };

  const removeTag = async (clientId: string, tagToRemove: string) => {
    const success = await removeClientTag(clientId, tagToRemove);
    if (success) {
      toast.success('Tag removed successfully');
    } else {
      toast.error('Failed to remove tag');
    }
  };

  const requestClientDeactivation = (client: any) => {
    setClientToDeactivate(client);
    setShowManagerApprovalDialog(true);
  };

  const submitDeactivationRequest = () => {
    if (clientToDeactivate && approvalReason.trim()) {
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

  const toggleClientStatus = async (client: any) => {
    if (client.status === 'active') {
      requestClientDeactivation(client);
    } else {
      const success = await updateClient(client.id, { status: 'active' });
      if (success) {
        toast.success('Client reactivated successfully');
      } else {
        toast.error('Failed to reactivate client');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
            <p className="text-gray-600">Loading clients...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeClients = clients.filter(c => c.status === 'active');
  const inactiveClients = clients.filter(c => c.status === 'inactive');

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
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Company name"
                />
                <Input
                  value={newClient.company}
                  onChange={(e) => setNewClient({...newClient, company: e.target.value})}
                  placeholder="Company full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={newClient.contact_email || ''}
                  onChange={(e) => setNewClient({...newClient, contact_email: e.target.value})}
                  placeholder="Contact email"
                />
                <Input
                  value={newClient.contact_phone || ''}
                  onChange={(e) => setNewClient({...newClient, contact_phone: e.target.value})}
                  placeholder="Contact phone"
                />
              </div>
              <Select
                value={newClient.status}
                onValueChange={(value) => setNewClient({...newClient, status: value as 'active' | 'inactive'})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
            {activeClients.map(client => {
              const clientTags = getClientTags(client.id);
              const clientProjects = getClientProjects(client.id);
              
              return (
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
                      <p className="text-sm text-gray-600">Company: {client.company}</p>
                      {client.contact_email && (
                        <p className="text-sm text-gray-600">Email: {client.contact_email}</p>
                      )}
                      {client.contact_phone && (
                        <p className="text-sm text-gray-600">Phone: {client.contact_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Projects ({clientProjects.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {clientProjects.slice(0, 3).map((project) => (
                          <Badge key={project.id} variant="outline">{project.name}</Badge>
                        ))}
                        {clientProjects.length > 3 && (
                          <Badge variant="outline">+{clientProjects.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {clientTags.map((tag, index) => (
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
              );
            })}
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
                    <p className="text-sm text-gray-600">Company: {client.company}</p>
                    {client.contact_email && (
                      <p className="text-sm text-gray-600">Email: {client.contact_email}</p>
                    )}
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
                <Input
                  value={editingClient.company}
                  onChange={(e) => setEditingClient({...editingClient, company: e.target.value})}
                  placeholder="Company full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={editingClient.contact_email || ''}
                  onChange={(e) => setEditingClient({...editingClient, contact_email: e.target.value})}
                  placeholder="Contact email"
                />
                <Input
                  value={editingClient.contact_phone || ''}
                  onChange={(e) => setEditingClient({...editingClient, contact_phone: e.target.value})}
                  placeholder="Contact phone"
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
