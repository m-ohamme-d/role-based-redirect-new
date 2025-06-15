
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock clients data
const clientsData = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    company: 'TechCorp Inc.', 
    status: 'working',
    projects: [
      { id: 1, name: 'Mobile App Development', status: 'working' },
      { id: 2, name: 'Web Platform Redesign', status: 'working' }
    ]
  },
  { 
    id: 2, 
    name: 'HealthCare Inc', 
    company: 'HealthCare Systems', 
    status: 'working',
    projects: [
      { id: 3, name: 'Patient Management System', status: 'working' },
      { id: 4, name: 'Telemedicine Platform', status: 'stopped' }
    ]
  },
  { 
    id: 3, 
    name: 'Finance Plus', 
    company: 'Financial Services Ltd', 
    status: 'stopped',
    projects: [
      { id: 5, name: 'Trading Platform', status: 'stopped' }
    ]
  },
  { 
    id: 4, 
    name: 'Retail Masters', 
    company: 'Retail Solutions', 
    status: 'working',
    projects: [
      { id: 6, name: 'E-commerce Migration', status: 'working' }
    ]
  },
];

interface ClientPortfolioCardProps {
  onViewAllClients: () => void;
}

const ClientPortfolioCard = ({ onViewAllClients }: ClientPortfolioCardProps) => {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showClientDialog, setShowClientDialog] = useState(false);

  const handleClientClick = (client: any) => {
    setSelectedClient(client);
    setShowClientDialog(true);
  };

  const toggleProjectStatus = (projectId: number) => {
    if (selectedClient) {
      const updatedProjects = selectedClient.projects.map((project: any) => 
        project.id === projectId 
          ? { ...project, status: project.status === 'working' ? 'stopped' : 'working' }
          : project
      );
      setSelectedClient({ ...selectedClient, projects: updatedProjects });
      toast.success('Project status updated');
    }
  };

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
            {clientsData.slice(0, 3).map(client => (
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
                      variant={client.status === 'working' ? 'default' : 'destructive'}
                      className={client.status === 'working' ? 'bg-green-500' : 'bg-red-500'}
                    >
                      {client.status === 'working' ? 'Working' : 'Stopped'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            {selectedClient?.projects.map((project: any) => (
              <Card key={project.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={project.status === 'working' ? 'default' : 'destructive'}
                          className={`${project.status === 'working' ? 'bg-green-500' : 'bg-red-500'}`}
                        >
                          {project.status === 'working' ? 'Working' : 'Stopped'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleProjectStatus(project.id)}
                      >
                        Mark as {project.status === 'working' ? 'Stopped' : 'Working'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClientPortfolioCard;
