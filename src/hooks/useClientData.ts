import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Client {
  id: string;
  name: string;
  company: string;
  status: 'active' | 'inactive';
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  id: string;
  name: string;
  client_id: string;
  status: 'active' | 'stopped' | 'completed';
  assigned_department?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface ClientTag {
  id: string;
  client_id: string;
  tag: string;
}

interface ClientDepartment {
  id: string;
  client_id: string;
  department_name: string;
}

export const useClientData = () => {
  const { profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clientTags, setClientTags] = useState<ClientTag[]>([]);
  const [clientDepartments, setClientDepartments] = useState<ClientDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchClientData();
    }
  }, [profile]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('[useClientData] Fetching client data...');

      // Fetch clients using generic typing
      const { data: clientsData, error: clientsError } = await (supabase as any)
        .from('clients')
        .select('*')
        .order('name');

      if (clientsError) {
        console.error('[useClientData] Error fetching clients:', clientsError);
        setError('Failed to fetch clients');
        return;
      }

      // Fetch projects using generic typing
      const { data: projectsData, error: projectsError } = await (supabase as any)
        .from('projects')
        .select('*')
        .order('name');

      if (projectsError) {
        console.error('[useClientData] Error fetching projects:', projectsError);
        setError('Failed to fetch projects');
        return;
      }

      // Fetch client tags using generic typing
      const { data: tagsData, error: tagsError } = await (supabase as any)
        .from('client_tags')
        .select('*');

      if (tagsError) {
        console.error('[useClientData] Error fetching client tags:', tagsError);
      }

      // Fetch client departments using generic typing
      const { data: deptsData, error: deptsError } = await (supabase as any)
        .from('client_departments')
        .select('*');

      if (deptsError) {
        console.error('[useClientData] Error fetching client departments:', deptsError);
      }

      console.log('[useClientData] Successfully fetched data:', {
        clients: clientsData?.length,
        projects: projectsData?.length,
        tags: tagsData?.length,
        departments: deptsData?.length
      });

      setClients(clientsData || []);
      setProjects(projectsData || []);
      setClientTags(tagsData || []);
      setClientDepartments(deptsData || []);
    } catch (err) {
      console.error('[useClientData] Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const logAction = async (action: string, tableName: string, recordId: string, newValues?: any, oldValues?: any) => {
    try {
      await (supabase as any)
        .from('audit_logs')
        .insert([{
          user_id: profile?.id,
          action: action,
          table_name: tableName,
          record_id: recordId,
          new_values: newValues,
          old_values: oldValues
        }]);
    } catch (err) {
      console.error('Failed to log action:', err);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await (supabase as any)
        .from('clients')
        .insert([client])
        .select()
        .single();

      if (error) {
        console.error('[useClientData] Error adding client:', error);
        return false;
      }

      setClients(prev => [...prev, data]);
      await logAction('client_create', 'clients', data.id, data);
      return true;
    } catch (err) {
      console.error('[useClientData] Unexpected error adding client:', err);
      return false;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      // Get old data first
      const oldClient = clients.find(c => c.id === id);
      
      const { data, error } = await (supabase as any)
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[useClientData] Error updating client:', error);
        return false;
      }

      setClients(prev => prev.map(c => c.id === id ? data : c));
      await logAction('client_update', 'clients', id, data, oldClient);
      return true;
    } catch (err) {
      console.error('[useClientData] Unexpected error updating client:', err);
      return false;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // Get old data first
      const oldClient = clients.find(c => c.id === id);
      
      const { error } = await (supabase as any)
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[useClientData] Error deleting client:', error);
        return false;
      }

      setClients(prev => prev.filter(c => c.id !== id));
      await logAction('client_delete', 'clients', id, null, oldClient);
      return true;
    } catch (err) {
      console.error('[useClientData] Unexpected error deleting client:', err);
      return false;
    }
  };

  const addClientTag = async (clientId: string, tag: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('client_tags')
        .insert([{ client_id: clientId, tag }])
        .select()
        .single();

      if (error) {
        console.error('[useClientData] Error adding client tag:', error);
        return false;
      }

      setClientTags(prev => [...prev, data]);
      await logAction('client_tag_create', 'client_tags', data.id, data);
      return true;
    } catch (err) {
      console.error('[useClientData] Unexpected error adding client tag:', err);
      return false;
    }
  };

  const removeClientTag = async (clientId: string, tag: string) => {
    try {
      // Get old data first
      const oldTag = clientTags.find(t => t.client_id === clientId && t.tag === tag);
      
      const { error } = await (supabase as any)
        .from('client_tags')
        .delete()
        .eq('client_id', clientId)
        .eq('tag', tag);

      if (error) {
        console.error('[useClientData] Error removing client tag:', error);
        return false;
      }

      setClientTags(prev => prev.filter(t => !(t.client_id === clientId && t.tag === tag)));
      await logAction('client_tag_delete', 'client_tags', oldTag?.id || '', null, oldTag);
      return true;
    } catch (err) {
      console.error('[useClientData] Unexpected error removing client tag:', err);
      return false;
    }
  };

  const getClientTags = (clientId: string) => {
    return clientTags.filter(t => t.client_id === clientId).map(t => t.tag);
  };

  const getClientProjects = (clientId: string) => {
    return projects.filter(p => p.client_id === clientId);
  };

  const getClientDepartments = (clientId: string) => {
    return clientDepartments.filter(d => d.client_id === clientId).map(d => d.department_name);
  };

  return {
    clients,
    projects,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    addClientTag,
    removeClientTag,
    getClientTags,
    getClientProjects,
    getClientDepartments,
    refetch: fetchClientData
  };
};
