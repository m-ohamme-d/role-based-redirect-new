import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminData() {
  const sb = supabase as any;
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: departmentsData, error: deptError } = await sb.from('departments').select('*');
      const { data: usersData, error: usersError } = await sb.from('profiles').select('*');
      if (deptError || usersError) {
        setError('Failed to fetch data');
      } else {
        setDepartments(departmentsData || []);
        setUsers(usersData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Example CRUD
  const addDepartment = async (name: string) => {
    return sb.from('departments').insert([{ name }]);
  };
  const updateDepartment = async (id: string, updates: any) => {
    return sb.from('departments').update(updates).eq('id', id);
  };
  const deleteDepartment = async (id: string) => {
    return sb.from('departments').delete().eq('id', id);
  };

  return { departments, users, loading, error, addDepartment, updateDepartment, deleteDepartment };
}
