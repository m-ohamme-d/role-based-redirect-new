-- 1. Re-create Departments & Employees using UUID primary keys
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Departments
CREATE TABLE IF NOT EXISTS public.departments (
  id          uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text      NOT NULL UNIQUE,
  description text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_departments_name 
  ON public.departments(name);

-- Employees
CREATE TABLE IF NOT EXISTS public.employees (
  id               uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid      NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  department_id    uuid      NOT NULL REFERENCES public.departments(id),
  position         text,
  performance_rating integer,
  hire_date        date,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_employees_user_id 
  ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id 
  ON public.employees(department_id);

-- 2. Role‐lookup function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
  RETURNS text LANGUAGE sql STABLE
AS $$
  SELECT role::text
    FROM public.profiles
   WHERE id = auth.uid()
$$;

-- 3. Enable RLS on lookup tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Authenticated can read departments" ON public.departments;
CREATE POLICY "Authenticated can read departments"
  ON public.departments FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 4. Enable RLS on employees & create policies
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can view employees" ON public.employees;
DROP POLICY IF EXISTS "Managers and Teamleads can view dept employees" ON public.employees;
DROP POLICY IF EXISTS "Employees can view own record" ON public.employees;
DROP POLICY IF EXISTS "Employees can insert" ON public.employees;
DROP POLICY IF EXISTS "Employees can update own record" ON public.employees;

-- Admin: can select all
CREATE POLICY "Admins can view employees"
  ON public.employees FOR SELECT
  USING (get_current_user_role() = 'admin');

-- Manager & teamlead: can select only their department
CREATE POLICY "Managers and Teamleads can view dept employees"
  ON public.employees FOR SELECT
  USING (
    get_current_user_role() IN ('manager','teamlead')
    AND department_id = (
      SELECT department_id 
      FROM public.employees 
      WHERE user_id = auth.uid()
    )
  );

-- Employee: can select own row
CREATE POLICY "Employees can view own record"
  ON public.employees FOR SELECT
  USING ( auth.uid() = user_id );

-- Allow insert (self‐register or by admin/manager)
CREATE POLICY "Employees can insert"
  ON public.employees FOR INSERT
  WITH CHECK (
    auth.uid() = user_id 
    OR get_current_user_role() IN ('manager','admin')
  );

-- Allow update own
CREATE POLICY "Employees can update own record"
  ON public.employees FOR UPDATE
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- 5. Auto‐stamp updated_at
CREATE OR REPLACE FUNCTION public.set_timestamp()
  RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ts_departments ON public.departments;
CREATE TRIGGER ts_departments
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE PROCEDURE public.set_timestamp();

DROP TRIGGER IF EXISTS ts_employees ON public.employees;
CREATE TRIGGER ts_employees
  BEFORE UPDATE ON public.employees
  FOR EACH ROW EXECUTE PROCEDURE public.set_timestamp();

-- 6. Ensure user→employee upsert helper & trigger
CREATE OR REPLACE FUNCTION public.ensure_user_employee_record()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  dept_id uuid;
BEGIN
  SELECT id INTO dept_id
    FROM public.departments
   WHERE name = 'Engineering' LIMIT 1;
  INSERT INTO public.employees (user_id, department_id, position, performance_rating)
  VALUES (auth.uid(), dept_id, 'Manager', 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_employee ON auth.users;
CREATE TRIGGER on_auth_user_created_employee
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_user_employee_record();