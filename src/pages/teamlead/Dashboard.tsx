// src/pages/team-lead/Dashboard.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart3, Plus, Edit2, Trash2, User, Eye, Upload, Camera } from "lucide-react";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

// Mock designations data - this would come from central admin/manager control
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

interface Member {
  id: string;
  name: string;
  designation: string;
  rating: number;
  notes: string;
  photo: File | null;
  department: string;
  originalOrder: number;
}

const TeamLeadDashboard = () => {
  // State
  const [teamMembers, setTeamMembers] = useState<Member[]>([
    { id: 'TL001', name: 'John Smith', designation: 'Developer', rating: 85, notes: 'Excellent performance', photo: null, department: 'IT', originalOrder: 1 },
    { id: 'TL002', name: 'Sarah Johnson', designation: 'Designer', rating: 92, notes: 'Consistent high quality work', photo: null, department: 'IT', originalOrder: 2 },
    { id: 'TL003', name: 'Michael Brown', designation: 'QA Tester', rating: 78, notes: 'Good attention to detail', photo: null, department: 'IT', originalOrder: 3 },
    { id: 'TL004', name: 'Emily Davis', designation: 'Developer', rating: 88, notes: 'Fast learner', photo: null, department: 'IT', originalOrder: 4 },
    { id: 'TL005', name: 'Robert Wilson', designation: 'Developer', rating: 75, notes: 'Needs mentoring', photo: null, department: 'IT', originalOrder: 5 },
  ]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    id: '',
    name: '',
    designation: '',
    rating: 0,
    notes: '',
    photo: null
  });
  const [showCriteria, setShowCriteria] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [showPerformanceDialog, setShowPerformanceDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<Member | null>(null);
  const [editingData, setEditingData] = useState<Partial<Member & { customDesignation?: string }>>({
    id: '',
    designation: '',
    notes: '',
    customDesignation: ''
  });
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);

  const currentUserDepartment = 'IT';
  const filteredMembers = teamMembers
    .filter(member => member.department === currentUserDepartment)
    .sort((a, b) => a.originalOrder - b.originalOrder);

  // ————————————————————————————————————
  // PDF Export
  // ————————————————————————————————————
  const exportToPDF = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export');
      return;
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'l' });
    const cols = ['ID', 'Name', 'Designation', 'Rating', 'Notes'];
    const rows = filteredMembers.map(m => [
      m.id, m.name, m.designation, `${m.rating}%`, m.notes
    ]);

    doc.setFontSize(16);
    doc.text(
      `Team Lead Dashboard – ${currentUserDepartment}`,
      doc.internal.pageSize.getWidth() / 2,
      40,
      { align: 'center' }
    );

    autoTable(doc, {
      head: [cols],
      body: rows,
      startY: 60,
      theme: 'grid',
      headStyles: { fillColor: [30, 144, 255], textColor: 255 },
      margin: { left: 40, right: 40 }
    });

    doc.save('teamlead_dashboard.pdf');
    toast.success('PDF downloaded');
  };

  // ————————————————————————————————————
  // Handlers (unchanged from old code)
  // ————————————————————————————————————
  const handleAddMember = () => {
    if (newMember.name?.trim() && newMember.designation?.trim() && newMember.id?.trim()) {
      const nextOrder = Math.max(...teamMembers.map(m => m.originalOrder || 0)) + 1;
      const member: Member = {
        id: newMember.id.trim(),
        name: newMember.name.trim(),
        designation: newMember.designation.trim(),
        rating: newMember.rating || 0,
        notes: newMember.notes || '',
        photo: newMember.photo || null,
        department: currentUserDepartment,
        originalOrder: nextOrder
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ id: '', name: '', designation: '', rating: 0, notes: '', photo: null });
      setShowAddMember(false);
      toast.success('Team member added successfully - updates synced to Manager and Admin dashboards');
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    toast.success('Team member removed successfully - updates synced to Manager and Admin dashboards');
  };

  const handlePhotoUpload = async (memberId: string, file: File) => {
    setUploadingPhoto(memberId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTeamMembers(teamMembers.map(m =>
      m.id === memberId ? { ...m, photo: file } : m
    ));
    setUploadingPhoto(null);
    toast.success('Photo uploaded successfully - updates synced to Manager and Admin dashboards');
  };

  const getRatingStarsReadOnly = (rating: number) => {
    const fullStars = Math.floor(rating / 20);
    const hasHalfStar = (rating % 20) >= 10;
    return (
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="relative text-lg">
            <span className="text-gray-300">★</span>
            {i < fullStars && <span className="absolute inset-0 text-yellow-400">★</span>}
            {i === fullStars && hasHalfStar && (
              <span className="absolute inset-0 text-yellow-400 overflow-hidden" style={{ width: '50%' }}>
                ★
              </span>
            )}
          </div>
        ))}
        <span className="text-sm text-gray-600">{rating}%</span>
      </div>
    );
  };

  const openEditDialog = (member: Member) => {
    setSelectedMemberForEdit(member);
    setEditingData({ ...member, customDesignation: '' });
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!selectedMemberForEdit) return;
    const finalDesignation = editingData.customDesignation?.trim() || editingData.designation!;
    setTeamMembers(teamMembers.map(m =>
      m.id === selectedMemberForEdit.id
        ? { ...m, id: editingData.id!, designation: finalDesignation, notes: editingData.notes! }
        : m
    ));
    setShowEditDialog(false);
    setSelectedMemberForEdit(null);
    toast.success('Member updated successfully - changes synced across all dashboards');
  };

  const viewMemberPerformance = (member: Member) => {
    setViewingMember(member);
    setShowPerformanceDialog(true);
    console.log('Viewing performance details for member:', member);
  };

  // ————————————————————————————————————
  // Render
  // ————————————————————————————————————
  return (
    <div className="space-y-6">
      {/* Header with PDF export */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Team Lead Dashboard - {currentUserDepartment}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCriteria(true)}>
            Rating Criteria
          </Button>
          <Button variant="ghost" onClick={exportToPDF}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
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
          value={`${Math.round(filteredMembers.reduce((acc, m) => acc + m.rating, 0) / filteredMembers.length) || 0}%`}
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

      {/* Charts */}
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

      {/* Team List */}
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
                    value={newMember.id || ''}
                    onChange={(e) => setNewMember({ ...newMember, id: e.target.value })}
                    placeholder="Member ID (e.g., TL006)"
                  />
                </div>
                <div>
                  <Label htmlFor="member-name">Member Name</Label>
                  <Input
                    id="member-name"
                    value={newMember.name || ''}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Member name"
                  />
                </div>
                <div>
                  <Label htmlFor="member-designation">Designation</Label>
                  <Input
                    id="member-designation"
                    value={newMember.designation || ''}
                    onChange={(e) => setNewMember({ ...newMember, designation: e.target.value })}
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
                    value={newMember.rating || 0}
                    onChange={(e) => setNewMember({ ...newMember, rating: parseInt(e.target.value) || 0 })}
                    placeholder="Initial rating"
                  />
                </div>
                <div>
                  <Label htmlFor="member-notes">Notes</Label>
                  <Input
                    id="member-notes"
                    value={newMember.notes || ''}
                    onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
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
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                          {uploadingPhoto === member.id ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          ) : member.photo ? (
                            <img
                              src={URL.createObjectURL(member.photo)}
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <Upload className="h-5 w-5 text-gray-400" />
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploadingPhoto === member.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(member.id, file);
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{member.id}</td>
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4">{member.designation}</td>
                    <td className="py-3 px-4">{getRatingStarsReadOnly(member.rating)}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm truncate max-w-[150px] block">{member.notes}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewMemberPerformance(member)}
                          title="View Performance"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(member)}
                          title="Edit Member"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Remove Member"
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
                onChange={(e) => setEditingData({ ...editingData, id: e.target.value })}
                placeholder="Member ID"
              />
            </div>  
            <div>
              <Label>Designation</Label>
              <Select
                value={editingData.designation}
                onValueChange={(value) => setEditingData({ ...editingData, designation: value })}
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
                onChange={(e) => setEditingData({ ...editingData, customDesignation: e.target.value })}
                placeholder="Enter custom designation"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editingData.notes}
                onChange={(e) => setEditingData({ ...editingData, notes: e.target.value })}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Performance Details - {viewingMember?.name}</DialogTitle>
          </DialogHeader>
          {viewingMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Overall Rating</Label>
                  <div className="text-2xl font-bold text-blue-600">{viewingMember.rating}%</div>
                </div>
                <div>
                  <Label>Designation</Label>
                  <div className="text-lg">{viewingMember.designation}</div>
                </div>
              </div>
              <div>
                <Label>Performance Notes</Label>
                <div className="p-3 bg-gray-50 rounded-md">{viewingMember.notes}</div>
              </div>
              <div>
                <Label>Rating Breakdown</Label>
                <div className="space-y-2 mt-2">
                  {ratingCriteria.map((criteria, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{criteria}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.max(60, viewingMember.rating + (Math.random() * 20 - 10))}%` }}
                          ></div>
                        </div>
                        <span className="text-xs w-8">{Math.round(Math.max(60, viewingMember.rating + (Math.random() * 20 - 10)))}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Criteria Dialog */}
      <Dialog open={showCriteria} onOpenChange={() => setShowCriteria(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rating Criteria</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Team members are rated based on the following criteria:
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Rating System: Single click = half star (10%, 30%, 50%, 70%, 90%), Double click = full star (20%, 40%, 60%, 80%, 100%)
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
