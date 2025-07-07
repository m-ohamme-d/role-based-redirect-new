import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { NewClientData } from '@/types/manager';

interface CreateClientDialogProps {
  departments: string[];
  onCreateClient: (clientData: NewClientData) => Promise<boolean>;
}

export const CreateClientDialog = ({ departments, onCreateClient }: CreateClientDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newClient, setNewClient] = useState<NewClientData>({
    name: '',
    company: '',
    status: 'active',
    assigned_departments: [],
    tags: [],
    contact_email: '',
    contact_phone: ''
  });
  const [newTag, setNewTag] = useState('');

  const resetForm = () => {
    setNewClient({
      name: '',
      company: '',
      status: 'active',
      assigned_departments: [],
      tags: [],
      contact_email: '',
      contact_phone: ''
    });
    setNewTag('');
  };

  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.company) {
      toast.error('Please fill in required fields');
      return;
    }

    const success = await onCreateClient(newClient);
    if (success) {
      resetForm();
      setShowDialog(false);
    }
  };

  const addTag = () => {
    if (!newTag) return;
    
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

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateClient}>
              Create Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};