import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Bell, Plus, Edit2, Trash2, Upload, Star, Building, Users, Settings, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartments } from '@/hooks/useDepartments';
import TeamPerformanceRating from '@/components/TeamPerformanceRating';

// Enhanced teams data with members and team leads
const teamsData = [
  { 
    id: 1, 
    name: 'Development Team', 
    lead: 'John Smith',
    leadEmail: 'john.smith@company.com',
    leadPhone: '+1 (555) 123-4567',
    members: [
      { id: 101, name: 'Alice Johnson', position: 'Senior Developer', ratings: { productivity: 92, collaboration: 88, timeliness: 90, overall: 90 }, avatar: null },
      { id: 102, name: 'Bob Wilson', position: 'Frontend Developer', ratings: { productivity: 85, collaboration: 92, timeliness: 88, overall: 88 }, avatar: null },
      { id: 103, name: 'Carol Brown', position: 'Backend Developer', ratings: { productivity: 90, collaboration: 85, timeliness: 92, overall: 89 }, avatar: null }
    ],
    department: 'IT', 
    performance: 92 
  },
  { 
    id: 2, 
    name: 'Design Team', 
    lead: 'Emily Wilson',
    leadEmail: 'emily.wilson@company.com',
    leadPhone: '+1 (555) 987-6543',
    members: [
      { id: 201, name: 'David Lee', position: 'UI Designer', ratings: { productivity: 89, collaboration: 91, timeliness: 87, overall: 89 }, avatar: null },
      { id: 202, name: 'Emma Davis', position: 'UX Designer', ratings: { productivity: 93, collaboration: 89, timeliness: 91, overall: 91 }, avatar: null }
    ],
    department: 'IT', 
    performance: 88 
  },
  { id: 3, name: 'HR Team', lead: 'Michael Brown', leadEmail: 'michael.brown@company.com', leadPhone: '+1 (555) 456-7890', members: [], department: 'HR', performance: 85 },
  { id: 4, name: 'Sales Team', lead: 'Sarah Johnson', leadEmail: 'sarah.johnson@company.com', leadPhone: '+1 (555) 321-0987', members: [], department: 'Sales', performance: 90 },
  { id: 5, name: 'Marketing Team', lead: 'David Lee', leadEmail: 'david.lee@company.com', leadPhone: '+1 (555) 111-2222', members: [], department: 'Marketing', performance: 87 },
];

