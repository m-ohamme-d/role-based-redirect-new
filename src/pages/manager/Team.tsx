
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import UnifiedDepartmentDialog from '@/components/manager/UnifiedDepartmentDialog';
import DepartmentManagementCard from '@/components/manager/DepartmentManagementCard';
import TeamsTable from '@/components/manager/TeamsTable';
import TeamDetailsDialog from '@/components/manager/TeamDetailsDialog';
import TeamLeadDetailsDialog from '@/components/manager/TeamLeadDetailsDialog';
import NotificationDialog from '@/components/manager/NotificationDialog';
import { supabase } from '@/integrations/supabase/client';


const ManagerTeam = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showTeamDetails, setShowTeamDetails] = useState(false);
  const [selectedTeamLead, setSelectedTeamLead] = useState<any>(null);
  const [showTeamLeadDetails, setShowTeamLeadDetails] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [reminderDate, setReminderDate] = useState('');

  // Mock data for teams
  const mockTeams = [
    { 
      id: 'mock-1', 
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
      performance: 92,
      isMock: true
    },
    { 
      id: 'mock-2', 
      name: 'Design Team', 
      lead: 'Emily Wilson',
      leadEmail: 'emily.wilson@company.com',
      leadPhone: '+1 (555) 987-6543',
      members: [
        { id: 201, name: 'David Lee', position: 'UI Designer', ratings: { productivity: 89, collaboration: 91, timeliness: 87, overall: 89 }, avatar: null },
        { id: 202, name: 'Emma Davis', position: 'UX Designer', ratings: { productivity: 93, collaboration: 89, timeliness: 91, overall: 91 }, avatar: null }
      ],
      department: 'IT', 
      performance: 88,
      isMock: true
    },
    { 
      id: 'mock-3', 
      name: 'HR Team', 
      lead: 'Michael Brown', 
      leadEmail: 'michael.brown@company.com', 
      leadPhone: '+1 (555) 456-7890', 
      members: [
        { id: 301, name: 'Sarah Miller', position: 'HR Specialist', ratings: { productivity: 88, collaboration: 94, timeliness: 86, overall: 89 }, avatar: null }
      ], 
      department: 'HR', 
      performance: 85,
      isMock: true
    },
    { 
      id: 'mock-4', 
      name: 'Sales Team', 
      lead: 'Sarah Johnson', 
      leadEmail: 'sarah.johnson@company.com', 
      leadPhone: '+1 (555) 321-0987', 
      members: [
        { id: 401, name: 'Tom Anderson', position: 'Sales Representative', ratings: { productivity: 91, collaboration: 87, timeliness: 93, overall: 90 }, avatar: null },
        { id: 402, name: 'Lisa Chen', position: 'Account Manager', ratings: { productivity: 87, collaboration: 90, timeliness: 89, overall: 89 }, avatar: null }
      ], 
      department: 'Sales', 
      performance: 90,
      isMock: true
    },
    { 
      id: 'mock-5', 
      name: 'Marketing Team', 
      lead: 'David Lee', 
      leadEmail: 'david.lee@company.com', 
      leadPhone: '+1 (555) 111-2222', 
      members: [
        { id: 501, name: 'Rachel Green', position: 'Marketing Coordinator', ratings: { productivity: 85, collaboration: 88, timeliness: 90, overall: 88 }, avatar: null }
      ], 
      department: 'Marketing', 
      performance: 87,
      isMock: true
    }
  ];

  // Get deleted mock IDs from localStorage
  const getDeletedMockIds = () => {
    const deleted = localStorage.getItem('deletedMockTeams');
    return deleted ? JSON.parse(deleted) : [];
  };

  // Save deleted mock ID to localStorage
  const saveDeletedMockId = (teamId: string) => {
    const deletedIds = getDeletedMockIds();
    if (!deletedIds.includes(teamId)) {
      deletedIds.push(teamId);
      localStorage.setItem('deletedMockTeams', JSON.stringify(deletedIds));
    }
  };

  // Fetch teams from Supabase and merge with mock data
  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get deleted mock IDs and filter them out
      const deletedMockIds = getDeletedMockIds();
      const activeMockTeams = mockTeams.filter(team => !deletedMockIds.includes(team.id));
      
      // Merge mock teams with real teams
      const mergedTeams = [...activeMockTeams, ...(data || [])];
      setTeams(mergedTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to load teams');
      // On error, still show mock data
      const deletedMockIds = getDeletedMockIds();
      const activeMockTeams = mockTeams.filter(team => !deletedMockIds.includes(team.id));
      setTeams(activeMockTeams);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for teams data
  useEffect(() => {
    fetchTeams();

    const channel = supabase
      .channel(`manager-teams-updates-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams'
        },
        (payload) => {
          console.log('Team change detected:', payload);
          fetchTeams(); // Refetch teams data
          toast.info('Team data updated');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up team subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSelectTeam = (teamId: number) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter(id => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map(team => team.id));
    }
  };

  const handleExport = () => {
    if (selectedTeams.length === 0) {
      toast.error('Please select teams to export');
      return;
    }

    const selectedTeamData = teams.filter(team => selectedTeams.includes(team.id));
    
    const headers = ['Team Name', 'Team Lead', 'Department', 'Members', 'Performance'];
    const csvContent = [
      headers.join(','),
      ...selectedTeamData.map(team => 
        [
          team.name, 
          team.lead || team.team_lead_id || 'N/A', 
          team.department || team.department_id || 'N/A', 
          Array.isArray(team.members) ? team.members.length : 0, 
          `${team.performance || 0}%`
        ].join(',')
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

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setShowTeamDetails(true);
  };

  const handleTeamLeadClick = (teamLead: any) => {
    setSelectedTeamLead(teamLead);
    setShowTeamLeadDetails(true);
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

  const handleSendDirectMessage = (teamLead: any) => {
    setNotificationText(`Hi ${teamLead.lead}, I need an update on the current projects.`);
    setShowNotificationDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
        <div className="space-x-2">
          <UnifiedDepartmentDialog teams={teams} setTeams={setTeams} />
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={selectedTeams.length === 0}
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>

          <NotificationDialog
            showDialog={showNotificationDialog}
            onOpenChange={setShowNotificationDialog}
            selectedTeams={selectedTeams}
            teams={teams}
            notificationText={notificationText}
            setNotificationText={setNotificationText}
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
          />
        </div>
      </div>

      <DepartmentManagementCard teams={teams} />

      <TeamsTable 
        teams={teams}
        selectedTeams={selectedTeams}
        onSelectTeam={handleSelectTeam}
        onSelectAll={handleSelectAll}
        onTeamClick={handleTeamClick}
        onTeamLeadClick={handleTeamLeadClick}
      />

      <TeamDetailsDialog
        showDialog={showTeamDetails}
        onOpenChange={setShowTeamDetails}
        selectedTeam={selectedTeam}
        onRatingUpdate={handleRatingUpdate}
      />

      <TeamLeadDetailsDialog
        showDialog={showTeamLeadDetails}
        onOpenChange={setShowTeamLeadDetails}
        selectedTeamLead={selectedTeamLead}
        onSendMessage={handleSendDirectMessage}
      />
    </div>
  );
};

export default ManagerTeam;
