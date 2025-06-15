
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

      // Fetch total users count from profiles table (this exists)
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('[useAdminData] Error fetching users count:', usersError);
        setError('Failed to fetch users data');
        return;
      } else {
        console.log('[useAdminData] Users count:', usersCount);
      }

      // Mock data for departments until the tables are created in Supabase
      const mockDepartments: DepartmentWithStats[] = [
        {
          id: '1',
          name: 'Engineering',
          memberCount: 15,
          teamLeadName: 'John Smith'
        },
        {
          id: '2',
          name: 'Marketing',
          memberCount: 8,
          teamLeadName: 'Sarah Johnson'
        },
        {
          id: '3',
          name: 'Sales',
          memberCount: 12,
          teamLeadName: 'Mike Wilson'
        },
        {
          id: '4',
          name: 'HR',
          memberCount: 5,
          teamLeadName: 'Lisa Brown'
        }
      ];

      const mockStats = {
        totalUsers: usersCount || 0,
        totalDepartments: mockDepartments.length,
        totalTeamMembers: mockDepartments.reduce((sum, dept) => sum + dept.memberCount, 0),
        lockedRecords: 23, // Mock data
        auditLogs: 1256 // Mock data
      };

      console.log('[useAdminData] Final stats:', mockStats);
      console.log('[useAdminData] Mock departments:', mockDepartments);

      setStats(mockStats);
      setDepartments(mockDepartments);
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
