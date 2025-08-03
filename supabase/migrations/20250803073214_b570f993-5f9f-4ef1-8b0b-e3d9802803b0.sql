-- Add indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);

-- Seed data: Insert Engineering department if it doesn't exist
INSERT INTO public.departments (name, description) 
VALUES ('Engineering', 'Software Engineering Department')
ON CONFLICT (name) DO NOTHING;

-- Create function to ensure user has employee record
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