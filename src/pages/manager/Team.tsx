import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Bell, Plus, Edit2, Trash2, Upload, Star, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartments } from '@/hooks/useDepartments';

// Enhanced teams data with members
const teamsData = [
  { 
    id: 1, 
    name: 'Development Team', 
    lead: 'John Smith', 
    members: [
      { id: 101, name: 'Alice Johnson', position: 'Senior Developer', performance: 92, avatar: null },
      { id: 102, name: 'Bob Wilson', position: 'Frontend Developer', performance: 88, avatar: null },
      { id: 103, name: 'Carol Brown', position: 'Backend Developer', performance: 90, avatar: null }
    ],
    department: 'IT', 
    performance: 92 
  },
  { 
    id: 2, 
    name: 'Design Team', 
    lead: 'Emily Wilson', 
    members: [
      { id: 201, name: 'David Lee', position: 'UI Designer', performance: 89, avatar: null },
      { id: 202, name: 'Emma Davis', position: 'UX Designer', performance: 91, avatar: null }
    ],
    department: 'IT', 
    performance: 88 
  },
  { id: 3, name: 'HR Team', lead: 'Michael Brown', members: [], department: 'HR', performance: 85 },
  { id: 4, name: 'Sales Team', lead: 'Sarah Johnson', members: [], department: 'Sales', performance: 90 },
  { id: 5, name: 'Marketing Team', lead: 'David Lee', members: [], department: 'Marketing', performance: 87 },
];

const ManagerTeam = () => {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const [teams, setTeams] = useState(teamsData);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('');
  const [newTeamLead, setNewTeamLead] = useState('');
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  const [editTeamName, setEditTeamName] = useState('');
  
  // Department management states
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');
  
  // Missing state variables for notification dialog
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // Department management functions
  const handleAddDepartment = () => {
    if (!newDepartmentName.trim()) {
      toast.error('Department name is required');
      return;
    }

    if (newDepartmentName.trim().length < 2) {
      toast.error('Department name must be at least 2 characters long');
      return;
    }

    if (addDepartment(newDepartmentName.trim())) {
      setNewDepartmentName('');
      setShowAddDepartment(false);
      toast.success('Department added successfully - synced with Admin dashboard');
    } else {
      toast.error('Department already exists or invalid name');
    }
  };

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
    // Check if any teams are using this department
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
    
    // Create CSV content
    const headers = ['Team Name', 'Team Lead', 'Department', 'Members', 'Performance'];
    const csvContent = [
      headers.join(','),
      ...selectedTeamData.map(team => 
        [team.name, team.lead, team.department, Array.isArray(team.members) ? team.members.length : 0, `${team.performance}%`].join(',')
      )
    ].join('\n');

    // Create and download file
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

  const handleAddTeam = () => {
    if (newTeamName.trim() && newTeamDept && newTeamLead.trim()) {
      const newTeam = {
        id: Math.max(...teams.map(t => t.id)) + 1,
        name: newTeamName.trim(),
        lead: newTeamLead.trim(),
        members: [],
        department: newTeamDept,
        performance: 0
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      setNewTeamDept('');
      setNewTeamLead('');
      setShowAddTeam(false);
      toast.success('Team added successfully');
    }
  };

  const handleEditTeam = (teamId: number, currentName: string) => {
    setEditingTeam(teamId);
    setEditTeamName(currentName);
  };

  const handleSaveTeamEdit = () => {
    if (editingTeam && editTeamName.trim()) {
      setTeams(teams.map(team => 
        team.id === editingTeam ? { ...team, name: editTeamName.trim() } : team
      ));
      setEditingTeam(null);
      setEditTeamName('');
      toast.success('Team name updated successfully');
    }
  };

  const handleImageUpload = (memberId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedTeam) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedMembers = selectedTeam.members.map((member: any) => 
          member.id === memberId ? { ...member, avatar: e.target?.result } : member
        );
        const updatedTeam = { ...selectedTeam, members: updatedMembers };
        setSelectedTeam(updatedTeam);
        setTeams(teams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
        toast.success('Profile image updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (memberId: number, rating: number) => {
    if (selectedTeam) {
      const updatedMembers = selectedTeam.members.map((member: any) => 
        member.id === memberId ? { ...member, performance: rating } : member
      );
      const updatedTeam = { ...selectedTeam, members: updatedMembers };
      setSelectedTeam(updatedTeam);
      setTeams(teams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
      toast.success('Rating updated');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <div className="space-x-2">
          <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team name"
                />
                <Select value={newTeamDept} onValueChange={setNewTeamDept}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newTeamLead}
                  onChange={(e) => setNewTeamLead(e.target.value)}
                  placeholder="Team lead name"
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddTeam(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTeam}>
                    Add Team
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
            <DialogContent className="sm:max-w-[425px]">
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
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Reminder Date (Optional)</label>
                  <Input
                    type="datetime-local"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="mt-1"
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
            <Dialog open={showAddDepartment} onOpenChange={setShowAddDepartment}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Department</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newDepartmentName}
                    onChange={(e) => setNewDepartmentName(e.target.value)}
                    placeholder="Enter department name (min. 2 characters)"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddDepartment(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddDepartment}>
                      Add Department
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
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
                      {editingTeam === team.id ? (
                        <div className="flex gap-2">
                          <Input 
                            value={editTeamName} 
                            onChange={(e) => setEditTeamName(e.target.value)}
                            className="max-w-[150px]"
                          />
                          <Button size="sm" onClick={handleSaveTeamEdit}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingTeam(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleTeamClick(team)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {team.name}
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">{team.lead}</td>
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
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTeam(team.id, team.name)}
                        className="p-1 h-auto"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <Dialog open={showTeamDetails} onOpenChange={setShowTeamDetails}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedTeam?.name} - Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {selectedTeam?.members?.map((member: any) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Avatar className="h-12 w-12 cursor-pointer">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all">
                          <Upload className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(member.id, e)}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.position}</p>
                        <Badge variant="outline">ID: {member.id}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Rating:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 cursor-pointer ${
                                star <= Math.round(member.performance / 20) 
                                  ? 'fill-yellow-400 text-yellow-400' 
                                  : 'text-gray-300'
                              }`}
                              onClick={() => handleRatingChange(member.id, star * 20)}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({member.performance}%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerTeam;
