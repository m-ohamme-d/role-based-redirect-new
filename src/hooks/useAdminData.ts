
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

      // Fetch total users count from profiles table
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('[useAdminData] Error fetching users count:', usersError);
        setError('Failed to fetch users data');
        return;
      }

      // Fetch departments from the database using generic typing
      const { data: departmentsData, error: departmentsError } = await (supabase as any)
        .from('departments')
        .select('*')
        .order('name');

      if (departmentsError) {
        console.error('[useAdminData] Error fetching departments:', departmentsError);
        setError('Failed to fetch departments data');
        return;
      }

      // Fetch audit logs count using generic typing
      const { count: auditCount, error: auditError } = await (supabase as any)
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

      if (auditError) {
        console.error('[useAdminData] Error fetching audit logs count:', auditError);
      }

      // Transform departments data
      const departmentsWithStats: DepartmentWithStats[] = departmentsData?.map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        memberCount: dept.member_count || 0,
        teamLeadName: dept.team_lead_name || 'Not assigned'
      })) || [];

      const finalStats = {
        totalUsers: usersCount || 0,
        totalDepartments: departmentsData?.length || 0,
        totalTeamMembers: departmentsData?.reduce((sum: number, dept: any) => sum + (dept.member_count || 0), 0) || 0,
        lockedRecords: 23, // Mock data - would need a separate table for locked records
        auditLogs: auditCount || 0
      };

      console.log('[useAdminData] Final stats:', finalStats);
      console.log('[useAdminData] Departments from DB:', departmentsWithStats);

      setStats(finalStats);
      setDepartments(departmentsWithStats);
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
