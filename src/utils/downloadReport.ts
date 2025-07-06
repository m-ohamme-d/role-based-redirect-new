import { supabase } from "@/integrations/supabase/client";

export async function generatePerformanceReport(userRole: string, userId: string) {
  /**
   * Fetch employees depending on role:
   * - admin & manager: all employees
   * - teamlead: only employees of their department
   */
  try {
    if (userRole === "admin" || userRole === "manager") {
      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          user_id,
          department_id,
          position,
          performance_rating,
          hire_date,
          phone,
          skills,
          profiles!inner(name, email, role),
          departments(name)
        `);
      if (error) throw error;
      return data;
    } else if (userRole === "teamlead") {
      // First get teamlead's employee record to find their department
      const { data: employeeRecord, error: employeeError } = await supabase
        .from("employees")
        .select("department_id")
        .eq("user_id", userId)
        .single();
      
      if (employeeError) {
        // If no employee record, try to get from profiles (fallback)
        console.warn("No employee record found for team lead, using fallback");
        const { data, error } = await supabase
          .from("employees")
          .select(`
            id,
            user_id,
            department_id,
            position,
            performance_rating,
            hire_date,
            phone,
            skills,
            profiles!inner(name, email, role),
            departments(name)
          `)
          .limit(5); // Limit to avoid large queries for demo
        if (error) throw error;
        return data;
      }

      const departmentId = employeeRecord.department_id;

      const { data, error } = await supabase
        .from("employees")
        .select(`
          id,
          user_id,
          department_id,
          position,
          performance_rating,
          hire_date,
          phone,
          skills,
          profiles!inner(name, email, role),
          departments(name)
        `)
        .eq("department_id", departmentId);
      if (error) throw error;
      return data;
    } else {
      throw new Error("Unauthorized role");
    }
  } catch (err) {
    console.error("[generatePerformanceReport] Error:", err);
    throw err;
  }
}