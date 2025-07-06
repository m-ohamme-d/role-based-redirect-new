import { supabase } from "@/integrations/supabase/client";

export async function generatePerformanceReport(userRole: string, userId: string) {
  // Admin: see all employees
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
        phone,
        skills,
        profiles ( name, email, role ),
        departments ( name )
      `);
    if (error) throw error;
    return data;
  }

  // Manager: see only your department's employees
  if (userRole === "manager") {
    // first fetch manager's dept
    const { data: mgr, error: mgrErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .single();
    if (mgrErr) throw mgrErr;

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
        profiles ( name, email, role ),
        departments ( name )
      `)
      .eq("department_id", mgr.department_id);
    if (error) throw error;
    return data;
  }

  // Team Lead: see only your team's department
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
        phone,
        skills,
        profiles ( name, email, role ),
        departments ( name )
      `)
      .eq("department_id", tl.department_id);
    if (error) throw error;
    return data;
  }

  // Other roles have no access
  throw new Error("Unauthorized");
}