import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ManagerStats {
  totalEmployees: number;
  newEmployees: number;
  departmentCount: number;
  averagePerformance: number;
  employeeGrowthText: string;
  employeeTrend: "up" | "down" | "neutral";
  newEmployeeGrowthText: string;
  newEmployeeTrend: "up" | "down" | "neutral";
  performanceChangeText: string;
  performanceTrend: "up" | "down" | "neutral";
  employeeOverviewData: Array<{ name: string; value: number }>;
  employeeProgressData: Array<{ name: string; value: number }>;
  clientsData: Array<{
    id: number;
    name: string;
    company: string;
    status: string;
    projects: Array<{ id: number; name: string; status: string }>;
  }>;
  departments: Array<{
    id: number;
    name: string;
    employeeCount: number;
    growth: string;
    trend: "up" | "down" | "neutral";
  }>;
}

export function useManagerData() {
  const sb = supabase as any;
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setStats({
        totalEmployees: 107,
        newEmployees: 12,
        departmentCount: 5,
        averagePerformance: 78,
        employeeGrowthText: "+5.3% from last month",
        employeeTrend: "up",
        newEmployeeGrowthText: "+2 from last week",
        newEmployeeTrend: "up",
        performanceChangeText: "+2.5% from last quarter",
        performanceTrend: "up",
        employeeOverviewData: [
          { name: 'Jan', value: 65 },
          { name: 'Feb', value: 59 },
          { name: 'Mar', value: 80 },
          { name: 'Apr', value: 81 },
          { name: 'May', value: 56 },
          { name: 'Jun', value: 55 },
          { name: 'Jul', value: 40 },
        ],
        employeeProgressData: [
          { name: 'IT', value: 85 },
          { name: 'HR', value: 65 },
          { name: 'Sales', value: 76 },
          { name: 'Marketing', value: 90 },
          { name: 'Finance', value: 70 },
        ],
        clientsData: [
          {
            id: 1,
            name: 'TechCorp Solutions',
            company: 'TechCorp Inc.',
            status: 'working',
            projects: [
              { id: 1, name: 'Mobile App Development', status: 'working' },
              { id: 2, name: 'Web Platform Redesign', status: 'working' }
            ]
          },
          {
            id: 2,
            name: 'HealthCare Inc',
            company: 'HealthCare Systems',
            status: 'working',
            projects: [
              { id: 3, name: 'Patient Management System', status: 'working' },
              { id: 4, name: 'Telemedicine Platform', status: 'stopped' }
            ]
          },
          {
            id: 3,
            name: 'Finance Plus',
            company: 'Financial Services Ltd',
            status: 'stopped',
            projects: [
              { id: 5, name: 'Trading Platform', status: 'stopped' }
            ]
          },
          {
            id: 4,
            name: 'Retail Masters',
            company: 'Retail Solutions',
            status: 'working',
            projects: [
              { id: 6, name: 'E-commerce Migration', status: 'working' }
            ]
          },
        ],
        departments: [
          { id: 1, name: 'IT', employeeCount: 35, growth: '+5%', trend: 'up' },
          { id: 2, name: 'HR', employeeCount: 12, growth: '-2%', trend: 'down' },
          { id: 3, name: 'Sales', employeeCount: 28, growth: '+10%', trend: 'up' },
          { id: 4, name: 'Marketing', employeeCount: 18, growth: '+3%', trend: 'up' },
          { id: 5, name: 'Finance', employeeCount: 14, growth: '0%', trend: 'neutral' },
        ]
      });
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: departmentsData, error: deptError } = await sb.from('departments').select('*');
      const { data: clientsData, error: clientError } = await sb.from('clients').select('*, projects(*)');
      if (deptError || clientError) {
        setError('Failed to fetch data');
      } else {
        setDepartments(departmentsData || []);
        setClients(clientsData || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Example CRUD
  const addDepartment = async (name: string) => {
    return sb.from('departments').insert([{ name }]);
  };
  const updateDepartment = async (id: string, updates: any) => {
    return sb.from('departments').update(updates).eq('id', id);
  };
  const deleteDepartment = async (id: string) => {
    return sb.from('departments').delete().eq('id', id);
  };

  return { stats, departments, clients, loading, error, addDepartment, updateDepartment, deleteDepartment };
}
