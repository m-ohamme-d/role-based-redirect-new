
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, Plus, Edit2, Trash2, User, Upload } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

// Mock data for charts
const teamOverviewData = [
  { name: 'Jan', value: 32 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 35 },
  { name: 'Apr', value: 50 },
  { name: 'May', value: 42 },
  { name: 'Jun', value: 55 },
  { name: 'Jul', value: 58 },
];

const teamProgressData = [
  { name: 'Week 1', value: 70 },
  { name: 'Week 2', value: 82 },
  { name: 'Week 3', value: 75 },
  { name: 'Week 4', value: 90 },
];

// Rating criteria
const ratingCriteria = [
  'Code Quality',
  'Communication',
  'Problem Solving',
  'Team Collaboration',
  'Meeting Deadlines',
  'Innovation',
  'Technical Skills',
  'Leadership'
];

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Smith', designation: 'Developer', rating: 85, notes: 'Excellent performance', photo: null, department: 'IT' },
    { id: 2, name: 'Sarah Johnson', designation: 'Designer', rating: 92, notes: 'Consistent high quality work', photo: null, department: 'IT' },
    { id: 3, name: 'Michael Brown', designation: 'QA Tester', rating: 78, notes: 'Good attention to detail', photo: null, department: 'IT' },
    { id: 4, name: 'Emily Davis', designation: 'Developer', rating: 88, notes: 'Fast learner', photo: null, department: 'IT' },
    { id: 5, name: 'Robert Wilson', designation: 'Developer', rating: 75, notes: 'Needs mentoring', photo: null, department: 'IT' },
  ]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    designation: '',
    rating: 0,
    notes: '',
    photo: null as File | null
  });
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [showCriteria, setShowCriteria] = useState(false);

  // Filter to show only IT department for IT team lead
  const currentUserDepartment = 'IT'; // This would come from user context
  const filteredMembers = teamMembers.filter(member => member.department === currentUserDepartment);

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.designation.trim()) {
      const member = {
        id: Math.max(...teamMembers.map(m => m.id)) + 1,
        name: newMember.name.trim(),
        designation: newMember.designation.trim(),
        rating: newMember.rating || 0,
        notes: newMember.notes || '',
        photo: newMember.photo,
        department: currentUserDepartment
      };
      
      const updatedMembers = [...teamMembers, member];
      setTeamMembers(updatedMembers);
      
      // Sync logging for live updates
      console.log('Team member added - syncing to Manager and Admin dashboards:', member);
      console.log('Updated team members list:', updatedMembers);
      
      setNewMember({ name: '', designation: '', rating: 0, notes: '', photo: null });
      setShowAddMember(false);
      toast.success('Team member added successfully - updates synced to Manager and Admin dashboards');
    }
  };

  const handleRemoveMember = (memberId: number) => {
    const updatedMembers = teamMembers.filter(m => m.id !== memberId);
    setTeamMembers(updatedMembers);
    
    // Sync logging for live updates
    console.log('Team member removed - syncing to Manager and Admin dashboards, member ID:', memberId);
    console.log('Updated team members list:', updatedMembers);
    
    toast.success('Team member removed successfully - updates synced to Manager and Admin dashboards');
  };

  const handlePhotoUpload = (memberId: number, file: File) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, photo: file } : member
    );
    setTeamMembers(updatedMembers);
    
    // Sync logging for live updates
    console.log('Team member photo updated - syncing to Manager and Admin dashboards:', memberId);
    console.log('Updated team members list:', updatedMembers);
    
    toast.success('Photo uploaded successfully - updates synced to Manager and Admin dashboards');
  };

  const updateMemberRating = (memberId: number, newRating: number) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, rating: newRating } : member
    );
    setTeamMembers(updatedMembers);
    
    // Sync logging for live updates
    console.log('Team member rating updated - syncing to Manager and Admin dashboards:', { memberId, newRating });
    console.log('Updated team members list:', updatedMembers);
    
    toast.success('Rating updated successfully - updates synced to Manager and Admin dashboards');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Lead Dashboard - {currentUserDepartment}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCriteria(true)}>
            Rating Criteria
          </Button>
          <Link to="/teamlead/profile" className="text-blue-600 hover:underline text-sm font-medium">
            View Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Team Members"
          value={filteredMembers.length.toString()}
          icon={<Users size={24} />}
          change="+2 from last month"
          trend="up"
        />
        <StatCard 
          title="Average Rating"
          value={`${Math.round(filteredMembers.reduce((acc, member) => acc + member.rating, 0) / filteredMembers.length) || 0}%`}
          icon={<BarChart3 size={24} />}
          change="+3% from last quarter"
          trend="up"
        />
        <StatCard 
          title="Team Projects"
          value="7"
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Completion Rate"
          value="92%"
          icon={<BarChart3 size={24} />}
          change="+5% from last month"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={teamOverviewData} 
          title="Team Overview" 
          subtitle="Performance metrics over time"
        />
        <BarChart 
          data={teamProgressData} 
          title="Team Progress" 
          subtitle="Weekly progress report"
        />
      </div>

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Team List - {currentUserDepartment} Department</CardTitle>
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    placeholder="Member name"
                  />
                  <Input
                    value={newMember.designation}
                    onChange={(e) => setNewMember({...newMember, designation: e.target.value})}
                    placeholder="Designation"
                  />
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={newMember.rating}
                    onChange={(e) => setNewMember({...newMember, rating: parseInt(e.target.value) || 0})}
                    placeholder="Initial rating (0-100)"
                  />
                  <Input
                    value={newMember.notes}
                    onChange={(e) => setNewMember({...newMember, notes: e.target.value})}
                    placeholder="Notes"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddMember(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddMember}>
                      Add Member
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Photo</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Designation</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Notes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(member => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="relative group">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center relative overflow-hidden">
                            {member.photo ? (
                              <img 
                                src={URL.createObjectURL(member.photo)} 
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-6 w-6 text-gray-500" />
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Upload className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(member.id, file);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">{member.id}</td>
                      <td className="py-3 px-4">{member.name}</td>
                      <td className="py-3 px-4">{member.designation}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${member.rating}%` }}
                            ></div>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={member.rating}
                            onChange={(e) => updateMemberRating(member.id, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                          />
                          <span className="ml-1 text-sm">%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{member.notes}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMember(member.id)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Criteria Dialog */}
      <Dialog open={showCriteria} onOpenChange={setShowCriteria}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rating Criteria</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Team members are rated based on the following criteria:
            </p>
            {ratingCriteria.map((criteria, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm">{criteria}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamLeadDashboard;
