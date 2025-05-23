
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

// Mock department data
const departmentsData = {
  1: { id: 1, name: 'IT', teamLead: 'You' },
  2: { id: 2, name: 'Marketing', teamLead: 'You' },
  3: { id: 3, name: 'Sales', teamLead: 'You' },
};

// Mock team members by department
const teamMembersByDepartment = {
  1: [
    { id: 101, name: 'John Smith', designation: 'Senior Developer', rating: 95, notes: 'Excellent problem solver' },
    { id: 102, name: 'Emily Wilson', designation: 'UX Designer', rating: 88, notes: 'Creative and detail-oriented' },
    { id: 103, name: 'Michael Brown', designation: 'Backend Developer', rating: 92, notes: 'Strong database skills' },
    { id: 104, name: 'Sarah Johnson', designation: 'Frontend Developer', rating: 90, notes: 'Great with UI components' },
  ],
  2: [
    { id: 201, name: 'Karen White', designation: 'Marketing Manager', rating: 94, notes: 'Excellent campaign strategy' },
    { id: 202, name: 'Daniel Brown', designation: 'Digital Marketing Specialist', rating: 86, notes: 'Good with social media' },
    { id: 203, name: 'Laura Green', designation: 'Content Writer', rating: 89, notes: 'Creative content creator' },
  ],
  3: [
    { id: 301, name: 'Robert Wilson', designation: 'Sales Manager', rating: 93, notes: 'Exceeds targets consistently' },
    { id: 302, name: 'Jennifer Smith', designation: 'Sales Representative', rating: 87, notes: 'Building strong client relationships' },
    { id: 303, name: 'Thomas Miller', designation: 'Account Executive', rating: 91, notes: 'Great at closing deals' },
    { id: 304, name: 'Amanda Jones', designation: 'Sales Associate', rating: 82, notes: 'Improving steadily' },
  ],
};

// Time period options
const timePeriods = [
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

const TeamLeadTeamDepartment = () => {
  const { deptId } = useParams<{deptId: string}>();
  const [department, setDepartment] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState('month');
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: '',
    designation: '',
    rating: 0,
    notes: '',
  });

  useEffect(() => {
    // In a real app, this would be an API call
    if (deptId && departmentsData[Number(deptId)]) {
      setDepartment(departmentsData[Number(deptId)]);
      setTeamMembers(teamMembersByDepartment[Number(deptId)] || []);
    }
  }, [deptId]);

  const handleEdit = (member: any) => {
    setEditingMember(member.id);
    setEditData({
      name: member.name,
      designation: member.designation,
      rating: member.rating,
      notes: member.notes,
    });
  };

  const handleSave = (id: number) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === id) {
        return { ...member, ...editData };
      }
      return member;
    }));
    setEditingMember(null);
  };

  const handleCancel = () => {
    setEditingMember(null);
  };

  const handleChange = (field: string, value: string | number) => {
    setEditData({ ...editData, [field]: value });
  };

  if (!department) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Department not found</h2>
        <Link to="/teamlead/team">
          <Button className="mt-4">Return to Teams</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/teamlead/team" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{department.name} Department</h1>
            <p className="text-gray-600">Team Lead: {department.teamLead}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="min-w-[150px]">
                <SelectValue placeholder="Select Time Period" />
              </SelectTrigger>
              <SelectContent>
                {timePeriods.map(period => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Team Members</h3>
            <div className="text-3xl font-bold mt-2">
              {teamMembers.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Average Rating</h3>
            <div className="text-3xl font-bold mt-2">
              {Math.round(teamMembers.reduce((acc, member) => acc + member.rating, 0) / teamMembers.length)}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Top Performer</h3>
            <div className="text-xl font-bold mt-2">
              {teamMembers.sort((a, b) => b.rating - a.rating)[0]?.name || 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Designation</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Notes</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map(member => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <Input 
                          value={editData.name} 
                          onChange={(e) => handleChange('name', e.target.value)}
                          className="max-w-[200px]"
                        />
                      ) : (
                        member.name
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <Input 
                          value={editData.designation} 
                          onChange={(e) => handleChange('designation', e.target.value)}
                          className="max-w-[200px]"
                        />
                      ) : (
                        member.designation
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <Input 
                          type="number"
                          min="0"
                          max="100"
                          value={editData.rating} 
                          onChange={(e) => handleChange('rating', parseInt(e.target.value) || 0)}
                          className="max-w-[80px]"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${member.rating}%` }}
                            ></div>
                          </div>
                          <span>{member.rating}%</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <Input 
                          value={editData.notes} 
                          onChange={(e) => handleChange('notes', e.target.value)}
                          className="max-w-[200px]"
                        />
                      ) : (
                        member.notes
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingMember === member.id ? (
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleSave(member.id)}
                          >
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(member)}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamLeadTeamDepartment;
