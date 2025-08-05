-- Fix the log_audit_changes function to handle UUID record_id properly
CREATE OR REPLACE FUNCTION public.log_audit_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
    COALESCE(NEW.id, OLD.id),  -- Keep as UUID, don't cast to text
    TG_OP,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      ELSE to_jsonb(NEW)
    END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Now seed the tables with proper data
-- 1. EMPLOYEES: Create employee records for all profiles
WITH dept_assignments AS (
  SELECT 
    p.id as user_id,
    p.role::text as position,
    COALESCE(
      (SELECT department_id FROM public.employees WHERE user_id = p.id),
      CASE 
        WHEN p.role = 'admin' THEN (SELECT id FROM public.departments ORDER BY created_at LIMIT 1)
        ELSE (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1)
      END,
      (SELECT id FROM public.departments LIMIT 1)
    ) as department_id
  FROM public.profiles p
)
INSERT INTO public.employees (
  user_id, 
  department_id, 
  position, 
  performance_rating, 
  hire_date
)
SELECT 
  user_id,
  department_id,
  position,
  0,
  CURRENT_DATE
FROM dept_assignments
WHERE department_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- 2. TEAMS: Create one team per department
WITH team_leads AS (
  SELECT DISTINCT
    d.id as department_id,
    d.name as dept_name,
    e.user_id as team_lead_id
  FROM public.departments d
  LEFT JOIN public.employees e ON d.id = e.department_id
  LEFT JOIN public.profiles p ON e.user_id = p.id AND p.role = 'teamlead'
)
INSERT INTO public.teams (
  id,
  name,
  department_id,
  team_lead_id,
  description
)
SELECT 
  gen_random_uuid(),
  dept_name || ' Team',
  department_id,
  team_lead_id,
  'Auto-generated team for ' || dept_name || ' department'
FROM team_leads
ON CONFLICT (name) DO NOTHING;

-- 3. NOTIFICATIONS: Welcome notification for each profile
INSERT INTO public.notifications (
  id,
  user_id,
  title,
  message,
  type,
  read_at
)
SELECT 
  gen_random_uuid(),
  p.id,
  'Welcome to the Dashboard',
  'Hi ' || COALESCE(p.name, 'there') || '! Your account is ready.',
  'welcome',
  NULL
FROM public.profiles p
ON CONFLICT (user_id, title) DO NOTHING;