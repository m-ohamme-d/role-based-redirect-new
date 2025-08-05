import { supabase } from "@/integrations/supabase/client";

/**
 * Returns performance rows based on role:
 * - admin: all employees
 * - manager: employees in manager's department
 * - teamlead: employees in teamlead's department
 */
export async function generatePerformanceReport(userRole: string, userId: string) {
  // Admin: all employees
  if (userRole === "admin") {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        id,
        user_id,
        department_id,
        position,
        performance_rating,
        hire_date,
        profiles ( name, email ),
        departments ( name )
      `);
    if (error) throw error;
    return data || [];
  }

  // Manager: only their department
  if (userRole === "manager") {
    // fetch manager's department from employees table using maybeSingle()
    const { data: mgr, error: mgrErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (mgrErr) throw mgrErr;
    if (!mgr || !mgr.department_id) return [];

    const { data, error } = await supabase
      .from("employees")
      .select(`
        id,
        user_id,
        department_id,
        position,
        performance_rating,
        hire_date,
        profiles ( name, email ),
        departments ( name )
      `)
      .eq("department_id", mgr.department_id);
    if (error) throw error;
    return data || [];
  }

  // Team Lead: only their department
  if (userRole === "teamlead") {
    const { data: tl, error: tlErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (tlErr) throw tlErr;
    if (!tl || !tl.department_id) return [];

    const { data, error } = await supabase
      .from("employees")
      .select(`
        id,
        user_id,
        department_id,
        position,
        performance_rating,
        hire_date,
        profiles ( name, email ),
        departments ( name )
      `)
      .eq("department_id", tl.department_id);
    if (error) throw error;
    return data || [];
  }

  throw new Error("Unauthorized");
}