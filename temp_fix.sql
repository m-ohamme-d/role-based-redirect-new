
-- Remove the problematic INSERT with ON CONFLICT and replace with simple INSERT
DELETE FROM public.departments WHERE name IN ('Engineering', 'Marketing', 'Sales', 'HR');

INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Software development and technical operations'),
  ('Marketing',   'Brand management and customer acquisition'),
  ('Sales',       'Revenue generation and client relationships'),
  ('HR',          'Human resources and talent management');
