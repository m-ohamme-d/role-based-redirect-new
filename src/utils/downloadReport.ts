import { supabase } from "@/integrations/supabase/client";

export async function generatePerformanceReport(userRole: string, userId: string) {
  console.log(`[generatePerformanceReport] Starting for role: ${userRole}, userId: ${userId}`);
  
  // Admin: see all employees
  if (userRole === "admin") {
    console.log("[generatePerformanceReport] Fetching data for admin");
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
    console.log("[generatePerformanceReport] Admin query result:", { data, error });
    if (error) throw error;
    return data;
  }
  // Manager: see all employees
  if (userRole === "manager") {
    console.log("[generatePerformanceReport] Fetching data for manager");
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
    console.log("[generatePerformanceReport] Manager query result:", { data, error });
    if (error) throw error;
    return data;
  }
  // Team Lead: see only your department
  if (userRole === "teamlead") {
    // Get teamlead's employee record to find their department
    const { data: employeeRecord, error: employeeError } = await supabase
      .from("employees")
      .select("department_id")
      .eq("user_id", userId)
      .single();
    
    if (employeeError) throw employeeError;
    
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
      .eq("department_id", employeeRecord.department_id);
    if (error) throw error;
    return data;
  }
  // Other roles: unauthorized
  throw new Error("Unauthorized");
}