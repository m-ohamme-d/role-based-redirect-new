
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

      // Fetch departments - simplified query without foreign key hint
      const { data: departmentData, error: deptError } = await (supabase as any)
        .from('departments')
        .select('id, name, team_lead_id');

      if (deptError) {
        console.error('Error fetching departments:', deptError);
        setError('Failed to fetch departments');
        return;
      }

      // Fetch total team members count
      const { count: membersCount } = await (supabase as any)
        .from('team_members')
        .select('*', { count: 'exact', head: true });

      // Fetch locked performance ratings count
      const { count: lockedCount } = await (supabase as any)
        .from('performance_ratings')
        .select('*', { count: 'exact', head: true })
        .eq('is_locked', true);

      // Get member counts and team lead names for each department
      const departmentsWithCounts = await Promise.all(
        (departmentData || []).map(async (dept: any) => {
          // Get member count for this department
          const { count: memberCount } = await (supabase as any)
            .from('team_members')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', dept.id);

          // Get team lead name if there is one
          let teamLeadName = 'Unassigned';
          if (dept.team_lead_id) {
            const { data: teamLead } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', dept.team_lead_id)
              .single();
            
            if (teamLead) {
              teamLeadName = teamLead.name || 'Unknown';
            }
          }

          return {
            id: dept.id,
            name: dept.name,
            memberCount: memberCount || 0,
            teamLeadName
          };
        })
      );

      setStats({
        totalUsers: usersCount || 0,
        totalDepartments: departmentData?.length || 0,
        totalTeamMembers: membersCount || 0,
        lockedRecords: lockedCount || 0,
        auditLogs: 1256 // This would come from an audit log table if implemented
      });

      setDepartments(departmentsWithCounts);
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
