
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabaseDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();

    // Set up real-time subscription with proper cleanup
    const channel = supabase
      .channel(`departments-changes-${Date.now()}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*',  
          schema: 'public',
          table: 'departments'
        },
        () => {
          console.log('Department change detected, refetching...');
          fetchDepartments();
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Department subscription status:', status);
    });

    return () => {
      console.log('Cleaning up department subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const addDepartment = async (name: string, description?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('departments')
        .insert({ name: name.trim(), description });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Department added successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const updateDepartment = async (id: string, name: string, description?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('departments')
        .update({ name: name.trim(), description })
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Department updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Department deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  // Return department names array for backwards compatibility
  const departmentNames = departments.map(dept => dept.name);

  return {
    departments,
    departmentNames,
    loading,
    error,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refetch: fetchDepartments
  };
};
