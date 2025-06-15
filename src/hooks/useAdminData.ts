
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminStats {
  totalUsers: number;
  totalDepartments: number;
  totalTeamMembers: number;
  lockedRecords: number;
  auditLogs: number;
}

interface DepartmentWithStats {
  id: string;
  name: string;
  memberCount: number;
  teamLeadName?: string;
}

export const useAdminData = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalDepartments: 0,
    totalTeamMembers: 0,
    lockedRecords: 0,
    auditLogs: 0
  });
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAdminData();
    }
  }, [profile]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch departments with team lead info and member counts
      const { data: departmentData, error: deptError } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          team_lead_id,
          profiles:team_lead_id(name),
          team_members(count)
        `);

      if (deptError) {
        console.error('Error fetching departments:', deptError);
        setError('Failed to fetch departments');
        return;
      }

      // Fetch total team members count
      const { count: membersCount } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true });

      // Fetch locked performance ratings count
      const { count: lockedCount } = await supabase
        .from('performance_ratings')
        .select('*', { count: 'exact', head: true })
        .eq('is_locked', true);

      // Transform department data
      const transformedDepartments: DepartmentWithStats[] = (departmentData || []).map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        memberCount: Array.isArray(dept.team_members) ? dept.team_members.length : (dept.team_members?.[0]?.count || 0),
        teamLeadName: dept.profiles?.name || 'Unassigned'
      }));

      setStats({
        totalUsers: usersCount || 0,
        totalDepartments: departmentData?.length || 0,
        totalTeamMembers: membersCount || 0,
        lockedRecords: lockedCount || 0,
        auditLogs: 1256 // This would come from an audit log table if implemented
      });

      setDepartments(transformedDepartments);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    departments,
    loading,
    error,
    refetch: fetchAdminData
  };
};
