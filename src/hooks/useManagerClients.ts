import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types/manager';

export const useManagerClients = () => {
  const { clients: realClients, createClient, updateClient, deleteClient, addProject, updateProject } = useClients();
  const [clients, setClients] = useState<Client[]>([]);

  // Mock data to merge with real data
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
      isMock: true
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
      isMock: true
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
      isMock: true
    }
  ];

  // Get deleted mock IDs from localStorage
  const getDeletedMockIds = () => {
    const deleted = localStorage.getItem('deletedMockClients');
    return deleted ? JSON.parse(deleted) : [];
  };

  // Save deleted mock ID to localStorage
  const saveDeletedMockId = (clientId: string) => {
    const deletedIds = getDeletedMockIds();
    if (!deletedIds.includes(clientId)) {
      deletedIds.push(clientId);
      localStorage.setItem('deletedMockClients', JSON.stringify(deletedIds));
    }
  };

  // Filter and merge mock data with real data
  const mergeClientsData = () => {
    const deletedMockIds = getDeletedMockIds();
    const activeMockClients = mockClients.filter(client => !deletedMockIds.includes(client.id));
    
    // Merge mock clients with real clients
    const mergedClients = [...activeMockClients, ...realClients];
    setClients(mergedClients);
  };

  useEffect(() => {
    mergeClientsData();
  }, [realClients]);

  // Set up real-time subscription for clients data  
  useEffect(() => {
    const channel = supabase
      .channel(`manager-clients-updates-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'clients'
        },
        (payload) => {
          console.log('Client change detected:', payload);
          // Refresh the merged data when clients change
          mergeClientsData();
          toast.info('Client data updated');
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up client subscription');
      supabase.removeChannel(channel);
    };
  }, [realClients]);

  const handleDeleteClient = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Handle mock client deletion by saving to localStorage
      saveDeletedMockId(clientId);
      setClients(clients.filter(c => c.id !== clientId));
      toast.success('Mock client removed (will not reappear)');
    } else {
      // Handle real client deletion via Supabase
      await deleteClient(clientId);
    }
  };

  const toggleClientStatus = async (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      ));
      toast.success('Client status updated');
    } else {
      // Update real client via Supabase
      await updateClient(clientId, {
        status: client.status === 'active' ? 'inactive' : 'active'
      });
    }
  };

  const removeTagFromClient = async (clientId: string, tagToRemove: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === clientId 
          ? { ...c, tags: c.tags?.filter(tag => tag !== tagToRemove) }
          : c
      ));
      toast.success('Tag removed');
    } else {
      // Update real client via Supabase
      await updateClient(clientId, {
        tags: client.tags?.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleClientUpdate = (updatedClient: Client) => {
    if (updatedClient.isMock) {
      // Update mock client in local state
      setClients(clients.map(c => 
        c.id === updatedClient.id ? updatedClient : c
      ));
      toast.success('Client updated successfully');
    } else {
      // Update real client via Supabase
      updateClient(updatedClient.id, updatedClient);
    }
  };

  const handleProjectAdd = async (clientId: string, projectData: any) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    if (client.isMock) {
      // Add project to mock client
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
    } else {
      // Add project via Supabase
      await addProject(clientId, projectData);
    }
  };

  const handleProjectUpdate = async (projectId: string, updates: any) => {
    // Find the client that contains this project
    const client = clients.find(c => 
      c.projects?.some(p => p.id === projectId)
    );
    
    if (!client) return;

    if (client.isMock) {
      // Update project in mock client
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
    } else {
      // Update project via Supabase
      await updateProject(projectId, updates);
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