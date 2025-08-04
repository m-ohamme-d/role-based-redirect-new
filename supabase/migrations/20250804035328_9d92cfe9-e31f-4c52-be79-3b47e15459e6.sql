-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
  RETURNS text 
  LANGUAGE sql 
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
  SELECT role::text
    FROM public.profiles
   WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.set_timestamp()
  RETURNS trigger 
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_user_employee_record_trigger()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  dept_id uuid;
BEGIN
  SELECT id INTO dept_id
    FROM public.departments
   WHERE name = 'Engineering' LIMIT 1;
  INSERT INTO public.employees (user_id, department_id, position, performance_rating)
  VALUES (NEW.id, dept_id, 'Manager', 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;