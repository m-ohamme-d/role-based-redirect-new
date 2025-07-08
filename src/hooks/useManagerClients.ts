import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types/manager';

export const useManagerClients = () => {
  const { clients: realClients, createClient, updateClient, deleteClient, addProject, updateProject } = useClients();
  const [clients, setClients] = useState<Client[]>([]);

  // Use only real Supabase data, no mock data to avoid duplicates
  const mergeClientsData = useCallback(() => {
    setClients(realClients);
  }, [realClients]);

  useEffect(() => {
    mergeClientsData();
  }, [mergeClientsData]);

  // No need for separate subscription since useClients already handles real-time updates

  const handleDeleteClient = async (clientId: string) => {
    await deleteClient(clientId);
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Project deleted successfully');
      return true;
    } catch (err: any) {
      toast.error(err.message);
      return false;
    }
  };

  const toggleClientStatus = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    await updateClient(clientId, {
      status: client.status === 'active' ? 'inactive' : 'active'
    });
  };

  const removeTagFromClient = async (clientId: string, tagToRemove: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    await updateClient(clientId, {
      tags: client.tags?.filter(tag => tag !== tagToRemove)
    });
  };

  const handleClientUpdate = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient);
  };

  const handleProjectAdd = async (clientId: string, projectData: any) => {
    await addProject(clientId, projectData);
  };

  const handleProjectUpdate = async (projectId: string, updates: any) => {
    await updateProject(projectId, updates);
  };

  return {
    clients,
    createClient,
    updateClient,
    handleDeleteClient,
    handleDeleteProject,
    toggleClientStatus,
    removeTagFromClient,
    handleClientUpdate,
    handleProjectAdd,
    handleProjectUpdate
  };
};