import { supabase } from "@/integrations/supabase/client";

export async function generatePerformanceReport(userRole: string, userId: string) {
  console.log("🔍 generatePerformanceReport()", { userRole, userId });

  let query;
  if (userRole === "admin" || userRole === "manager") {
    query = supabase
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
  } else if (userRole === "teamlead") {
    // grab the teamlead's department
    const { data: prof, error: profErr } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .single();
    console.log("🔍 teamlead profile fetch", prof, profErr);
    if (profErr) throw profErr;
    query = supabase
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
      .eq("department_id", prof.department_id);
  } else {
    throw new Error("Unauthorized");
  }

  const { data, error } = await query;
  console.log("🔍 supabase returned", { data, error });
  if (error) throw error;
  if (!data || data.length === 0) {
    console.warn("⚠️ No rows returned from employees table");
  }
  return data;
}