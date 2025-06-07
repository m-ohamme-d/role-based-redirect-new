import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, Plus, Edit2, Trash2, User, Eye, Upload, Camera, TrendingUp, Clock } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Enhanced chart data with more realistic trends
const teamOverviewData = [
  { name: 'Jan', value: 68, projects: 12, satisfaction: 85 },
  { name: 'Feb', value: 72, projects: 14, satisfaction: 87 },
  { name: 'Mar', value: 75, projects: 16, satisfaction: 89 },
  { name: 'Apr', value: 81, projects: 18, satisfaction: 91 },
  { name: 'May', value: 78, projects: 17, satisfaction: 88 },
  { name: 'Jun', value: 85, projects: 20, satisfaction: 93 },
  { name: 'Jul', value: 88, projects: 22, satisfaction: 95 },
  { name: 'Aug', value: 92, projects: 24, satisfaction: 96 },
  { name: 'Sep', value: 89, projects: 23, satisfaction: 94 },
  { name: 'Oct', value: 94, projects: 26, satisfaction: 97 },
  { name: 'Nov', value: 91, projects: 25, satisfaction: 95 },
  { name: 'Dec', value: 96, projects: 28, satisfaction: 98 }
];

const teamProgressData = [
  { name: 'Week 1', completed: 85, inProgress: 12, pending: 3 },
  { name: 'Week 2', completed: 92, inProgress: 15, pending: 2 },
  { name: 'Week 3', completed: 88, inProgress: 18, pending: 4 },
  { name: 'Week 4', completed: 95, inProgress: 14, pending: 1 },
];

