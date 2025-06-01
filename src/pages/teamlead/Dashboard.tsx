
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Star, Edit, Users, TrendingUp, Calendar, AlertCircle, Building, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  rating: number;
  notes: string;
}

interface Client {
  id: number;
  name: string;
  company: string;
  status: 'working' | 'stopped';
  projectCount: number;
}

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 'TL001', name: 'John Smith', designation: 'Senior Developer', rating: 85, notes: 'Excellent performance on recent projects' },
    { id: 'TL002', name: 'Sarah Johnson', designation: 'Frontend Developer', rating: 92, notes: 'Great team player, always meets deadlines' },
    { id: 'TL003', name: 'Mike Davis', designation: 'Backend Developer', rating: 78, notes: 'Good technical skills, needs improvement in communication' },
    { id: 'TL004', name: 'Emily Brown', designation: 'UI/UX Designer', rating: 88, notes: 'Creative and innovative designs' }
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'TechCorp Solutions', company: 'TechCorp Inc.', status: 'working', projectCount: 3 },
    { id: 2, name: 'HealthCare Inc', company: 'HealthCare Systems', status: 'working', projectCount: 2 },
    { id: 3, name: 'Finance Plus', company: 'Financial Services Ltd', status: 'stopped', projectCount: 1 },
    { id: 4, name: 'Retail Masters', company: 'Retail Solutions', status: 'working', projectCount: 2 }
  ]);

  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isInactiveDialogOpen, setIsInactiveDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [inactiveReason, setInactiveReason] = useState('');

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = () => {
    if (editingMember) {
      setTeamMembers(prev => prev.map(member => 
        member.id === editingMember.id ? editingMember : member
      ));
      setIsEditDialogOpen(false);
      setEditingMember(null);
      toast.success('Team member updated successfully');
    }
  };

  const handleRatingClick = (memberId: string, starIndex: number, isDoubleClick: boolean) => {
    const rating = isDoubleClick ? (starIndex + 1) * 20 : (starIndex * 20) + 10;
    
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, rating } : member
    ));
    
    toast.success(`Rating updated to ${rating}%`);
  };

  const handleClientInactive = (client: Client) => {
    setSelectedClient(client);
    setIsInactiveDialogOpen(true);
  };

  const submitInactiveRequest = () => {
    if (!selectedClient || !inactiveReason.trim()) {
      toast.error('Please provide a reason for marking the client as inactive');
      return;
    }

    // Simulate sending request to manager for approval
    console.log('Inactive request submitted:', {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      reason: inactiveReason,
      requestedBy: 'Team Lead',
      timestamp: new Date().toISOString()
    });

    toast.success(`Inactive request submitted for ${selectedClient.name}. Awaiting manager approval.`);
    
    setIsInactiveDialogOpen(false);
    setSelectedClient(null);
    setInactiveReason('');
  };

  const renderStars = (rating: number, memberId: string) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const starRating = (i + 1) * 20;
      const halfStarRating = (i * 20) + 10;
      
      let starType = 'empty';
      if (rating >= starRating) {
        starType = 'full';
      } else if (rating >= halfStarRating) {
        starType = 'half';
      }
      
      stars.push(
        <button
          key={i}
          className="focus:outline-none hover:scale-110 transition-transform"
          onClick={(e) => {
            e.preventDefault();
            handleRatingClick(memberId, i, e.detail === 2);
          }}
        >
          <Star 
            className={`h-5 w-5 ${
              starType === 'full' ? 'fill-yellow-400 text-yellow-400' :
              starType === 'half' ? 'fill-yellow-400/50 text-yellow-400' :
              'text-gray-300'
            }`} 
          />
        </button>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Lead Dashboard</h1>
          <p className="text-gray-600">Manage your team and track performance</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(teamMembers.reduce((sum, member) => sum + member.rating, 0) / teamMembers.length)}%
              </p>
              <p className="text-sm text-gray-600">Avg Performance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{clients.filter(c => c.status === 'working').length}</p>
              <p className="text-sm text-gray-600">Active Clients</p>
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

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-mono text-sm">{member.id}</TableCell>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.designation}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {renderStars(member.rating, member.id)}
                      <span className="text-sm text-gray-600">({member.rating}%)</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMember(member)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Client Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Client Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.company}</TableCell>
                  <TableCell>
                    <Badge className={client.status === 'working' ? 'bg-green-500' : 'bg-red-500'}>
                      {client.status === 'working' ? 'Working' : 'Stopped'}
                    </Badge>
                  </TableCell>
                  <TableCell>{client.projectCount}</TableCell>
                  <TableCell>
                    {client.status === 'working' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClientInactive(client)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Mark Inactive
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Number</label>
                <Input
                  value={editingMember.id}
                  onChange={(e) => setEditingMember({ ...editingMember, id: e.target.value })}
                  placeholder="Enter ID number"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <Input
                  value={editingMember.designation}
                  onChange={(e) => setEditingMember({ ...editingMember, designation: e.target.value })}
                  placeholder="Enter designation"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={editingMember.notes}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  placeholder="Enter notes"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMember}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark Client Inactive Dialog */}
      <Dialog open={isInactiveDialogOpen} onOpenChange={setIsInactiveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Mark Client as Inactive
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Client:</strong> {selectedClient.name}
                </p>
                <p className="text-sm text-orange-800">
                  <strong>Company:</strong> {selectedClient.company}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Reason for marking as inactive:</label>
                <Textarea
                  value={inactiveReason}
                  onChange={(e) => setInactiveReason(e.target.value)}
                  placeholder="Please provide a detailed reason for marking this client as inactive..."
                  rows={4}
                />
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This request will be sent to the manager for approval. 
                  The client will remain active until the manager approves this request.
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsInactiveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitInactiveRequest} className="bg-orange-600 hover:bg-orange-700">
                  Submit Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamLeadDashboard;
