-- Create departments table to replace departmentStore
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create teams table
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  team_lead_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clients table to replace mockClients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  contact_email TEXT,
  contact_phone TEXT,
  tags TEXT[],
  assigned_departments UUID[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stopped', 'completed')),
  assigned_department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employees table for enhanced employee data
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  position TEXT,
  skills TEXT[],
  performance_rating INTEGER DEFAULT 0 CHECK (performance_rating >= 0 AND performance_rating <= 100),
  hire_date DATE,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create designations table
CREATE TABLE public.designations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'warning', 'error', 'success')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  changes JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for departments
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for teams
CREATE POLICY "Everyone can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Managers and admins can manage teams" ON public.teams FOR ALL USING (public.get_current_user_role() IN ('admin', 'manager'));

-- RLS Policies for clients
CREATE POLICY "Managers and admins can view clients" ON public.clients FOR SELECT USING (public.get_current_user_role() IN ('admin', 'manager'));
CREATE POLICY "Managers and admins can manage clients" ON public.clients FOR ALL USING (public.get_current_user_role() IN ('admin', 'manager'));

-- RLS Policies for projects
CREATE POLICY "Everyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Managers and admins can manage projects" ON public.projects FOR ALL USING (public.get_current_user_role() IN ('admin', 'manager'));

-- RLS Policies for employees
CREATE POLICY "Users can view their own employee record" ON public.employees FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Managers and admins can view employees" ON public.employees FOR SELECT USING (public.get_current_user_role() IN ('admin', 'manager'));
CREATE POLICY "Admins can manage employees" ON public.employees FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for designations
CREATE POLICY "Everyone can view designations" ON public.designations FOR SELECT USING (true);
CREATE POLICY "Admins can manage designations" ON public.designations FOR ALL USING (public.get_current_user_role() = 'admin');

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can create notifications" ON public.notifications FOR INSERT WITH CHECK (public.get_current_user_role() = 'admin');

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.get_current_user_role() = 'admin');
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

-- Create update timestamp triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_designations_updated_at BEFORE UPDATE ON public.designations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed departments data (replacing departmentStore)
INSERT INTO public.departments (name, description) VALUES
  ('IT', 'Information Technology Department'),
  ('HR', 'Human Resources Department'),
  ('Sales', 'Sales Department'),
  ('Marketing', 'Marketing Department'),
  ('Finance', 'Finance Department'),
  ('Administration', 'Administration Department');

-- Seed designations data
INSERT INTO public.designations (name, department_id, count) 
SELECT 
  designation.name,
  d.id,
  designation.count
FROM public.departments d
CROSS JOIN (VALUES 
  ('Senior Developer', 5),
  ('Developer', 10),
  ('Junior Developer', 8),
  ('Manager', 2),
  ('Team Lead', 3),
  ('HR Specialist', 4),
  ('Sales Representative', 12),
  ('Marketing Specialist', 6),
  ('Financial Analyst', 4),
  ('Administrative Assistant', 3)
) AS designation(name, count)
WHERE (
  (d.name = 'IT' AND designation.name IN ('Senior Developer', 'Developer', 'Junior Developer', 'Team Lead')) OR
  (d.name = 'HR' AND designation.name IN ('HR Specialist', 'Manager')) OR
  (d.name = 'Sales' AND designation.name IN ('Sales Representative', 'Manager')) OR
  (d.name = 'Marketing' AND designation.name IN ('Marketing Specialist', 'Manager')) OR
  (d.name = 'Finance' AND designation.name IN ('Financial Analyst', 'Manager')) OR
  (d.name = 'Administration' AND designation.name IN ('Administrative Assistant', 'Manager'))
);

-- Seed clients data (from mockClients)
DO $$
DECLARE
  it_dept_id UUID;
  marketing_dept_id UUID;
  sales_dept_id UUID;
  client1_id UUID;
  client2_id UUID;
  client3_id UUID;
BEGIN
  -- Get department IDs
  SELECT id INTO it_dept_id FROM public.departments WHERE name = 'IT';
  SELECT id INTO marketing_dept_id FROM public.departments WHERE name = 'Marketing';
  SELECT id INTO sales_dept_id FROM public.departments WHERE name = 'Sales';

  -- Insert clients
  INSERT INTO public.clients (name, company, status, contact_email, contact_phone, tags, assigned_departments)
  VALUES 
    ('TechCorp Solutions', 'TechCorp Inc.', 'active', 'contact@techcorp.com', '+1 (555) 123-4567', 
     ARRAY['Enterprise', 'Technology', 'Priority'], ARRAY[it_dept_id, marketing_dept_id])
  RETURNING id INTO client1_id;

  INSERT INTO public.clients (name, company, status, contact_email, contact_phone, tags, assigned_departments)
  VALUES 
    ('HealthCare Inc', 'HealthCare Systems', 'active', 'info@healthcare.com', '+1 (555) 987-6543', 
     ARRAY['Healthcare', 'Compliance'], ARRAY[it_dept_id])
  RETURNING id INTO client2_id;

  INSERT INTO public.clients (name, company, status, contact_email, contact_phone, tags, assigned_departments)
  VALUES 
    ('Retail Masters', 'Retail Solutions Ltd', 'inactive', 'support@retailmasters.com', '+1 (555) 456-7890', 
     ARRAY['Retail', 'E-commerce'], ARRAY[sales_dept_id, marketing_dept_id])
  RETURNING id INTO client3_id;

  -- Insert projects
  INSERT INTO public.projects (name, client_id, status, assigned_department_id) VALUES
    ('Mobile App Development', client1_id, 'active', it_dept_id),
    ('Web Platform Redesign', client1_id, 'active', it_dept_id),
    ('Patient Management System', client2_id, 'active', it_dept_id),
    ('E-commerce Platform', client3_id, 'stopped', sales_dept_id);
END $$;