const ManagerTeam = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [teams, setTeams] = useState(teamsData);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  
  // Simplified form states - ONLY for department creation
  const [showCreateDepartmentDialog, setShowCreateDepartmentDialog] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentDescription, setNewDepartmentDescription] = useState('');
  
  // Team creation form
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    teamLead: '',
    department: '',
    description: ''
  });
  
  // Department management states
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  
  // Team lead details dialog
  const [showTeamLeadDetails, setShowTeamLeadDetails] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState<any>(null);
  
  // Notification dialog states
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // Department creation
  const handleCreateDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast.error('Department name is required');
      return;
    }

    if (addDepartment(newDepartmentName.trim())) {
      toast.success(`Department "${newDepartmentName}" created successfully`);
      console.log('Department created:', { name: newDepartmentName, description: newDepartmentDescription });
    } else {
      toast.error('Department already exists');
    }

    setNewDepartmentName('');
    setNewDepartmentDescription('');
    setShowCreateDepartmentDialog(false);
  };

  // Team creation
  const handleCreateTeam = () => {
    if (!newTeam.name.trim() || !newTeam.department || !newTeam.teamLead.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const team = {
      id: Math.max(...teams.map(t => t.id)) + 1,
      name: newTeam.name.trim(),
      lead: newTeam.teamLead.trim(),
      leadEmail: `${newTeam.teamLead.toLowerCase().replace(' ', '.')}@company.com`,
      leadPhone: '+1 (555) 000-0000',
      members: [],
      department: newTeam.department,
      performance: 0
    };
    setTeams([...teams, team]);
    
    toast.success(`Team "${newTeam.name}" created and notification sent to ${newTeam.teamLead}`);
    console.log('Team created:', team);

    setNewTeam({ name: '', teamLead: '', department: '', description: '' });
    setShowCreateTeamDialog(false);
  };

  // Department management functions
  const handleStartEditDepartment = (deptName: string) => {
    setEditingDepartment(deptName);
    setEditDepartmentName(deptName);
  };

  const handleSaveEditDepartment = (oldName: string) => {
    if (!editDepartmentName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }

    if (editDepartmentName.trim().length < 2) {
      toast.error('Department name must be at least 2 characters long');
      return;
    }

    if (updateDepartment(oldName, editDepartmentName.trim())) {
      setEditingDepartment(null);
      setEditDepartmentName('');
      toast.success('Department updated successfully - synced with Admin dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

  const handleDeleteDepartment = (deptName: string) => {
    const teamsUsingDept = teams.filter(team => team.department === deptName);
    if (teamsUsingDept.length > 0) {
      toast.error(`Cannot delete department "${deptName}" - it has ${teamsUsingDept.length} team(s) assigned to it`);
      return;
    }

    if (deleteDepartment(deptName)) {
      toast.success('Department deleted successfully - synced with Admin dashboard');
    } else {
      toast.error('Failed to delete department');
    }
  };

  const handleSelectTeam = (teamId: number) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === teamsData.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teamsData.map(team => team.id));
    }
  };

  const handleExport = () => {
    if (selectedTeams.length === 0) {
      toast.error('Please select teams to export');
      return;
    }

    const selectedTeamData = teamsData.filter(team => selectedTeams.includes(team.id));
    
    const headers = ['Team Name', 'Team Lead', 'Department', 'Members', 'Performance'];
    const csvContent = [
      headers.join(','),
      ...selectedTeamData.map(team => 
        [team.name, team.lead, team.department, Array.isArray(team.members) ? team.members.length : 0, `${team.performance}%`].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `team_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`Exported ${selectedTeams.length} teams successfully`);
  };

  const handleSendNotification = () => {
    if (selectedTeams.length === 0) {
      toast.error('Please select teams to notify');
      return;
    }

    if (!notificationText.trim()) {
      toast.error('Please enter notification text');
      return;
    }

    const selectedTeamNames = teamsData
      .filter(team => selectedTeams.includes(team.id))
      .map(team => team.name)
      .join(', ');

    toast.success(`Notification sent to ${selectedTeams.length} team leads: ${selectedTeamNames}`);
    
    if (reminderDate) {
      toast.success(`Reminder set for ${reminderDate}`);
    }

    setShowNotificationDialog(false);
    setNotificationText('');
    setReminderDate('');
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  const handleTeamLeadClick = (teamLead: any) => {
    setSelectedTeamLead(teamLead);
    setShowTeamLeadDetails(true);
  };

  const handleEditTeam = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setFormData({
        name: team.name,
        type: 'team',
        manager: '',
        description: '',
        teamLead: team.lead,
        department: team.department,
        customOptions: { budget: '', location: '', workType: 'hybrid' }
      });
      setShowUnifiedForm(true);
    }
  };

  const handleRatingUpdate = (memberId: string, category: string, rating: number) => {
    if (selectedTeam) {
      const updatedMembers = selectedTeam.members.map((member: any) => 
        member.id.toString() === memberId ? { 
          ...member, 
          ratings: { ...member.ratings, [category]: rating }
        } : member
      );
      const updatedTeam = { ...selectedTeam, members: updatedMembers };
      setSelectedTeam(updatedTeam);
      setTeams(teams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
      console.log('Rating updated for member:', memberId, 'category:', category, 'rating:', rating);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <div className="space-x-2">
          <Dialog open={showCreateDepartmentDialog} onOpenChange={setShowCreateDepartmentDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Create Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Department Name *</label>
                  <Input
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="Enter department name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newDepartmentDescription}
                    onChange={(e) => setNewDepartmentDescription(e.target.value)}
                    placeholder="Brief description of the department"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDepartmentDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateDepartment}>
                    Create Department
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Team Name *</label>
                  <Input
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Department *</label>
                  <Select 
                    value={newTeam.department} 
                    onValueChange={(val) => setNewTeam({...newTeam, department: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Team Lead *</label>
                  <Input
                    value={newTeam.teamLead}
                    onChange={(e) => setNewTeam({...newTeam, teamLead: e.target.value})}
                    placeholder="Team lead's name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                    placeholder="Brief description of the team"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateTeamDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTeam}>
                    Create Team
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={selectedTeams.length === 0}
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2"
                disabled={selectedTeams.length === 0}
              >
                <Bell className="h-4 w-4" />
                Notify
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    value={notificationText}
                    onChange={(e) => setNotificationText(e.target.value)}
                    placeholder="Enter notification message..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reminder Date (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendNotification}>
                    Send Notification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Department Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Management
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center gap-2 p-2 border rounded">
                {editingDepartment === dept ? (
                  <div className="flex items-center gap-1 w-full">
                    <Input 
                      value={editDepartmentName} 
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                      className="h-6 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEditDepartment(dept);
                        if (e.key === 'Escape') setEditingDepartment(null);
                      }}
                      autoFocus
                    />
                    <Button size="sm" variant="ghost" onClick={() => handleSaveEditDepartment(dept)} className="h-6 w-6 p-0">
                      ✓
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingDepartment(null)} className="h-6 w-6 p-0">
                      ✕
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm flex-1">{dept}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleStartEditDepartment(dept)} className="h-6 w-6 p-0">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteDepartment(dept)} className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Changes sync automatically with Admin dashboard
          </p>
        </CardContent>
      </Card>

      {/* Teams Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    <input 
                      type="checkbox" 
                      checked={selectedTeams.length === teams.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Team Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Team Lead</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Members</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {teams.map(team => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        checked={selectedTeams.includes(team.id)} 
                        onChange={() => handleSelectTeam(team.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleTeamClick(team)}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {team.name}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleTeamLeadClick(team)}
                        className="text-blue-600 hover:underline"
                      >
                        {team.lead}
                      </button>
                    </td>
                    <td className="py-3 px-4">{team.department}</td>
                    <td className="py-3 px-4">{Array.isArray(team.members) ? team.members.length : 0}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${team.performance}%` }}
                          ></div>
                        </div>
                        <span>{team.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog with Team Performance Rating */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name} - Team Performance Rating</DialogTitle>
          </DialogHeader>
          {selectedTeam && selectedTeam.members && selectedTeam.members.length > 0 && (
            <TeamPerformanceRating
              members={selectedTeam.members.map((member: any) => ({
                id: member.id.toString(),
                name: member.name,
                position: member.position,
                department: selectedTeam.department,
                ratings: member.ratings
              }))}
              onRatingUpdate={handleRatingUpdate}
            />
          )}
          {selectedTeam && (!selectedTeam.members || selectedTeam.members.length === 0) && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No team members assigned to this team yet.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Team Lead Details Dialog */}
      <Dialog open={showTeamLeadDetails} onOpenChange={setShowTeamLeadDetails}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Team Lead Details</DialogTitle>
          </DialogHeader>
          {selectedTeamLead && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedTeamLead.lead?.split(' ').map((n: string) => n[0]).join('') || 'TL'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTeamLead.lead}</h3>
                  <p className="text-sm text-gray-600">Team Lead - {selectedTeamLead.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 pt-2">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p>{selectedTeamLead.leadEmail || `${selectedTeamLead.lead?.toLowerCase().replace(' ', '.')}@company.com`}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p>{selectedTeamLead.leadPhone || '+1 (555) 000-0000'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Department</label>
                  <p>{selectedTeamLead.department}</p>
                </div>
              </div>
              
              <div className="pt-3">
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    setShowTeamLeadDetails(false);
                    setNotificationText(`Hi ${selectedTeamLead.lead}, I need an update on the current projects.`);
                    setShowNotificationDialog(true);
                    toast.success('Notification draft created');
                  }}
                >
                  <Send className="h-4 w-4" />
                  Send Direct Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerTeam;
