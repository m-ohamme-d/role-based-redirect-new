
-- Add missing columns and improve schema
ALTER TABLE employees ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Add database indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_department_id ON projects(assigned_department_id);

-- Improve RLS policies for employees table
DROP POLICY IF EXISTS "Managers and admins can manage employees" ON employees;
CREATE POLICY "Admins can manage employees" ON employees
FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Managers can insert employees" ON employees
FOR INSERT WITH CHECK (get_current_user_role() = 'manager');

CREATE POLICY "Managers can update employees" ON employees  
FOR UPDATE USING (get_current_user_role() = 'manager');

-- Improve RLS policies for projects table
DROP POLICY IF EXISTS "Managers and admins can manage projects" ON projects;
CREATE POLICY "Admins can manage projects" ON projects
FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Managers can insert projects" ON projects
FOR INSERT WITH CHECK (get_current_user_role() = 'manager');

CREATE POLICY "Managers can update projects" ON projects
FOR UPDATE USING (get_current_user_role() = 'manager');

-- Improve RLS policies for designations table  
CREATE POLICY "Managers can insert designations" ON designations
FOR INSERT WITH CHECK (get_current_user_role() = 'manager');

CREATE POLICY "Managers can update designations" ON designations
FOR UPDATE USING (get_current_user_role() = 'manager');

-- Add audit trigger to employees table
DROP TRIGGER IF EXISTS audit_employees_changes ON employees;
CREATE TRIGGER audit_employees_changes
  AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Add audit trigger to projects table
DROP TRIGGER IF EXISTS audit_projects_changes ON projects;
CREATE TRIGGER audit_projects_changes
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Add audit trigger to clients table
DROP TRIGGER IF EXISTS audit_clients_changes ON clients;
CREATE TRIGGER audit_clients_changes
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
