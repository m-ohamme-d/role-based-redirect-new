
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useClientData } from '@/hooks/useClientData';

interface ClientPortfolioCardProps {
  onViewAllClients: () => void;
}

const ClientPortfolioCard = ({ onViewAllClients }: ClientPortfolioCardProps) => {
  const { clients, projects, loading, getClientProjects, getClientTags } = useClientData();
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);

  const handleClientClick = (client: any) => {
    const clientProjects = getClientProjects(client.id);
    const clientTags = getClientTags(client.id);
    
    setSelectedClient({
      ...client,
      projects: clientProjects,
      tags: clientTags
    });
    setShowClientDialog(true);
  };

  const toggleProjectStatus = (projectId: string) => {
    if (selectedClient) {
      const updatedProjects = selectedClient.projects.map((project: any) => 
        project.id === projectId 
          ? { ...project, status: project.status === 'active' ? 'stopped' : 'active' }
          : project
      );
      setSelectedClient({ ...selectedClient, projects: updatedProjects });
      toast.success('Project status updated');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Client Portfolio</CardTitle>
            <Button 
              onClick={onViewAllClients}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All Clients
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.slice(0, 3).map(client => (
              <Card 
                key={client.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleClientClick(client)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-sm text-gray-600">{client.company}</p>
                    <Badge 
                      variant={client.status === 'active' ? 'default' : 'destructive'}
                      className={client.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {client.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {clients.length === 0 && (
            <p className="text-gray-500 text-center py-4">No clients found</p>
          )}
        </CardContent>
      </Card>

      {/* Client Projects Dialog */}
      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedClient?.name} - Projects
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {selectedClient?.projects?.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'destructive'}
                          className={`${project.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          {project.status === 'active' ? 'Active' : project.status === 'stopped' ? 'Stopped' : 'Completed'}
                        </Badge>
                        {project.assigned_department && (
                          <Badge variant="outline">{project.assigned_department}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleProjectStatus(project.id)}
                      >
                        Mark as {project.status === 'active' ? 'Stopped' : 'Active'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!selectedClient?.projects || selectedClient.projects.length === 0) && (
              <p className="text-gray-500 text-center py-4">No projects found for this client</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientPortfolioCard;
