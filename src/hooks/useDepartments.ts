
import { useSupabaseDepartments } from './useSupabaseDepartments';

// Backwards compatibility wrapper for the old useDepartments hook
export const useDepartments = () => {
  const { departmentNames, addDepartment, updateDepartment, deleteDepartment } = useSupabaseDepartments();

  // Convert new API to old API format for backwards compatibility
  const updateDepartmentByName = (oldName: string, newName: string) => {
    // This requires finding the department ID first, which is more complex
    // For now, we'll maintain backward compatibility by keeping department names
    console.warn('updateDepartment by name is deprecated, use updateDepartment with ID instead');
    return Promise.resolve(false);
  };

  const deleteDepartmentByName = (name: string) => {
    console.warn('deleteDepartment by name is deprecated, use deleteDepartment with ID instead');
    return Promise.resolve(false);
  };

  return {
    departments: departmentNames,
    addDepartment: (name: string) => addDepartment(name),
    updateDepartment: updateDepartmentByName,
    deleteDepartment: deleteDepartmentByName
  };
};
