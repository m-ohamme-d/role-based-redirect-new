
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PerformanceData {
  employees: any[];
  projects: any[];
  departments: any[];
  reportMetrics: {
    totalEmployees: number;
    activeProjects: number;
    avgPerformance: number;
    completionRate: number;
  };
}

export const usePerformanceReport = (userRole: string, userId: string) => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch employees with department names
      const { data: employees, error: empError } = await supabase
        .from('employees')
        .select(`
          *,
          profiles!inner(name, email, role),
          departments(name)
        `)
        .order('created_at');

      if (empError) throw empError;

      // Fetch projects with client and department info
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name, company),
          departments!assigned_department_id(name)
        `)
        .order('created_at');

      if (projError) throw projError;

      // Fetch departments
      const { data: departments, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (deptError) throw deptError;

      // Calculate metrics
      const totalEmployees = employees?.length || 0;
      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const avgPerformance = employees?.reduce((sum, emp) => sum + (emp.performance_rating || 0), 0) / totalEmployees || 0;
      const completionRate = projects?.filter(p => p.status === 'completed').length / (projects?.length || 1) * 100 || 0;

      setData({
        employees: employees || [],
        projects: projects || [],
        departments: departments || [],
        reportMetrics: {
          totalEmployees,
          activeProjects,
          avgPerformance,
          completionRate
        }
      });
    } catch (err: any) {
      console.error('Error fetching report data:', err);
      setError(err.message);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();

    // Set up real-time subscriptions with user-specific channels
    const employeeChannel = supabase
      .channel(`user-${userId}-employees`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'employees'
      }, () => fetchReportData())
      .subscribe();

    const projectChannel = supabase
      .channel(`user-${userId}-projects`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'projects'
      }, () => fetchReportData())
      .subscribe();

    return () => {
      supabase.removeChannel(employeeChannel);
      supabase.removeChannel(projectChannel);
    };
  }, [userId]);

  return { data, loading, error, refetch: fetchReportData };
};
