-- Allow managers and teamleads to view profiles of employees in their department
CREATE POLICY "Managers and teamleads can view department profiles" 
ON public.profiles 
FOR SELECT 
USING (
  get_current_user_role() = ANY (ARRAY['manager'::text, 'teamlead'::text]) 
  AND id IN (
    SELECT e.user_id 
    FROM employees e 
    WHERE e.department_id = (
      SELECT emp.department_id 
      FROM employees emp 
      WHERE emp.user_id = auth.uid()
    )
  )
);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_current_user_role() = 'admin'::text);