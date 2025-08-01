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
    return data;
  }

  // Manager: only their department
  if (userRole === "manager") {
    console.log("[generatePerformanceReport] Manager role detected, userId:", userId);
    
    // fetch manager's department from employees table
    console.log("[generatePerformanceReport] Querying for manager's department...");
    const { data: mgr, error: mgrErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .single();
    
    console.log("[generatePerformanceReport] Manager query result:", { mgr, mgrErr });
    
    if (mgrErr) {
      console.error("[generatePerformanceReport] Manager query error:", mgrErr);
      throw mgrErr;
    }

    if (!mgr?.department_id) {
      console.warn("[generatePerformanceReport] Manager has no department_id");
      return [];
    }

    console.log("[generatePerformanceReport] Querying employees for department:", mgr.department_id);
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
    
    console.log("[generatePerformanceReport] Employees query result:", { data, error });
    
    if (error) {
      console.error("[generatePerformanceReport] Employees query error:", error);
      throw error;
    }
    
    console.log("[generatePerformanceReport] Returning data for manager:", data);
    return data;
  }

  // Team Lead: only their department
  if (userRole === "teamlead") {
    const { data: tl, error: tlErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .single();
    if (tlErr) throw tlErr;

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
    return data;
  }

  throw new Error("Unauthorized");
}