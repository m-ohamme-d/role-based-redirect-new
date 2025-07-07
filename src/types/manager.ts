export interface Project {
  id: string;
  name: string;
  status: 'active' | 'stopped' | 'completed';
  assigned_department_id?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive';
  assigned_departments?: string[];
  tags?: string[];
  contact_email?: string;
  contact_phone?: string;
  projects?: Project[];
  isMock?: boolean;
}

export interface NewClientData {
  name: string;
  company: string;
  status: 'active' | 'inactive';
  assigned_departments: string[];
  tags: string[];
  contact_email: string;
  contact_phone: string;
}