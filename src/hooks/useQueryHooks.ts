
// Enhanced React Query hooks for all data operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/integrations/api';
import { toast } from 'sonner';

// Client hooks
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: api.listClients,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update client');
    },
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create client');
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete client');
    },
  });
}

// Department hooks
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: api.listDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutes (departments change less frequently)
    retry: 2,
  });
}

// Employee hooks
export function useEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: api.listEmployees,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// Project hooks
export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: api.listProjects,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// Team hooks
export function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: api.listTeams,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

// Profile hooks
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}

// Generic hook for invalidating multiple queries
export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  
  return (queryKeys: string[][]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };
}

// Hook for refetching all dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();
  
  return () => {
    const dashboardQueries = [
      ['clients'],
      ['employees'],
      ['departments'],
      ['projects'],
      ['teams'],
      ['profile']
    ];
    
    dashboardQueries.forEach(key => {
      queryClient.invalidateQueries({ queryKey: key });
    });
    
    toast.success('Dashboard data refreshed');
  };
}