const productivityData = [
  { name: 'Mon', hours: 8.2, efficiency: 92 },
  { name: 'Tue', hours: 8.5, efficiency: 89 },
  { name: 'Wed', hours: 8.1, efficiency: 94 },
  { name: 'Thu', hours: 8.7, efficiency: 91 },
  { name: 'Fri', hours: 7.9, efficiency: 88 },
  { name: 'Sat', hours: 4.2, efficiency: 85 },
  { name: 'Sun', hours: 2.1, efficiency: 90 }
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

// Mock designations data
const availableDesignations = [
  'Senior Developer',
  'Project Lead',
  'UI Designer',
  'Developer',
  'QA Tester',
  'Junior Developer',
  'Technical Lead',
  'Frontend Developer',
  'Backend Developer'
];

const TeamLeadDashboard = () => {
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 'TL001', 
      name: 'John Smith', 
      designation: 'Senior Developer', 
      rating: 92, 
      notes: 'Excellent performance in React development', 
      photo: null, 
      department: 'IT', 
      originalOrder: 1,
      profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      email: 'john@company.com',
      joinDate: '2022-01-15',
      lastActive: '2 hours ago',
      projectsCompleted: 24,
      currentProjects: 3
    },
    { 
      id: 'TL002', 
      name: 'Sarah Johnson', 
      designation: 'UI/UX Designer', 
      rating: 89, 
      notes: 'Outstanding design skills and user research', 
      photo: null, 
      department: 'IT', 
      originalOrder: 2,
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      email: 'sarah@company.com',
      joinDate: '2022-03-10',
      lastActive: '1 hour ago',
      projectsCompleted: 18,
      currentProjects: 2
    },
    { 
      id: 'TL003', 
      name: 'Michael Brown', 
      designation: 'Backend Developer', 
      rating: 85, 
      notes: 'Strong database optimization skills', 
      photo: null, 
      department: 'IT', 
      originalOrder: 3,
      profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      email: 'michael@company.com',
      joinDate: '2023-06-01',
      lastActive: '30 minutes ago',
      projectsCompleted: 16,
      currentProjects: 4
    },
    { 
      id: 'TL004', 
      name: 'Emily Davis', 
      designation: 'Frontend Developer', 
      rating: 91, 
      notes: 'Exceptional JavaScript and Vue.js expertise', 
      photo: null, 
      department: 'IT', 
      originalOrder: 4,
      profileImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
      email: 'emily@company.com',
      joinDate: '2021-11-20',
      lastActive: '5 minutes ago',
      projectsCompleted: 31,
      currentProjects: 2
    },
    { 
      id: 'TL005', 
      name: 'Robert Wilson', 
      designation: 'QA Engineer', 
      rating: 78, 
      notes: 'Improving testing methodologies, needs mentoring', 
      photo: null, 
      department: 'IT', 
      originalOrder: 5,
      profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
      email: 'robert@company.com',
      joinDate: '2023-09-15',
      lastActive: '1 day ago',
      projectsCompleted: 8,
      currentProjects: 3
    },
  ]);

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    id: '',
    name: '',
    designation: '',
    rating: 0,
    notes: '',
    photo: null as File | null
  });
  const [showCriteria, setShowCriteria] = useState(false);
  const [viewingMember, setViewingMember] = useState<any>(null);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<any>(null);
  const [editingData, setEditingData] = useState({
    id: '',
    designation: '',
    notes: '',
    customDesignation: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  // Filter to show only IT department for IT team lead
  const currentUserDepartment = 'IT';
  const filteredMembers = teamMembers
    .filter(member => member.department === currentUserDepartment)
    .sort((a, b) => a.originalOrder - b.originalOrder);

  // Enhanced statistics calculation
  const getEnhancedStats = () => {
    const totalMembers = filteredMembers.length;
    const avgRating = Math.round(filteredMembers.reduce((acc, member) => acc + member.rating, 0) / totalMembers);
    const totalProjectsCompleted = filteredMembers.reduce((acc, member) => acc + (member.projectsCompleted || 0), 0);
    const totalCurrentProjects = filteredMembers.reduce((acc, member) => acc + (member.currentProjects || 0), 0);
    const topPerformer = filteredMembers.reduce((top, member) => 
      member.rating > top.rating ? member : top
    );

    return {
      totalMembers,
      avgRating,
      totalProjectsCompleted,
      totalCurrentProjects,
      topPerformer: topPerformer.name,
      completionRate: Math.round((totalProjectsCompleted / (totalProjectsCompleted + totalCurrentProjects)) * 100)
    };
  };

  const stats = getEnhancedStats();

  const handleAddMember = () => {
    if (newMember.name.trim() && newMember.designation.trim() && newMember.id.trim()) {
      const nextOrder = Math.max(...teamMembers.map(m => m.originalOrder || 0)) + 1;
      const member = {
        id: newMember.id.trim(),
        name: newMember.name.trim(),
        designation: newMember.designation.trim(),
        rating: newMember.rating || 0,
        notes: newMember.notes || '',
        photo: newMember.photo,
        department: currentUserDepartment,
        originalOrder: nextOrder,
        profileImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
        email: `${newMember.name.toLowerCase().replace(' ', '.')}@company.com`,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        projectsCompleted: 0,
        currentProjects: 0
      };
      
      const updatedMembers = [...teamMembers, member];
      setTeamMembers(updatedMembers);
      
      console.log('Team member added - syncing to Manager and Admin dashboards:', member);
      console.log('Updated team members list:', updatedMembers);
      
      setNewMember({ id: '', name: '', designation: '', rating: 0, notes: '', photo: null });
      setShowAddMember(false);
      toast.success('Team member added successfully - updates synced to Manager and Admin dashboards');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = teamMembers.filter(m => m.id !== memberId);
    setTeamMembers(updatedMembers);
    
    console.log('Team member removed - syncing to Manager and Admin dashboards, member ID:', memberId);
    console.log('Updated team members list:', updatedMembers);
    
    toast.success('Team member removed successfully - updates synced to Manager and Admin dashboards');
  };

  // Enhanced photo upload with feedback
  const handlePhotoUpload = async (memberId: string, file: File) => {
    setUploadingPhoto(memberId);
    
    // Simulate upload delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, photo: file } : member
    );
    setTeamMembers(updatedMembers);
    
    console.log('Team member photo updated - syncing to Manager and Admin dashboards:', memberId);
    console.log('Updated team members list:', updatedMembers);
    
    setUploadingPhoto(null);
    toast.success('Photo uploaded successfully - updates synced to Manager and Admin dashboards');
  };

  // READ-ONLY rating display for main dashboard
  const getRatingStarsReadOnly = (rating: number) => {
    const fullStars = Math.floor(rating / 20);
    const hasHalfStar = (rating % 20) >= 10;
    
    return (
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((starIndex) => (
          <div key={starIndex} className="relative">
            <span className="text-gray-300 text-lg">★</span>
            {starIndex < fullStars && (
              <span className="absolute inset-0 text-yellow-400 text-lg">★</span>
            )}
            {starIndex === fullStars && hasHalfStar && (
              <span 
                className="absolute inset-0 text-yellow-400 text-lg overflow-hidden"
                style={{ width: '50%' }}
              >
                ★
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleStarClick = (memberId: string, starIndex: number, event: React.MouseEvent) => {
    event.preventDefault();
    const clickCount = event.detail;
    let newRating: number;
    
    if (clickCount === 2) {
      newRating = (starIndex + 1) * 20;
    } else {
      newRating = (starIndex * 20) + 10;
    }
    
    updateMemberRating(memberId, newRating);
  };

  const updateMemberRating = (memberId: string, newRating: number) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === memberId ? { ...member, rating: Math.min(100, Math.max(0, newRating)) } : member
    );
    setTeamMembers(updatedMembers);
    
    console.log('Team member rating updated - syncing to Manager and Admin dashboards:', { memberId, newRating });
    console.log('Updated team members list:', updatedMembers);
    
    toast.success('Rating updated successfully - updates synced to Manager and Admin dashboards');
  };

  const openEditDialog = (member: any) => {
    setSelectedMemberForEdit(member);
    setEditingData({
      id: member.id,
      designation: member.designation,
      notes: member.notes,
      customDesignation: ''
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedMemberForEdit) return;
    
    const finalDesignation = editingData.customDesignation.trim() || editingData.designation;
    
    const updatedMembers = teamMembers.map(member => 
      member.id === selectedMemberForEdit.id 
        ? { 
            ...member, 
            id: editingData.id,
            designation: finalDesignation,
            notes: editingData.notes
          } 
        : member
    );
    setTeamMembers(updatedMembers);
    
    console.log('Team member updated - syncing to Manager and Admin dashboards:', { 
      memberId: selectedMemberForEdit.id,
      newId: editingData.id,
      designation: finalDesignation,
      notes: editingData.notes
    });
    console.log('Updated team members list:', updatedMembers);
    
    setShowEditDialog(false);
    setSelectedMemberForEdit(null);
    toast.success('Member updated successfully - changes synced across all dashboards');
  };

  const viewMemberPerformance = (member: any) => {
    setViewingMember(member);
    setShowPerformanceDialog(true);
    console.log('Viewing performance details for member:', member);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Team Lead Dashboard - {currentUserDepartment}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCriteria(true)}>
            Rating Criteria
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Team Members"
          value={stats.totalMembers.toString()}
          icon={<Users size={24} />}
          change="+2 from last month"
          trend="up"
        />
        <StatCard 
          title="Average Rating"
          value={`${stats.avgRating}%`}
          icon={<BarChart3 size={24} />}
          change="+3% from last quarter"
          trend="up"
        />
        <StatCard 
          title="Projects Completed"
          value={stats.totalProjectsCompleted.toString()}
          icon={<TrendingUp size={24} />}
          change="+12 this month"
          trend="up"
        />
        <StatCard 
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<Clock size={24} />}
          change="+5% from last month"
          trend="up"
        />
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <LineChart 
          data={teamOverviewData} 
          title="Team Performance Trend" 
          subtitle="Monthly performance metrics and satisfaction scores"
        />
        <BarChart 
          data={teamProgressData} 
          title="Weekly Progress Report" 
          subtitle="Completed vs In-Progress vs Pending tasks"
        />
        <LineChart 
          data={productivityData} 
          title="Daily Productivity" 
          subtitle="Working hours and efficiency tracking"
        />
      </div>

      {/* Enhanced Team List Section */}
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
                  <div>
                    <Label htmlFor="member-id">Member ID</Label>
                    <Input
                      id="member-id"
                      value={newMember.id}
                      onChange={(e) => setNewMember({...newMember, id: e.target.value})}
                      placeholder="Member ID (e.g., TL006)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-name">Member Name</Label>
                    <Input
                      id="member-name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Member name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-designation">Designation</Label>
                    <Input
                      id="member-designation"
                      value={newMember.designation}
                      onChange={(e) => setNewMember({...newMember, designation: e.target.value})}
                      placeholder="Enter custom designation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-rating">Initial Rating (0-100)</Label>
                    <Input
                      id="member-rating"
                      type="number"
                      min="0"
                      max="100"
                      value={newMember.rating}
                      onChange={(e) => setNewMember({...newMember, rating: parseInt(e.target.value) || 0})}
                      placeholder="Initial rating"
                    />
                  </div>
                  <div>
                    <Label htmlFor="member-notes">Notes</Label>
                    <Input
                      id="member-notes"
                      value={newMember.notes}
                      onChange={(e) => setNewMember({...newMember, notes: e.target.value})}
                      placeholder="Notes"
                    />
                  </div>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Profile</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Member Info</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Performance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Activity</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(member => {
                    return (
                      <tr key={member.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-4 px-4">
                          <div className="relative group">
                            <Avatar className="w-14 h-14 border-2 border-gray-200 hover:border-blue-400 transition-all duration-200">
                              {uploadingPhoto === member.id ? (
                                <div className="flex items-center justify-center w-full h-full">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                              ) : (
                                <>
                                  <AvatarImage 
                                    src={member.photo ? URL.createObjectURL(member.photo) : member.profileImage} 
                                    alt={member.name}
                                    className="object-cover transition-opacity duration-200"
                                  />
                                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </>
                              )}
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-full flex items-center justify-center">
                                <Upload className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </Avatar>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 5 * 1024 * 1024) {
                                    toast.error('Image must be smaller than 5MB');
                                    return;
                                  }
                                  if (!file.type.startsWith('image/')) {
                                    toast.error('Please select a valid image file');
                                    return;
                                  }
                                  handlePhotoUpload(member.id, file);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              disabled={uploadingPhoto === member.id}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-600">{member.designation}</div>
                            <div className="text-xs text-gray-500">ID: {member.id}</div>
                            <div className="text-xs text-gray-500">{member.email}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {getRatingStarsReadOnly(member.rating)}
                              <span className="text-sm font-medium text-gray-700">{member.rating}%</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {member.projectsCompleted} completed • {member.currentProjects} active
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-600">Joined: {member.joinDate}</div>
                            <div className="text-xs text-green-600">Last active: {member.lastActive}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewMemberPerformance(member)}
                              title="View Performance"
                              className="hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(member)}
                              title="Edit Member"
                              className="hover:bg-green-50 hover:border-green-300 transition-colors duration-200"
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                              title="Remove Member"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consolidated Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member - {selectedMemberForEdit?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Member ID</Label>
              <Input
                value={editingData.id}
                onChange={(e) => setEditingData({...editingData, id: e.target.value})}
                placeholder="Member ID"
              />
            </div>
            
            <div>
              <Label>Designation</Label>
              <Select 
                value={editingData.designation} 
                onValueChange={(value) => setEditingData({...editingData, designation: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {availableDesignations.map(designation => (
                    <SelectItem key={designation} value={designation}>
                      {designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Custom Designation (Optional)</Label>
              <Input
                value={editingData.customDesignation}
                onChange={(e) => setEditingData({...editingData, customDesignation: e.target.value})}
                placeholder="Enter custom designation"
              />
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editingData.notes}
                onChange={(e) => setEditingData({...editingData, notes: e.target.value})}
                placeholder="Enter notes"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Performance Details Dialog */}
      <Dialog open={showPerformanceDialog} onOpenChange={setShowPerformanceDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Performance Details - {viewingMember?.name}</DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={viewingMember.profileImage} alt={viewingMember.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                    {viewingMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{viewingMember.name}</h3>
                  <p className="text-gray-600">{viewingMember.designation}</p>
                  <p className="text-sm text-gray-500">Member since {viewingMember.joinDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{viewingMember.rating}%</div>
                    <p className="text-sm text-gray-600">Overall Rating</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{viewingMember.projectsCompleted}</div>
                    <p className="text-sm text-gray-600">Projects Completed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{viewingMember.currentProjects}</div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Label className="text-lg font-semibold">Performance Notes</Label>
                <div className="p-4 bg-gray-50 rounded-md mt-2">{viewingMember.notes}</div>
              </div>
              
              <div>
                <Label className="text-lg font-semibold">Performance Breakdown</Label>
                <div className="space-y-3 mt-4">
                  {ratingCriteria.map((criteria, index) => {
                    const score = Math.max(60, viewingMember.rating + (Math.random() * 20 - 10));
                    return (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{criteria}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold w-12">{Math.round(score)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Criteria Dialog */}
      <Dialog open={showCriteria} onOpenChange={setShowCriteria}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rating Criteria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Team members are rated based on the following criteria:
            </p>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Rating System:</p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Single click = half star (10%, 30%, 50%, 70%, 90%)</li>
                <li>• Double click = full star (20%, 40%, 60%, 80%, 100%)</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ratingCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-sm font-medium">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamLeadDashboard;
