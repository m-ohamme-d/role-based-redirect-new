
import { useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DropdownDateFilter from '@/components/charts/DropdownDateFilter';
import { useTeamData } from '@/hooks/useTeamData';
import TeamPerformanceRating from '@/components/TeamPerformanceRating';

const criteriaLabels = {
  productivity: 'Productivity',
  collaboration: 'Collaboration',
  timeliness: 'Timeliness',
  overall: 'Overall Performance'
};

const TeamLeadTeamDepartment = () => {
  const { deptId } = useParams<{deptId: string}>();
  const [timePeriod, setTimePeriod] = useState('month');
  const memberOrderRef = useRef<string[]>([]);

  const { 
    department, 
    teamMembers, 
    loading, 
    error, 
    updateRating, 
    lockRatings 
  } = useTeamData(deptId);

  // Initialize and maintain stable member order
  const displayMembers = useMemo(() => {
    // Initialize order on first load or when team members change significantly
    if (memberOrderRef.current.length === 0 || teamMembers.length !== memberOrderRef.current.length) {
      memberOrderRef.current = teamMembers.map(member => member.id);
      return teamMembers;
    }
    
    // Sort members based on the stable order
    const sortedMembers = [...teamMembers].sort((a, b) => {
      const indexA = memberOrderRef.current.indexOf(a.id);
      const indexB = memberOrderRef.current.indexOf(b.id);
      
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return a.id.localeCompare(b.id);
    });
    
    return sortedMembers;
  }, [teamMembers]);

  const handleRatingChange = async (memberId: string, criterion: string, rating: number) => {
    const success = await updateRating(memberId, criterion, rating);
    if (!success) {
      toast.error('Failed to update rating');
    }
  };

  const handleSaveRatings = async (memberId: string) => {
    await lockRatings(memberId);
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading team data...</p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {error || 'Department not found'}
        </h2>
        <Link to="/teamlead/team">
          <Button className="mt-4">Return to Teams</Button>
        </Link>
      </div>
    );
  }

  const averageRating = displayMembers.length > 0 
    ? Math.round(displayMembers.reduce((acc, member) => acc + member.ratings.overall, 0) / displayMembers.length)
    : 0;

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
            <p className="text-gray-600">Team Lead Dashboard</p>
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

      <TeamPerformanceRating
        members={displayMembers.map(member => ({
          id: member.id,
          name: member.name,
          position: member.designation,
          department: department.name,
          ratings: member.ratings
        }))}
        onRatingUpdate={handleRatingChange}
      />
    </div>
  );
};

export default TeamLeadTeamDepartment;
