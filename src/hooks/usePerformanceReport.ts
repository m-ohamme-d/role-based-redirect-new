import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePerformanceReport(role: string, userId: string) {
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // Fetch real data from Supabase based on role
      let data: any[] = [];
      
      if (role === 'teamlead') {
        // Fetch team members and their performance data
        const { data: employees, error } = await supabase
          .from('employees')
          .select(`
            id,
            performance_rating,
            position,
            user_id,
            profiles:user_id(name, email)
          `)
          .order('performance_rating', { ascending: false });

        if (error) throw error;
        data = employees || [];
      } else if (role === 'manager') {
        // Fetch all employees and team data
        const { data: employees, error } = await supabase
          .from('employees')
          .select(`
            id,
            performance_rating,
            position,
            user_id,
            department_id,
            profiles:user_id(name, email),
            departments:department_id(name)
          `)
          .order('performance_rating', { ascending: false });

        if (error) throw error;
        data = employees || [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast.error('Failed to fetch performance data');
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { fetch, loading };
}