// Unified API module - switches between mock and real Supabase data
import { supabase } from './supabase/client';

// Configuration - in a real app, these would come from environment variables
const useMock = false; // Set to true to use mock data
const mockBase = 'http://localhost:4000';

export const api = {
  // Profile operations
  getProfile: async () => {
    if (useMock) {
      return fetch(`${mockBase}/profiles/1`).then(r => r.json());
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    return data;
  },

  // Client operations
  listClients: async () => {
    if (useMock) {
      return fetch(`${mockBase}/clients`).then(r => r.json());
    }
    
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return data;
  },

  updateClient: async (client: { id: string; name: string; status: string }) => {
    if (useMock) {
      return fetch(`${mockBase}/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      }).then(r => r.json());
    }
    
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', client.id);
      
    if (error) throw error;
    return data;
  },

  createClient: async (client: { 
    name: string; 
    company: string; 
    status?: string; 
    contact_email?: string; 
    contact_phone?: string; 
    tags?: string[]; 
    assigned_departments?: string[] 
  }) => {
    if (useMock) {
      return fetch(`${mockBase}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      }).then(r => r.json());
    }
    
    const { data, error } = await supabase.from('clients').insert(client);
    if (error) throw error;
    return data;
  },

  deleteClient: async (id: string) => {
    if (useMock) {
      return fetch(`${mockBase}/clients/${id}`, { method: 'DELETE' });
    }
    
    const { data, error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
    return data;
  },

  // Department operations
  listDepartments: async () => {
    if (useMock) {
      return fetch(`${mockBase}/departments`).then(r => r.json());
    }
    
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data;
  },

  // Employee operations
  listEmployees: async () => {
    if (useMock) {
      return fetch(`${mockBase}/employees`).then(r => r.json());
    }
    
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        profiles!inner(name, email, role),
        departments(name)
      `)
      .order('created_at');
      
    if (error) throw error;
    return data;
  },

  // Project operations
  listProjects: async () => {
    if (useMock) {
      return fetch(`${mockBase}/projects`).then(r => r.json());
    }
    
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  },

  // Team operations
  listTeams: async () => {
    if (useMock) {
      return fetch(`${mockBase}/teams`).then(r => r.json());
    }
    
    const { data, error } = await supabase.from('teams').select('*');
    if (error) throw error;
    return data;
  },
};