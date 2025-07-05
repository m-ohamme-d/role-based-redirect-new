
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Employee {
  id: string;
  user_id: string;
  department_id?: string;
  position?: string;
  skills: string[];
  performance_rating: number;
  hire_date?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  // Joined data from profiles
  name?: string;
  email?: string;
  role?: string;
  // Joined data from departments
  department_name?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          profiles!inner(name, email, role),
          departments(name)
        `)
        .order('created_at');

      if (error) throw error;

      // Transform the data to flatten the joined fields
      const transformedEmployees = (data || []).map(emp => ({
        ...emp,
        name: emp.profiles?.name,
        email: emp.profiles?.email,
        role: emp.profiles?.role,
        department_name: emp.departments?.name
      }));

      setEmployees(transformedEmployees);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();

    // Set up real-time subscription with proper cleanup
    const channel = supabase
      .channel('employees-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'employees'
        },
        () => {
          console.log('Employee change detected, refetching...');
          fetchEmployees();
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Employee subscription status:', status);
    });

    return () => {
      console.log('Cleaning up employee subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  const createEmployee = async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('employees')
        .insert(employeeData);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Employee record created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Employee record updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Employee record deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const getEmployeeByUserId = (userId: string) => {
    return employees.find(emp => emp.user_id === userId);
  };

  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter(emp => emp.department_id === departmentId);
  };

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeByUserId,
    getEmployeesByDepartment,
    refetch: fetchEmployees
  };
};
