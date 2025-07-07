import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Building, Tag, Shield, FolderOpen } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

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

interface ClientCardProps {
  client: Client;
  onUpdateClient: (client: Client) => void;
  onToggleStatus: (client: Client) => void;
  onEditClient: (client: Client) => void;
}

export const ClientCard = ({ client, onUpdateClient, onToggleStatus, onEditClient }: ClientCardProps) => {
  const [newTag, setNewTag] = useState('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', name: 'Web Development', status: 'active' },
    { id: '2', name: 'Mobile App', status: 'active' }
  ]);
  const [newProjectName, setNewProjectName] = useState('');

  const addTag = () => {
    if (newTag.trim() && !client.tags.includes(newTag.trim())) {
      const updatedClient = {
        ...client,
        tags: [...client.tags, newTag.trim()]
      };
      onUpdateClient(updatedClient);
      setNewTag('');
      toast.success('Tag added successfully');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedClient = {
      ...client,
      tags: client.tags.filter(tag => tag !== tagToRemove)
    };
    onUpdateClient(updatedClient);
    toast.success('Tag removed successfully');
  };

  const toggleProjectStatus = (projectId: string) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId 
        ? { ...project, status: (project.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' }
        : project
    );
    setProjects(updatedProjects);
    toast.success('Project status updated');
  };

  const addProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        status: 'active'
      };
      setProjects([...projects, newProject]);
      setNewProjectName('');
      toast.success('Project added successfully');
    }
  };

  return (
    <>
      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-gray-500" />
              </div>
              <span>{client.name}</span>
            </CardTitle>
            <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
              {client.status}
            </Badge>
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
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {client.projects.map((project, index) => (
                  <Badge key={index} variant="outline">{project}</Badge>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProjectDialog(true)}
              >
                <FolderOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Tags:</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {client.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => removeTag(tag)}
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
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button size="sm" onClick={addTag}>
                <Tag className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClient(client)}
            >
              <Edit2 className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onToggleStatus(client)}
              className={client.status === 'Active' 
                ? "text-orange-600 hover:text-orange-700" 
                : "text-green-600 hover:text-green-700"
              }
            >
              <Shield className="h-3 w-3 mr-1" />
              {client.status === 'Active' ? 'Mark Inactive' : 'Reactivate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Project Management Dialog */}
      <Dialog open={showProjectDialog} onOpenChange={setShowProjectDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{client.name} - Project Management</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                onKeyPress={(e) => e.key === 'Enter' && addProject()}
              />
              <Button onClick={addProject}>Add Project</Button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{project.name}</h3>
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'destructive'}
                          className={project.status === 'active' ? 'bg-green-500' : 'bg-red-500'}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProjectStatus(project.id)}
                      >
                        Toggle Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};