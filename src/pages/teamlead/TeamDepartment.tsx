
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Star, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DropdownDateFilter from '@/components/charts/DropdownDateFilter';

// Mock department data - only IT department
const departmentsData = {
  1: { id: 1, name: 'IT', teamLead: 'You' },
};

// Enhanced team members with multiple criteria ratings
const teamMembersByDepartment = {
  1: [
    { 
      id: 101, 
      name: 'John Smith', 
      designation: 'Senior Developer', 
      avatar: null,
      ratings: {
        productivity: 95,
        collaboration: 88,
        timeliness: 92,
        overall: 92
      },
      locked: false
    },
    { 
      id: 102, 
      name: 'Emily Wilson', 
      designation: 'UX Designer', 
      avatar: null,
      ratings: {
        productivity: 90,
        collaboration: 95,
        timeliness: 85,
        overall: 90
      },
      locked: false
    },
    { 
      id: 103, 
      name: 'Michael Brown', 
      designation: 'Backend Developer', 
      avatar: null,
      ratings: {
        productivity: 88,
        collaboration: 90,
        timeliness: 94,
        overall: 91
      },
      locked: true // Example of locked rating
    },
  ],
};

const criteriaLabels = {
  productivity: 'Productivity',
  collaboration: 'Collaboration',
  timeliness: 'Timeliness',
  overall: 'Overall Performance'
};

const timePeriods = [
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

const TeamLeadTeamDepartment = () => {
  const { deptId } = useParams<{deptId: string}>();
  const [department, setDepartment] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [timePeriod, setTimePeriod] = useState('month');
  const [memberOrder, setMemberOrder] = useState<number[]>([]);

  // Initialize member order and maintain stable sorting
  const displayMembers = useMemo(() => {
    if (memberOrder.length === 0) {
      const initialOrder = teamMembers.map(member => member.id);
      setMemberOrder(initialOrder);
      return teamMembers;
    }
    
    // Sort members based on the fixed order, new members go to the end
    const sortedMembers = [...teamMembers].sort((a, b) => {
      const indexA = memberOrder.indexOf(a.id);
      const indexB = memberOrder.indexOf(b.id);
      
      // If both members are in the order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one member is in the order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither is in the order, sort by id for consistency
      return a.id - b.id;
    });
    
    // Update order to include any new members
    const currentIds = teamMembers.map(m => m.id);
    const newOrder = [
      ...memberOrder.filter(id => currentIds.includes(id)),
      ...currentIds.filter(id => !memberOrder.includes(id))
    ];
    
    if (newOrder.length !== memberOrder.length) {
      setMemberOrder(newOrder);
    }
    
    return sortedMembers;
  }, [teamMembers, memberOrder]);

  useEffect(() => {
    if (deptId && departmentsData[Number(deptId)]) {
      setDepartment(departmentsData[Number(deptId)]);
      setTeamMembers(teamMembersByDepartment[Number(deptId)] || []);
    }
  }, [deptId]);

  const handleRatingChange = (memberId: number, criterion: string, rating: number) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === memberId && !member.locked) {
        const newRatings = { ...member.ratings, [criterion]: rating };
        const overall = Math.round((newRatings.productivity + newRatings.collaboration + newRatings.timeliness) / 3);
        return { 
          ...member, 
          ratings: { ...newRatings, overall }
        };
      }
      return member;
    }));
  };

  const handleSaveRatings = (memberId: number) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, locked: true } : member
    ));
    toast.success('Ratings saved and locked successfully');
  };

  const handleDateFilterChange = (period: string, customRange?: { start: Date; end: Date }) => {
    setTimePeriod(period);
    console.log(`Team overview filtered by ${period}:`, customRange || period);
    
    if (customRange) {
      toast.success(`Team overview filtered by custom range: ${customRange.start.toLocaleDateString()} to ${customRange.end.toLocaleDateString()}`);
    } else {
      const periodLabels = {
        month: 'This Month',
        quarter: 'This Quarter', 
        year: 'This Year'
      };
      toast.success(`Team overview filtered by ${periodLabels[period as keyof typeof periodLabels]}`);
    }
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

  const averageRating = Math.round(
    displayMembers.reduce((acc, member) => acc + member.ratings.overall, 0) / displayMembers.length
  );

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
          <DropdownDateFilter 
            onFilterChange={handleDateFilterChange}
            currentFilter={timePeriod}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Team Members</h3>
            <div className="text-3xl font-bold mt-2">
              {displayMembers.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Average Rating</h3>
            <div className="text-3xl font-bold mt-2">
              {averageRating}%
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold">Top Performer</h3>
            <div className="text-xl font-bold mt-2">
              {displayMembers.sort((a, b) => b.ratings.overall - a.ratings.overall)[0]?.name || 'None'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Performance Ratings</CardTitle>
          <p className="text-sm text-gray-600">
            Rate team members across multiple criteria. Once saved, ratings are locked and can only be edited by administrators.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {displayMembers.map(member => (
              <Card key={member.id} className={member.locked ? 'bg-gray-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.designation}</p>
                        <Badge variant="outline">ID: {member.id}</Badge>
                      </div>
                    </div>
                    {member.locked && (
                      <Badge variant="destructive">Locked</Badge>
                    )}
                    {!member.locked && (
                      <Button 
                        onClick={() => handleSaveRatings(member.id)}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save & Lock
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(criteriaLabels).map(([key, label]) => (
                      <div key={key} className="space-y-2">
                        <label className="text-sm font-medium">{label}</label>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${member.locked ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                                  star <= Math.round(member.ratings[key] / 20) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                                onClick={() => !member.locked && handleRatingChange(member.id, key, star * 20)}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({member.ratings[key]}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamLeadTeamDepartment;
