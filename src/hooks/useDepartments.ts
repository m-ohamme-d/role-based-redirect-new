import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { departmentStore } from '../stores/departmentStore';
import { getMockSession, createMockTeamLead } from '@/utils/mockAuth';

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

  useEffect(() => {
    const unsubscribe = departmentStore.subscribe(() => {
      setDepartments(departmentStore.getDepartments());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // For development, use mock session if no real auth
    const initializeData = async () => {
      let currentProfile = profile;
      
      if (!currentProfile) {
        const mockProfile = getMockSession();
        if (!mockProfile) {
          console.log('Creating mock team lead for development...');
          const newMockProfile = await createMockTeamLead();
          currentProfile = newMockProfile;
        } else {
          currentProfile = mockProfile;
        }
      }

      if (currentProfile?.role === 'teamlead') {
        await fetchTeamLeadDepartments(currentProfile.id);
      } else {
        setLoading(false);
      }
    };

    initializeData();
  }, [profile]);

  const fetchTeamLeadDepartments = async (teamLeadId?: string) => {
    try {
      setLoading(true);

      const { data: deptData, error: deptError } = await (supabase as any)
        .from('departments')
        .select(`
          id,
          name,
          team_members(id)
        `)
        .eq('team_lead_id', teamLeadId);

      if (deptError) {
        console.error('Error fetching departments:', deptError);
        setLoading(false);
        return;
      }

      const transformedDepts: Department[] = (deptData || []).map((dept: any) => ({
        id: dept.id,
        name: dept.name,
        memberCount: dept.team_members ? dept.team_members.length : 0
      }));

      setTeamLeadDepartments(transformedDepts);
    } catch (err) {
      console.error('Error fetching departments:', err);
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
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: () => fetchTeamLeadDepartments(profile?.id)
  };
};
