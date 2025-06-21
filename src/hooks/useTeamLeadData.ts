import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTeamLeadData(departmentId?: string) {
  const sb = supabase as any;
  const [department, setDepartment] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId) return;
    async function fetchData() {
      setLoading(true);
      const { data: deptData, error: deptError } = await sb.from('departments').select('*').eq('id', departmentId).single();
      const { data: membersData, error: membersError } = await sb.from('team_members').select('*').eq('department_id', departmentId);
      if (deptError || membersError) {
        setError('Failed to fetch data');
      } else {
        setDepartment(deptData || null);
        setTeamMembers(membersData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, [departmentId]);

  // Example CRUD
  const updateMember = async (id: string, updates: any) => {
    return sb.from('team_members').update(updates).eq('id', id);
  };
  const lockMemberRatings = async (id: string) => {
    return sb.from('team_members').update({ locked: true }).eq('id', id);
  };

  return { department, teamMembers, loading, error, updateMember, lockMemberRatings };
}
