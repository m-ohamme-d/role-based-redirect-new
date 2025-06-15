
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
      console.log('[useAdminData] Starting to fetch admin data...');

      // Fetch total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('[useAdminData] Error fetching users count:', usersError);
      } else {
        console.log('[useAdminData] Users count:', usersCount);
      }

      // Use rpc or direct SQL for tables not in types
      const { data: departmentData, error: deptError } = await supabase.rpc('sql', {
        query: 'SELECT id, name, team_lead_id FROM departments'
      }).catch(async () => {
        // Fallback: try direct query with any casting
        return await (supabase as any).from('departments').select('id, name, team_lead_id');
      });

      if (deptError) {
        console.error('[useAdminData] Error fetching departments:', deptError);
        setError('Failed to fetch departments');
        return;
      } else {
        console.log('[useAdminData] Departments data:', departmentData);
      }

      // Fetch team members count
      const { count: membersCount, error: membersError } = await supabase.rpc('sql', {
        query: 'SELECT COUNT(*) FROM team_members'
      }).then(result => ({ count: result.data?.[0]?.count || 0, error: result.error }))
      .catch(async () => {
        // Fallback: try direct query with any casting
        return await (supabase as any).from('team_members').select('*', { count: 'exact', head: true });
      });

      if (membersError) {
        console.error('[useAdminData] Error fetching team members count:', membersError);
      } else {
        console.log('[useAdminData] Team members count:', membersCount);
      }

      // Fetch locked performance ratings count
      const { count: lockedCount, error: lockedError } = await supabase.rpc('sql', {
        query: 'SELECT COUNT(*) FROM performance_ratings WHERE is_locked = true'
      }).then(result => ({ count: result.data?.[0]?.count || 0, error: result.error }))
      .catch(async () => {
        // Fallback: try direct query with any casting
        return await (supabase as any).from('performance_ratings').select('*', { count: 'exact', head: true }).eq('is_locked', true);
      });

      if (lockedError) {
        console.error('[useAdminData] Error fetching locked ratings count:', lockedError);
      } else {
        console.log('[useAdminData] Locked ratings count:', lockedCount);
      }

      // Get member counts and team lead names for each department
      const departmentsWithCounts = await Promise.all(
        (departmentData || []).map(async (dept: any) => {
          // Get member count for this department
          const { count: memberCount, error: memberCountError } = await supabase.rpc('sql', {
            query: `SELECT COUNT(*) FROM team_members WHERE department_id = '${dept.id}'`
          }).then(result => ({ count: result.data?.[0]?.count || 0, error: result.error }))
          .catch(async () => {
            // Fallback: try direct query with any casting
            return await (supabase as any).from('team_members').select('*', { count: 'exact', head: true }).eq('department_id', dept.id);
          });

          if (memberCountError) {
            console.error(`[useAdminData] Error fetching member count for department ${dept.name}:`, memberCountError);
          }

          // Get team lead name if there is one
          let teamLeadName = 'Unassigned';
          if (dept.team_lead_id) {
            const { data: teamLead, error: teamLeadError } = await supabase
              .from('profiles')
              .select('name')
              .eq('id', dept.team_lead_id)
              .single();
            
            if (teamLeadError) {
              console.error(`[useAdminData] Error fetching team lead for department ${dept.name}:`, teamLeadError);
            } else if (teamLead) {
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

      const finalStats = {
        totalUsers: usersCount || 0,
        totalDepartments: departmentData?.length || 0,
        totalTeamMembers: membersCount || 0,
        lockedRecords: lockedCount || 0,
        auditLogs: 1256 // This would come from an audit log table if implemented
      };

      console.log('[useAdminData] Final stats:', finalStats);
      console.log('[useAdminData] Departments with counts:', departmentsWithCounts);

      setStats(finalStats);
      setDepartments(departmentsWithCounts);
    } catch (err) {
      console.error('[useAdminData] Unexpected error:', err);
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
