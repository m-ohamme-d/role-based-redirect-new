
// Wraps strings for future translation & adds aria-label support
export const TRANSLATIONS: Record<string, string> = {
  // Dashboard
  'Dashboard.welcome': 'Welcome to your dashboard',
  'Dashboard.refresh': 'Refresh',
  'Dashboard.loading': 'Loading...',
  
  // Navigation
  'Nav.dashboard': 'Dashboard',
  'Nav.team': 'Team',
  'Nav.clients': 'Clients',
  'Nav.reports': 'Reports',
  'Nav.settings': 'Settings',
  'Nav.profile': 'Profile',
  'Nav.logout': 'Logout',
  
  // Common Actions
  'Action.save': 'Save',
  'Action.cancel': 'Cancel',
  'Action.delete': 'Delete',
  'Action.edit': 'Edit',
  'Action.add': 'Add',
  'Action.export': 'Export',
  'Action.import': 'Import',
  
  // Messages
  'Message.success': 'Operation completed successfully',
  'Message.error': 'An error occurred',
  'Message.confirm': 'Are you sure?',
  'Message.loading': 'Please wait...',
  
  // Teams
  'Team.management': 'Team Management',
  'Team.performance': 'Team Performance',
  'Team.members': 'Team Members',
  'Team.lead': 'Team Lead',
  
  // Clients
  'Client.management': 'Client Management',
  'Client.active': 'Active',
  'Client.inactive': 'Inactive',
  'Client.contact': 'Contact Information',
  
  // Departments
  'Department.management': 'Department Management',
  'Department.employees': 'Department Employees',
  'Department.performance': 'Department Performance',
};

export const t = (key: string): string => {
  return TRANSLATIONS[key] ?? key;
};

// Utility function for aria-labels
export const ariaLabel = (key: string): { 'aria-label': string } => {
  return { 'aria-label': t(key) };
};

// Utility function for placeholder text
export const placeholder = (key: string): { placeholder: string } => {
  return { placeholder: t(key) };
};
