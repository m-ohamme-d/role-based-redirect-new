import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types/manager';

export const useManagerClients = () => {
  const { clients: realClients, createClient, updateClient, deleteClient, addProject, updateProject } = useClients();
  const [clients, setClients] = useState<Client[]>([]);

  // Client data (previously differentiated as mock/real)
  const mockClients: Client[] = [
    {
      id: 'mock-1',
      name: 'TechCorp Solutions',
      company: 'TechCorp Inc.',
      status: 'active',
      assigned_departments: ['IT', 'Marketing'],
      tags: ['Enterprise', 'Technology', 'Priority'],
      contact_email: 'contact@techcorp.com',
      contact_phone: '+1 (555) 123-4567',
      projects: [
        { id: 'proj-1', name: 'Enterprise Dashboard', status: 'active' },
        { id: 'proj-2', name: 'Mobile App', status: 'active' }
      ],
    },
    {
      id: 'mock-2',
      name: 'HealthCare Inc',
      company: 'HealthCare Systems',
      status: 'active',
      assigned_departments: ['IT'],
      tags: ['Healthcare', 'Compliance'],
      contact_email: 'info@healthcare.com',
      contact_phone: '+1 (555) 987-6543',
      projects: [
        { id: 'proj-3', name: 'Patient Portal', status: 'active' }
      ],
    },
    {
      id: 'mock-3',
      name: 'Retail Masters',
      company: 'Retail Solutions Ltd',
      status: 'inactive',
      assigned_departments: ['Sales', 'Marketing'],
      tags: ['Retail', 'E-commerce'],
      contact_email: 'support@retailmasters.com',
      contact_phone: '+1 (555) 456-7890',
      projects: [
        { id: 'proj-4', name: 'E-commerce Platform', status: 'stopped' }
      ],
      
    }
  ];

  // Filter and merge client data
  const mergeClientsData = useCallback(() => {
    // Merge all clients together (no distinction between sources)
    const mergedClients = [...mockClients, ...realClients];
    setClients(mergedClients);
  }, [realClients]);

  useEffect(() => {
    mergeClientsData();
  }, [mergeClientsData]);

  // Set up real-time subscription for clients data  
  useEffect(() => {
    const channel = supabase
      .channel(`manager-clients-updates-${Date.now()}-${Math.random()}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Client change detected:', payload);
          toast.info('Client data updated');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up client subscription');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array to avoid re-subscribing

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    // Check if it's a real client (has UUID format) vs. mock client (has 'mock-' prefix)
    const isRealClient = !clientId.startsWith('mock-');
    
    if (isRealClient) {
      // Handle real client deletion via Supabase
      await deleteClient(clientId);
    } else {
      // Handle local client deletion by removing from state
      setClients(clients.filter(c => c.id !== clientId));
      toast.success('Client deleted successfully');
    }
  };

  const toggleClientStatus = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const isRealClient = !clientId.startsWith('mock-');
    
    if (isRealClient) {
      // Update real client via Supabase
      await updateClient(clientId, {
        status: client.status === 'active' ? 'inactive' : 'active'
      });
    } else {
      // Update local client in state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      ));
      toast.success('Client status updated');
    }
  };

  const removeTagFromClient = async (clientId: string, tagToRemove: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const isRealClient = !clientId.startsWith('mock-');
    
    if (isRealClient) {
      // Update real client via Supabase
      await updateClient(clientId, {
        tags: client.tags?.filter(tag => tag !== tagToRemove)
      });
    } else {
      // Update local client in state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, tags: c.tags?.filter(tag => tag !== tagToRemove) }
          : c
      ));
      toast.success('Tag removed');
    }
  };

  const handleClientUpdate = (updatedClient: Client) => {
    const isRealClient = !updatedClient.id.startsWith('mock-');
    
    if (isRealClient) {
      // Update real client via Supabase
      updateClient(updatedClient.id, updatedClient);
    } else {
      // Update local client in state
      setClients(clients.map(c => 
        c.id === updatedClient.id ? updatedClient : c
      ));
      toast.success('Client updated successfully');
    }
  };

  const handleProjectAdd = async (clientId: string, projectData: any) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const isRealClient = !clientId.startsWith('mock-');
    
    if (isRealClient) {
      // Add project via Supabase
      await addProject(clientId, projectData);
    } else {
      // Add project to local client
      const newProject = {
        id: `proj-${Date.now()}`,
        name: projectData.name,
        status: projectData.status,
        assigned_department_id: projectData.assigned_department_id
      };
      
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, projects: [...(c.projects || []), newProject] }
          : c
      ));
      toast.success('Project added successfully');
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: any) => {
    // Find the client that contains this project
    const client = clients.find(c => 
      c.projects?.some(p => p.id === projectId)
    );
    
    if (!client) return;

    const isRealClient = !client.id.startsWith('mock-');
    
    if (isRealClient) {
      // Update project via Supabase
      await updateProject(projectId, updates);
    } else {
      // Update project in local client
      setClients(clients.map(c => 
        c.id === client.id 
          ? {
              ...c, 
              projects: c.projects?.map(p => 
                p.id === projectId ? { ...p, ...updates } : p
              )
            }
          : c
      ));
      toast.success('Project updated successfully');
    }
  };

  return {
    clients,
    createClient,
    updateClient,
    handleDeleteClient,
    toggleClientStatus,
    removeTagFromClient,
    handleClientUpdate,
    handleProjectAdd,
    handleProjectUpdate
  };
};