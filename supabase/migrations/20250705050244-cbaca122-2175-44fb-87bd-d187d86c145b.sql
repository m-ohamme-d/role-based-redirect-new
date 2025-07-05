-- Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  changes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Add avatar_url to profiles table if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add created_by columns to track ownership
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Add useful indexes
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_department ON public.projects(assigned_department_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
  FOR SELECT USING (get_current_user_role() = 'admin');

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Tighten existing RLS policies
DROP POLICY IF EXISTS "Managers and admins can view employees" ON public.employees;
CREATE POLICY "Managers and admins can view employees" ON public.employees
  FOR SELECT USING (
    get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]) OR
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;
CREATE POLICY "Admins can manage employees" ON public.employees
  FOR ALL USING (get_current_user_role() = 'admin');

CREATE POLICY "Managers can create employees" ON public.employees
  FOR INSERT WITH CHECK (get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]));

CREATE POLICY "Managers can update employees" ON public.employees
  FOR UPDATE USING (
    get_current_user_role() = ANY (ARRAY['admin'::text, 'manager'::text]) OR
    auth.uid() = user_id
  );

-- Team leads can view employees in their department
CREATE POLICY "Team leads can view their department employees" ON public.employees
  FOR SELECT USING (
    get_current_user_role() = 'teamlead' AND 
    department_id = (
      SELECT department_id FROM public.employees 
      WHERE user_id = auth.uid() LIMIT 1
    )
  );

-- Function to log audit changes
CREATE OR REPLACE FUNCTION public.log_audit_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    table_name,
    record_id,
    action,
    changes
  ) VALUES (
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
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

-- Add audit triggers to important tables
DROP TRIGGER IF EXISTS audit_employees_changes ON public.employees;
CREATE TRIGGER audit_employees_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.employees
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_changes();

DROP TRIGGER IF EXISTS audit_clients_changes ON public.clients;
CREATE TRIGGER audit_clients_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_changes();

DROP TRIGGER IF EXISTS audit_projects_changes ON public.projects;
CREATE TRIGGER audit_projects_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_changes();