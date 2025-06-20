
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ReportingMetrics {
  clientMetrics: {
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    clientsByDepartment: { department: string; count: number }[];
  };
  projectMetrics: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    stoppedProjects: number;
    projectsByDepartment: { department: string; count: number }[];
  };
  departmentMetrics: {
    totalDepartments: number;
    totalMembers: number;
    averageMembersPerDept: number;
    departmentSizes: { name: string; memberCount: number }[];
  };
  activityMetrics: {
    totalAuditLogs: number;
    recentActions: number;
    topActions: { action: string; count: number }[];
    userActivity: { userId: string; actionCount: number }[];
  };
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const useReportingData = () => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<ReportingMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportingData = async (dateRange?: { from: Date; to: Date }) => {
    try {
      setLoading(true);
      setError(null);
      console.log('[useReportingData] Fetching reporting data...');

      // Fetch clients data
      const { data: clientsData, error: clientsError } = await (supabase as any)
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      // Fetch projects data
      const { data: projectsData, error: projectsError } = await (supabase as any)
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;

      // Fetch departments data
      const { data: departmentsData, error: departmentsError } = await (supabase as any)
        .from('departments')
        .select('*');

      if (departmentsError) throw departmentsError;

      // Fetch client departments for analytics
      const { data: clientDeptData, error: clientDeptError } = await (supabase as any)
        .from('client_departments')
        .select('*');

      if (clientDeptError) throw clientDeptError;

      // Fetch audit logs data
      const { data: auditData, error: auditError } = await (supabase as any)
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (auditError) throw auditError;

      // Calculate client metrics
      const activeClients = clientsData?.filter((c: any) => c.status === 'active').length || 0;
      const inactiveClients = clientsData?.filter((c: any) => c.status === 'inactive').length || 0;
      
      // Calculate clients by department
      const clientsByDepartment = clientDeptData?.reduce((acc: any, cd: any) => {
        const existing = acc.find((item: any) => item.department === cd.department_name);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ department: cd.department_name, count: 1 });
        }
        return acc;
      }, []) || [];

      // Calculate project metrics
      const activeProjects = projectsData?.filter((p: any) => p.status === 'active').length || 0;
      const completedProjects = projectsData?.filter((p: any) => p.status === 'completed').length || 0;
      const stoppedProjects = projectsData?.filter((p: any) => p.status === 'stopped').length || 0;

      // Calculate projects by department
      const projectsByDepartment = projectsData?.reduce((acc: any, project: any) => {
        if (project.assigned_department) {
          const existing = acc.find((item: any) => item.department === project.assigned_department);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ department: project.assigned_department, count: 1 });
          }
        }
        return acc;
      }, []) || [];

      // Calculate department metrics
      const totalMembers = departmentsData?.reduce((sum: number, dept: any) => sum + (dept.member_count || 0), 0) || 0;
      const averageMembersPerDept = departmentsData?.length > 0 ? Math.round(totalMembers / departmentsData.length) : 0;
      
      const departmentSizes = departmentsData?.map((dept: any) => ({
        name: dept.name,
        memberCount: dept.member_count || 0
      })) || [];

      // Calculate activity metrics
      const recentActions = auditData?.filter((log: any) => {
        const logDate = new Date(log.created_at);
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);
        return logDate >= last7Days;
      }).length || 0;

      // Calculate top actions
      const actionCounts = auditData?.reduce((acc: any, log: any) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      }, {}) || {};

      const topActions = Object.entries(actionCounts)
        .map(([action, count]) => ({ action, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate user activity
      const userCounts = auditData?.reduce((acc: any, log: any) => {
        if (log.user_id) {
          acc[log.user_id] = (acc[log.user_id] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const userActivity = Object.entries(userCounts)
        .map(([userId, count]) => ({ userId, actionCount: count as number }))
        .sort((a, b) => b.actionCount - a.actionCount)
        .slice(0, 10);

      const reportingMetrics: ReportingMetrics = {
        clientMetrics: {
          totalClients: clientsData?.length || 0,
          activeClients,
          inactiveClients,
          clientsByDepartment
        },
        projectMetrics: {
          totalProjects: projectsData?.length || 0,
          activeProjects,
          completedProjects,
          stoppedProjects,
          projectsByDepartment
        },
        departmentMetrics: {
          totalDepartments: departmentsData?.length || 0,
          totalMembers,
          averageMembersPerDept,
          departmentSizes
        },
        activityMetrics: {
          totalAuditLogs: auditData?.length || 0,
          recentActions,
          topActions,
          userActivity
        },
        dateRange: dateRange || {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          to: new Date()
        }
      };

      setMetrics(reportingMetrics);
      console.log('[useReportingData] Reporting data loaded:', reportingMetrics);

    } catch (err) {
      console.error('[useReportingData] Error fetching data:', err);
      setError('Failed to fetch reporting data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) {
      fetchReportingData();
    }
  }, [profile]);

  const generateReport = (type: 'clients' | 'projects' | 'departments' | 'activity') => {
    if (!metrics) return null;

    switch (type) {
      case 'clients':
        return {
          title: 'Client Analytics Report',
          data: metrics.clientMetrics,
          charts: [
            {
              type: 'pie',
              title: 'Client Status Distribution',
              data: [
                { name: 'Active', value: metrics.clientMetrics.activeClients },
                { name: 'Inactive', value: metrics.clientMetrics.inactiveClients }
              ]
            },
            {
              type: 'bar',
              title: 'Clients by Department',
              data: metrics.clientMetrics.clientsByDepartment
            }
          ]
        };

      case 'projects':
        return {
          title: 'Project Analytics Report',
          data: metrics.projectMetrics,
          charts: [
            {
              type: 'pie',
              title: 'Project Status Distribution',
              data: [
                { name: 'Active', value: metrics.projectMetrics.activeProjects },
                { name: 'Completed', value: metrics.projectMetrics.completedProjects },
                { name: 'Stopped', value: metrics.projectMetrics.stoppedProjects }
              ]
            },
            {
              type: 'bar',
              title: 'Projects by Department',
              data: metrics.projectMetrics.projectsByDepartment
            }
          ]
        };

      case 'departments':
        return {
          title: 'Department Analytics Report',
          data: metrics.departmentMetrics,
          charts: [
            {
              type: 'bar',
              title: 'Department Sizes',
              data: metrics.departmentMetrics.departmentSizes.map(d => ({
                name: d.name,
                value: d.memberCount
              }))
            }
          ]
        };

      case 'activity':
        return {
          title: 'System Activity Report',
          data: metrics.activityMetrics,
          charts: [
            {
              type: 'bar',
              title: 'Top Actions',
              data: metrics.activityMetrics.topActions.map(a => ({
                name: a.action,
                value: a.count
              }))
            }
          ]
        };

      default:
        return null;
    }
  };

  return {
    metrics,
    loading,
    error,
    fetchReportingData,
    generateReport,
    refetch: fetchReportingData
  };
};
