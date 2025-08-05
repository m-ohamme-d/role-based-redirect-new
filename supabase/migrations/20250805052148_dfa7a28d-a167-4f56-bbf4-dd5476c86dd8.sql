-- Idempotent migration to seed employees, teams, notifications, and audit_logs
-- Based on existing profiles and departments data

-- 1. EMPLOYEES: Create employee records for all profiles
WITH dept_assignments AS (
  -- Assign departments based on role logic
  SELECT 
    p.id as user_id,
    p.role::text as position,
    COALESCE(
      -- Try to find existing employee department
      (SELECT department_id FROM public.employees WHERE user_id = p.id),
      -- Default assignment: admins get first department, others get Engineering if it exists
      CASE 
        WHEN p.role = 'admin' THEN (SELECT id FROM public.departments ORDER BY created_at LIMIT 1)
        ELSE (SELECT id FROM public.departments WHERE name = 'Engineering' LIMIT 1)
      END,
      -- Fallback to any department
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
  -- Find team leads for each department
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

-- 4. AUDIT LOGS: Log all seeding operations
-- Log employee seeding
INSERT INTO public.audit_logs (
  id,
  user_id,
  table_name,
  record_id,
  action,
  changes,
  timestamp
)
SELECT 
  gen_random_uuid(),
  e.user_id,
  'employees',
  e.id,
  'seed',
  '{}'::jsonb,
  NOW()
FROM public.employees e
WHERE e.created_at >= (NOW() - INTERVAL '1 minute')
ON CONFLICT DO NOTHING;

-- Log team seeding
INSERT INTO public.audit_logs (
  id,
  user_id,
  table_name,
  record_id,
  action,
  changes,
  timestamp
)
SELECT 
  gen_random_uuid(),
  t.created_by,
  'teams',
  t.id,
  'seed',
  '{}'::jsonb,
  NOW()
FROM public.teams t
WHERE t.created_at >= (NOW() - INTERVAL '1 minute')
ON CONFLICT DO NOTHING;

-- Log notification seeding
INSERT INTO public.audit_logs (
  id,
  user_id,
  table_name,
  record_id,
  action,
  changes,
  timestamp
)
SELECT 
  gen_random_uuid(),
  n.user_id,
  'notifications',
  n.id,
  'seed',
  '{}'::jsonb,
  NOW()
FROM public.notifications n
WHERE n.created_at >= (NOW() - INTERVAL '1 minute')
ON CONFLICT DO NOTHING;