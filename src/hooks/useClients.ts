import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'stopped' | 'completed';
  assigned_department_id?: string;
  client_id?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive';
  contact_email?: string;
  contact_phone?: string;
  tags: string[];
  assigned_departments: string[];
  projects?: Project[];
  created_at: string;
  updated_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Fetch clients and departments separately since there's no direct relationship
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('name');

      if (clientsError) throw clientsError;

      // Fetch departments separately
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id, name');

      if (departmentsError) throw departmentsError;

      // Fetch projects for each client
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;

      // Create a map of department IDs to names
      const departmentMap = (departmentsData || []).reduce((acc, dept) => {
        acc[dept.id] = dept.name;
        return acc;
      }, {} as Record<string, string>);

      // Process clients data - convert department IDs to names where available
      const clientsWithProjects = (clientsData || []).map(client => {
        const departmentNames = client.assigned_departments?.map((deptId: string) => {
          return departmentMap[deptId] || deptId;
        }) || [];

        return {
          ...client,
          status: client.status as 'active' | 'inactive',
          assigned_departments: departmentNames,
          projects: (projectsData || []).filter(project => project.client_id === client.id).map(project => ({
            ...project,
            status: project.status as 'active' | 'stopped' | 'completed'
          }))
        };
      });

      setClients(clientsWithProjects);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    // Set up real-time subscriptions with unique channel names
    const clientsChannel = supabase
      .channel(`clients-changes-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients'
        },
        () => {
          fetchClients();
        }
      )
      .subscribe();

    const projectsChannel = supabase
      .channel(`projects-changes-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        () => {
          fetchClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const createClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'projects'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .insert(clientData);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Client created successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Client updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Client deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const addProject = async (clientId: string, projectData: Omit<Project, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          client_id: clientId
        });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Project added successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Project updated successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  return {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    deleteClient,
    addProject,
    updateProject,
    refetch: fetchClients
  };
};