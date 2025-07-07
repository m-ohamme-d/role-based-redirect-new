import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { Client } from '@/types/manager';

interface EditClientDialogProps {
  client: Client | null;
  departments: string[];
  onClose: () => void;
  onSave: (client: Client) => void;
}

export const EditClientDialog = ({ client, departments, onClose, onSave }: EditClientDialogProps) => {
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);

  const handleSave = () => {
    if (editedClient) {
      onSave(editedClient);
    }
  };

  const addTag = () => {
    if (!newTag || !editedClient) return;
    
    if (editedClient.tags?.includes(newTag)) {
      return;
    }
    
    setEditedClient({
      ...editedClient,
      tags: [...(editedClient.tags || []), newTag]
    });
    setNewTag('');
  };

  if (!client || !editedClient) return null;

  return (
    <Dialog open={!!client} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Client Name</Label>
              <Input
                value={editedClient.name}
                onChange={(e) => setEditedClient({...editedClient, name: e.target.value})}
                placeholder="Enter client name"
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                value={editedClient.company}
                onChange={(e) => setEditedClient({...editedClient, company: e.target.value})}
                placeholder="Enter company name"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={editedClient.contact_email || ''}
                onChange={(e) => setEditedClient({...editedClient, contact_email: e.target.value})}
                placeholder="Enter contact email"
              />
            </div>
            <div>
              <Label>Contact Phone</Label>
              <Input
                value={editedClient.contact_phone || ''}
                onChange={(e) => setEditedClient({...editedClient, contact_phone: e.target.value})}
                placeholder="Enter contact phone"
              />
            </div>
          </div>

          <div>
            <Label>Assigned Departments</Label>
            <Select 
              onValueChange={(value) => {
                if (!editedClient.assigned_departments?.includes(value)) {
                  setEditedClient({
                    ...editedClient, 
                    assigned_departments: [...(editedClient.assigned_departments || []), value]
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
              {editedClient.assigned_departments?.map((dept, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer"
                  onClick={() => setEditedClient({
                    ...editedClient, 
                    assigned_departments: editedClient.assigned_departments?.filter((_, i) => i !== index) || []
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
                placeholder="Add new tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {editedClient.tags?.map((tag, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer"
                  onClick={() => setEditedClient({
                    ...editedClient,
                    tags: editedClient.tags?.filter((_, i) => i !== index) || []
                  })}
                >
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Status</Label>
            <Select
              value={editedClient.status}
              onValueChange={(value: 'active' | 'inactive') => setEditedClient({...editedClient, status: value})}
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

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Update Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};