
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
}

export const useAuditLogger = () => {
  const { user } = useAuth();

  const logAction = async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      const { error } = await (supabase as any)
        .from('audit_logs')
        .insert([{
          user_id: user.id,
          action: entry.action,
          table_name: entry.table_name,
          record_id: entry.record_id,
          old_values: entry.old_values,
          new_values: entry.new_values
        }]);

      if (error) {
        console.error('[AuditLogger] Error logging action:', error);
      } else {
        console.log('[AuditLogger] Action logged:', entry.action);
      }
    } catch (err) {
      console.error('[AuditLogger] Unexpected error:', err);
    }
  };

  const logClientAction = async (action: string, clientData: any, oldData?: any) => {
    await logAction({
      action: `client_${action}`,
      table_name: 'clients',
      record_id: clientData.id,
      new_values: clientData,
      old_values: oldData
    });
  };

  const logProjectAction = async (action: string, projectData: any, oldData?: any) => {
    await logAction({
      action: `project_${action}`,
      table_name: 'projects',
      record_id: projectData.id,
      new_values: projectData,
      old_values: oldData
    });
  };

  const logDepartmentAction = async (action: string, deptData: any, oldData?: any) => {
    await logAction({
      action: `department_${action}`,
      table_name: 'departments',
      record_id: deptData.id,
      new_values: deptData,
      old_values: oldData
    });
  };

  const logUserAction = async (action: string, description: string) => {
    await logAction({
      action: action,
      table_name: 'user_actions',
      new_values: { description, timestamp: new Date().toISOString() }
    });
  };

  return {
    logAction,
    logClientAction,
    logProjectAction,
    logDepartmentAction,
    logUserAction
  };
};
