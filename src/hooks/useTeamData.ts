
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getMockSession } from '@/utils/mockAuth';

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  avatar_url?: string;
  ratings: {
    productivity: number;
    collaboration: number;
    timeliness: number;
    overall: number;
  };
  locked: boolean;
}

interface Department {
  id: string;
  name: string;
  team_lead_id?: string;
}

export const useTeamData = (departmentId?: string) => {
  const { profile } = useAuth();
  const [department, setDepartment] = useState<Department | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (departmentId) {
      fetchDepartmentData();
    }
  }, [departmentId, profile]);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch department info
      const { data: deptData, error: deptError } = await (supabase as any)
        .from('departments')
        .select('*')
        .eq('id', departmentId)
        .single();

      if (deptError) {
        console.error('Error fetching department:', deptError);
        setError('Failed to fetch department data');
        return;
      }

      setDepartment(deptData);

      // Fetch team members first
      const { data: membersData, error: membersError } = await (supabase as any)
        .from('team_members')
        .select('*')
        .eq('department_id', departmentId);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        setError('Failed to fetch team members');
        return;
      }

      // Then fetch their ratings separately to avoid complex joins
      const memberIds = membersData?.map((m: any) => m.id) || [];
      let ratingsData: any[] = [];
      
      if (memberIds.length > 0) {
        const { data: ratings, error: ratingsError } = await (supabase as any)
          .from('performance_ratings')
          .select('*')
          .in('member_id', memberIds);

        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
        } else {
          ratingsData = ratings || [];
        }
      }

      // Transform the data to match the expected format
      const transformedMembers: TeamMember[] = (membersData || []).map((member: any) => {
        const memberRating = ratingsData.find(r => r.member_id === member.id);
        
        return {
          id: member.id,
          name: member.name,
          designation: member.designation,
          avatar_url: member.avatar_url,
          ratings: {
            productivity: memberRating?.productivity || 0,
            collaboration: memberRating?.collaboration || 0,
            timeliness: memberRating?.timeliness || 0,
            overall: memberRating?.overall || 0,
          },
          locked: memberRating?.is_locked || false
        };
      });

      setTeamMembers(transformedMembers);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateRating = async (memberId: string, criterion: string, rating: number) => {
    try {
      // Calculate overall rating
      const member = teamMembers.find(m => m.id === memberId);
      if (!member || member.locked) return false;

      const newRatings = { ...member.ratings, [criterion]: rating };
      const overall = Math.round((newRatings.productivity + newRatings.collaboration + newRatings.timeliness) / 3);
      
      const { error } = await (supabase as any)
        .from('performance_ratings')
        .upsert({
          member_id: memberId,
          [criterion]: rating,
          overall: overall,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating rating:', error);
        toast.error('Failed to update rating');
        return false;
      }

      // Update local state
      setTeamMembers(prev => prev.map(m => 
        m.id === memberId 
          ? { ...m, ratings: { ...newRatings, overall } }
          : m
      ));

      return true;
    } catch (err) {
      console.error('Error updating rating:', err);
      toast.error('Failed to update rating');
      return false;
    }
  };

  const lockRatings = async (memberId: string) => {
    try {
      const currentProfile = profile || getMockSession();
      
      const { error } = await (supabase as any)
        .from('performance_ratings')
        .update({
          is_locked: true,
          rated_by_id: currentProfile?.id,
          updated_at: new Date().toISOString()
        })
        .eq('member_id', memberId);

      if (error) {
        console.error('Error locking ratings:', error);
        toast.error('Failed to lock ratings');
        return false;
      }

      // Update local state
      setTeamMembers(prev => prev.map(m => 
        m.id === memberId ? { ...m, locked: true } : m
      ));

      toast.success('Ratings saved and locked successfully');
      return true;
    } catch (err) {
      console.error('Error locking ratings:', err);
      toast.error('Failed to lock ratings');
      return false;
    }
  };

  return {
    department,
    teamMembers,
    loading,
    error,
    updateRating,
    lockRatings,
    refetch: fetchDepartmentData
  };
};
