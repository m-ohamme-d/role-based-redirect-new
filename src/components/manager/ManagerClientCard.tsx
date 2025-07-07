import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Building2, Tag, FolderOpen, X } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  status: 'active' | 'stopped' | 'completed';
  assigned_department_id?: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive';
  assigned_departments?: string[];
  tags?: string[];
  contact_email?: string;
  contact_phone?: string;
  projects?: Project[];
  isMock?: boolean;
}

interface ManagerClientCardProps {
  client: Client;
  departments: string[];
  onUpdateClient: (client: Client) => void;
  onToggleStatus: (clientId: string) => void;
  onEditClient: (client: Client) => void;
  onRemoveTag: (clientId: string, tag: string) => void;
  onAddProject: (clientId: string, projectData: any) => void;
  onUpdateProject: (projectId: string, updates: any) => void;
}

export const ManagerClientCard = ({ 
  client, 
  departments, 
  onUpdateClient, 
  onToggleStatus, 
  onEditClient, 
  onRemoveTag,
  onAddProject,
  onUpdateProject
}: ManagerClientCardProps) => {
  const [newTag, setNewTag] = useState('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    assigned_department_id: ''
  });

  const addTag = () => {
    if (newTag.trim() && !client.tags?.includes(newTag.trim())) {
      const updatedClient = {
        ...client,
        tags: [...(client.tags || []), newTag.trim()]
      };
      onUpdateClient(updatedClient);
      setNewTag('');
      toast.success('Tag added successfully');
    }
  };

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      onAddProject(client.id, {
        name: newProject.name.trim(),
        status: 'active',
        assigned_department_id: newProject.assigned_department_id
      });
      setNewProject({ name: '', assigned_department_id: '' });
    }
  };

  const toggleProjectStatus = (project: Project) => {
    onUpdateProject(project.id, {
      status: project.status === 'active' ? 'stopped' : 'active'
    });
  };

  const assignProjectToDepartment = (projectId: string, departmentId: string) => {
    onUpdateProject(projectId, { assigned_department_id: departmentId });
  };

  return (
    <>
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {client.name}
            </CardTitle>
            <Badge 
              variant={client.status === 'active' ? 'default' : 'destructive'}
              className={`cursor-pointer ${client.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
              onClick={() => onToggleStatus(client.id)}
            >
              {client.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">{client.company}</p>
            <p className="text-xs text-gray-500">{client.contact_email}</p>
            <p className="text-xs text-gray-500">{client.contact_phone}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Departments:</p>
            <div className="flex flex-wrap gap-1">
              {client.assigned_departments?.map((dept, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {dept}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Projects:</p>
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {client.projects?.map((project, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{project.name}</Badge>
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
            <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
            <div className="flex flex-wrap gap-1 mb-2">
              {client.tags?.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100"
                  onClick={() => onRemoveTag(client.id, tag)}
                >
                  {tag} <X className="h-3 w-3 ml-1" />
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

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditClient(client)}
            >
              <Edit2 className="h-4 w-4" />
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
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                placeholder="Enter project name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
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
              {client.projects?.map((project) => (
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
                          onClick={() => toggleProjectStatus(project)}
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
    </>
  );
};