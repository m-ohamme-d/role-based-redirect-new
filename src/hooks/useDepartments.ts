
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { departmentStore } from '../stores/departmentStore';

interface Department {
  id: string;
  name: string;
  memberCount: number;
}

export const useDepartments = () => {
  const { profile } = useAuth();
  const [departments, setDepartments] = useState<string[]>(departmentStore.getDepartments());
  const [teamLeadDepartments, setTeamLeadDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = departmentStore.subscribe(() => {
      setDepartments(departmentStore.getDepartments());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (profile?.role === 'teamlead') {
      fetchTeamLeadDepartments();
    } else {
      setLoading(false);
    }
  }, [profile]);

  const fetchTeamLeadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use supabase.from() with proper typing
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select(`
          id,
          name,
          team_members(count)
        `)
        .eq('team_lead_id', profile?.id);

      if (deptError) {
        console.error('Error fetching departments:', deptError);
        setError('Failed to fetch departments');
        setLoading(false);
        return;
      }

      const transformedDepts: Department[] = (deptData || []).map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        memberCount: Array.isArray(dept.team_members) ? dept.team_members.length : (dept.team_members?.[0]?.count || 0)
      }));

      setTeamLeadDepartments(transformedDepts);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = (name: string) => {
    return departmentStore.addDepartment(name);
  };

  const updateDepartment = (oldName: string, newName: string) => {
    return departmentStore.updateDepartment(oldName, newName);
  };

  const deleteDepartment = (name: string) => {
    return departmentStore.deleteDepartment(name);
  };

  return {
    departments,
    teamLeadDepartments,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchTeamLeadDepartments
  };
};
