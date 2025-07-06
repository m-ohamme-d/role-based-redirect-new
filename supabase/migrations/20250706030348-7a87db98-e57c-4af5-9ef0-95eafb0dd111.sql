-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_assigned_departments ON clients USING GIN(assigned_departments);
CREATE INDEX IF NOT EXISTS idx_clients_tags ON clients USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_projects_department_id ON projects(assigned_department_id);
CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id);
CREATE INDEX IF NOT EXISTS idx_designations_department_id ON designations(department_id);

-- Add created_by columns to track ownership
ALTER TABLE employees ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id);

-- Create audit logs table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  table_name TEXT NOT NULL,
  record_id TEXT,
  action TEXT NOT NULL,
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (get_current_user_role() = 'admin');

DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;
CREATE POLICY "System can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    changes
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id::text, OLD.id::text),
    TG_OP,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to key tables
DROP TRIGGER IF EXISTS audit_employees_changes ON employees;
CREATE TRIGGER audit_employees_changes
  AFTER INSERT OR UPDATE OR DELETE ON employees
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

DROP TRIGGER IF EXISTS audit_clients_changes ON clients;
CREATE TRIGGER audit_clients_changes
  AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

DROP TRIGGER IF EXISTS audit_projects_changes ON projects;
CREATE TRIGGER audit_projects_changes
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

DROP TRIGGER IF EXISTS audit_teams_changes ON teams;
CREATE TRIGGER audit_teams_changes
  AFTER INSERT OR UPDATE OR DELETE ON teams
  FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

-- Tighten RLS policies for better security
DROP POLICY IF EXISTS "Managers can create employees" ON employees;
CREATE POLICY "Managers can create employees" ON employees
  FOR INSERT WITH CHECK (get_current_user_role() IN ('admin', 'manager'));

DROP POLICY IF EXISTS "Managers can update employees" ON employees;
CREATE POLICY "Managers can update employees" ON employees
  FOR UPDATE USING (get_current_user_role() IN ('admin', 'manager'));

DROP POLICY IF EXISTS "Team leads can view their department projects" ON projects;
CREATE POLICY "Team leads can view their department projects" ON projects
  FOR SELECT USING (
    get_current_user_role() = 'teamlead' OR 
    get_current_user_role() IN ('admin', 'manager')
  );