-- 2025-07-09 12:00:00 UTC — add indexes on frequently filtered columns

-- Employees table by department
CREATE INDEX IF NOT EXISTS idx_employees_department_id
  ON employees(department_id);

-- Projects table by assigned department
CREATE INDEX IF NOT EXISTS idx_projects_department_id
  ON projects(assigned_department_id);

-- Clients table: GIN index on assigned_departments array
CREATE INDEX IF NOT EXISTS idx_clients_assigned_departments
  ON clients
  USING GIN (assigned_departments);

-- Clients table: GIN index on tags array
CREATE INDEX IF NOT EXISTS idx_clients_tags
  ON clients
  USING GIN (tags);

-- Designations table by department
CREATE INDEX IF NOT EXISTS idx_designations_department_id
  ON designations(department_id);