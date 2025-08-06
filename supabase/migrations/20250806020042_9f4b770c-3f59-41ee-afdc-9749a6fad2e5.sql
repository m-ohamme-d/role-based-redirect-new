-- Fix the log_audit_changes function first
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

-- Seed employees only if they don't exist
INSERT INTO public.employees (
  user_id, 
  department_id, 
  position, 
  performance_rating, 
  hire_date
)
SELECT 
  p.id,
  COALESCE(
    (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1),
    (SELECT id FROM public.departments LIMIT 1)
  ),
  p.role::text,
  0,
  CURRENT_DATE
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.employees e WHERE e.user_id = p.id
);

-- Seed teams only if they don't exist  
INSERT INTO public.teams (
  id,
  name,
  department_id,
  team_lead_id,
  description
)
SELECT 
  gen_random_uuid(),
  d.name || ' Team',
  d.id,
  (SELECT e.user_id FROM public.employees e 
   JOIN public.profiles p ON e.user_id = p.id 
   WHERE e.department_id = d.id AND p.role = 'teamlead' LIMIT 1),
  'Auto-generated team for ' || d.name || ' department'
FROM public.departments d
WHERE NOT EXISTS (
  SELECT 1 FROM public.teams t WHERE t.department_id = d.id
);

-- Seed notifications only if they don't exist (using 'info' type)
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
  'info',
  NULL
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.notifications n 
  WHERE n.user_id = p.id AND n.title = 'Welcome to the Dashboard'
);