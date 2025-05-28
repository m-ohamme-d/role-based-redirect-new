
import { useState, useEffect } from 'react';
import { departmentStore } from '../stores/departmentStore';

export const useDepartments = () => {
  const [departments, setDepartments] = useState<string[]>(departmentStore.getDepartments());

  useEffect(() => {
    const unsubscribe = departmentStore.subscribe(() => {
      setDepartments(departmentStore.getDepartments());
    });

    return unsubscribe;
  }, []);

  const addDepartment = (name: string) => {
    return departmentStore.addDepartment(name);
  };

  const updateDepartment = (oldName: string, newName: string) => {
    return departmentStore.updateDepartment(oldName, newName);
  };

  const deleteDepartment = (name: string) => {
    return departmentStore.deleteDepartment(name);
  };

  return {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  };
};
