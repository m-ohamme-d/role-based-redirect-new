
// Centralized department store for real-time synchronization
class DepartmentStore {
  private departments: string[] = [
    'IT',
    'HR', 
    'Sales',
    'Marketing',
    'Finance',
    'Administration'
  ];
  
  private listeners: Set<() => void> = new Set();

  // Subscribe to department changes
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all subscribers of changes
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Get all departments
  getDepartments(): string[] {
    return [...this.departments];
  }

  // Add new department
  addDepartment(name: string): boolean {
    const trimmedName = name.trim();
    if (trimmedName && !this.departments.includes(trimmedName)) {
      this.departments.push(trimmedName);
      console.log('Department added globally:', trimmedName);
      console.log('Updated departments list:', this.departments);
      this.notify();
      return true;
    }
    return false;
  }

  // Update department name
  updateDepartment(oldName: string, newName: string): boolean {
    const trimmedNewName = newName.trim();
    const index = this.departments.indexOf(oldName);
    
    if (index !== -1 && trimmedNewName && !this.departments.includes(trimmedNewName)) {
      this.departments[index] = trimmedNewName;
      console.log('Department updated globally:', { oldName, newName: trimmedNewName });
      console.log('Updated departments list:', this.departments);
      this.notify();
      return true;
    }
    return false;
  }

  // Delete department
  deleteDepartment(name: string): boolean {
    const index = this.departments.indexOf(name);
    if (index !== -1) {
      this.departments.splice(index, 1);
      console.log('Department deleted globally:', name);
      console.log('Updated departments list:', this.departments);
      this.notify();
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const departmentStore = new DepartmentStore();
