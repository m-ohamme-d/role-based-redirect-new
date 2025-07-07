import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDepartments } from '@/hooks/useDepartments';
import { useClients } from '@/hooks/useClients';
import { useManagerClients } from '@/hooks/useManagerClients';
import { ManagerClientCard } from '@/components/manager/ManagerClientCard';
import { CreateClientDialog } from '@/components/manager/CreateClientDialog';
import { EditClientDialog } from '@/components/manager/EditClientDialog';
import { Client } from '@/types/manager';

const ManagerClients = () => {
  const { departments } = useDepartments();
  const { loading: clientsLoading } = useClients();
  const {
    clients,
    createClient,
    toggleClientStatus,
    removeTagFromClient,
    handleClientUpdate,
    handleProjectAdd,
    handleProjectUpdate
  } = useManagerClients();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('all');

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

  const handleEditClient = (updatedClient: Client) => {
    handleClientUpdate(updatedClient);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Portfolio</h1>
          <p className="text-gray-600">Manage clients, projects, and department assignments</p>
        </div>
        <CreateClientDialog 
          departments={departments} 
          onCreateClient={createClient} 
        />
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
                onEditClient={setSelectedClient}
                onRemoveTag={removeTagFromClient}
                onAddProject={handleProjectAdd}
                onUpdateProject={handleProjectUpdate}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <EditClientDialog
        client={selectedClient}
        departments={departments}
        onClose={() => setSelectedClient(null)}
        onSave={handleEditClient}
      />
    </div>
  );
};

export default ManagerClients;