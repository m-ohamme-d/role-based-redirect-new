-- Update RLS policies for employees table to match requirements
DROP POLICY IF EXISTS "Managers and admins can view employees" ON public.employees;

-- Admin role: full SELECT (already exists as "Admins can manage employees")
-- Manager role: SELECT only employees in their department
CREATE POLICY "Managers can view department employees" 
ON public.employees 
FOR SELECT 
USING (
  get_current_user_role() = 'manager' AND 
  department_id = (
    SELECT department_id 
    FROM public.employees 
    WHERE user_id = auth.uid()
  )
);

-- Team lead role: same as manager
CREATE POLICY "Teamleads can view department employees" 
ON public.employees 
FOR SELECT 
USING (
  get_current_user_role() = 'teamlead' AND 
  department_id = (
    SELECT department_id 
    FROM public.employees 
    WHERE user_id = auth.uid()
  )
);

-- Update teams table RLS policies
DROP POLICY IF EXISTS "Everyone can view teams" ON public.teams;

CREATE POLICY "Managers and teamleads can view teams" 
ON public.teams 
FOR SELECT 
USING (get_current_user_role() = ANY (ARRAY['manager', 'teamlead', 'admin']));

CREATE POLICY "Managers can manage teams" 
ON public.teams 
FOR INSERT 
WITH CHECK (get_current_user_role() = ANY (ARRAY['manager', 'admin']));

CREATE POLICY "Managers can update teams" 
ON public.teams 
FOR UPDATE 
USING (get_current_user_role() = ANY (ARRAY['manager', 'admin']));

-- Add indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);

-- Seed data: Insert Engineering department if it doesn't exist
INSERT INTO public.departments (name, description) 
VALUES ('Engineering', 'Software Engineering Department')
ON CONFLICT DO NOTHING;

-- Upsert employee record for current user (this will need to be run by authenticated user)
-- Note: This should be run after authentication in the application
-- For now, we'll create a function that can be called from the app

CREATE OR REPLACE FUNCTION public.ensure_user_employee_record()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  eng_dept_id uuid;
BEGIN
  -- Get Engineering department ID
  SELECT id INTO eng_dept_id 
  FROM public.departments 
  WHERE name = 'Engineering' 
  LIMIT 1;
  
  -- Insert employee record if it doesn't exist
  INSERT INTO public.employees (user_id, department_id, position, performance_rating)
  VALUES (auth.uid(), eng_dept_id, 'Manager', 85)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;