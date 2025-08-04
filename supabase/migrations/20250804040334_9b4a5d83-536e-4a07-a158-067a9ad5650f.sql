-- 1. Role-lookup function (reads from profiles.role)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text LANGUAGE sql STABLE AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- 2. Enable RLS + policies on departments (no schema changes)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Authenticated can read departments"
  ON public.departments FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 3. Enable RLS + policies on employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Admin: can SELECT all
CREATE POLICY IF NOT EXISTS "Admins can view employees"
  ON public.employees FOR SELECT
  USING (get_current_user_role() = 'admin');

-- Manager & Teamlead: can SELECT only in their dept
CREATE POLICY IF NOT EXISTS "Managers & Teamleads can view dept employees"
  ON public.employees FOR SELECT
  USING (
    get_current_user_role() IN ('manager','teamlead')
    AND department_id = (
      SELECT department_id FROM public.employees WHERE user_id = auth.uid()
    )
  );

-- Employee: can SELECT own row
CREATE POLICY IF NOT EXISTS "Employees can view own record"
  ON public.employees FOR SELECT
  USING (auth.uid() = user_id);

-- Allow INSERT (self-register or by admin/manager)
CREATE POLICY IF NOT EXISTS "Employees can insert"
  ON public.employees FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR get_current_user_role() IN ('manager','admin')
  );

-- Allow UPDATE own record
CREATE POLICY IF NOT EXISTS "Employees can update own record"
  ON public.employees FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Auto-stamp updated_at columns (no layout change)
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

-- 5. Helper & trigger to auto-upsert employee record on sign-up
CREATE OR REPLACE FUNCTION public.ensure_user_employee_record()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE dept_id uuid;
BEGIN
  SELECT id INTO dept_id FROM public.departments WHERE name = 'Engineering' LIMIT 1;
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

-- 6. Seed the "Engineering" department if missing
INSERT INTO public.departments (id, name, description)
VALUES (gen_random_uuid(), 'Engineering', 'Software Engineering Department')
ON CONFLICT (name) DO NOTHING;