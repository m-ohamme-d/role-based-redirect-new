-- 2025-07-09 15:00:01 UTC — tighten RLS policies

-- Update employees RLS policies
DROP POLICY IF EXISTS "Admins can manage employees" ON employees;
DROP POLICY IF EXISTS "Managers and admins can view employees" ON employees;
DROP POLICY IF EXISTS "Managers can create employees" ON employees;
DROP POLICY IF EXISTS "Managers can update employees" ON employees;
DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;

CREATE POLICY "employees_select" ON employees
  FOR SELECT USING (
    get_current_user_role() IN ('admin', 'manager', 'teamlead')
  );

CREATE POLICY "employees_insert" ON employees
  FOR INSERT WITH CHECK (
    get_current_user_role() IN ('admin', 'manager')
  );

CREATE POLICY "employees_update" ON employees
  FOR UPDATE USING (
    get_current_user_role() = 'admin'
    OR (get_current_user_role() = 'manager')
  );

CREATE POLICY "employees_delete" ON employees
  FOR DELETE USING (
    get_current_user_role() = 'admin'
  );

-- Update projects RLS policies
DROP POLICY IF EXISTS "Everyone can view projects" ON projects;
DROP POLICY IF EXISTS "Managers and admins can manage projects" ON projects;
DROP POLICY IF EXISTS "Team leads can view their department projects" ON projects;

CREATE POLICY "projects_manage" ON projects
  FOR ALL USING (
    get_current_user_role() IN ('admin', 'manager')
  );

-- Update designations RLS policies  
DROP POLICY IF EXISTS "Admins can manage designations" ON designations;
DROP POLICY IF EXISTS "Everyone can view designations" ON designations;

CREATE POLICY "designations_manage" ON designations
  FOR ALL USING (
    get_current_user_role() = 'admin'
  );