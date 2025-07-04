// Internationalization utilities and translations
// This provides a foundation for future multi-language support

export const TRANSLATIONS: Record<string, string> = {
  // Dashboard
  'Dashboard.welcome': 'Welcome to your dashboard',
  'Dashboard.refresh': 'Refresh',
  'Dashboard.loading': 'Loading...',
  'Dashboard.error': 'Error loading data',
  
  // Navigation
  'Nav.dashboard': 'Dashboard',
  'Nav.clients': 'Clients',
  'Nav.employees': 'Employees',
  'Nav.departments': 'Departments',
  'Nav.teams': 'Teams',
  'Nav.reports': 'Reports',
  'Nav.settings': 'Settings',
  'Nav.profile': 'Profile',
  'Nav.logout': 'Logout',
  
  // Actions
  'Action.add': 'Add',
  'Action.edit': 'Edit',
  'Action.delete': 'Delete',
  'Action.save': 'Save',
  'Action.cancel': 'Cancel',
  'Action.view': 'View',
  'Action.download': 'Download',
  'Action.export': 'Export',
  
  // Status
  'Status.active': 'Active',
  'Status.inactive': 'Inactive',
  'Status.pending': 'Pending',
  'Status.completed': 'Completed',
  'Status.paused': 'Paused',
  
  // Messages
  'Message.success': 'Operation completed successfully',
  'Message.error': 'An error occurred',
  'Message.confirm': 'Are you sure?',
  'Message.noData': 'No data available',
  
  // Accessibility
  'A11y.menu': 'Main menu',
  'A11y.close': 'Close',
  'A11y.open': 'Open',
  'A11y.search': 'Search',
  'A11y.filter': 'Filter',
  'A11y.sort': 'Sort',
};

// Translation function
export const t = (key: string, fallback?: string): string => {
  return TRANSLATIONS[key] ?? fallback ?? key;
};

// Get translation with ARIA label support
export const getAriaLabel = (key: string, fallback?: string): string => {
  return t(key, fallback);
};

// Format function for interpolation (future enhancement)
export const tf = (key: string, values: Record<string, string | number> = {}): string => {
  let translation = t(key);
  
  Object.entries(values).forEach(([placeholder, value]) => {
    translation = translation.replace(`{{${placeholder}}}`, String(value));
  });
  
  return translation;
};

// Locale detection (for future use)
export const getLocale = (): string => {
  return navigator.language || 'en-US';
};

// Date/time formatting helpers
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
  const locale = getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }).format(dateObj);
};

export const formatTime = (date: Date | string): string => {
  const locale = getLocale();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Number formatting
export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
  const locale = getLocale();
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatCurrency = (value: number, currency = 'USD'): string => {
  return formatNumber(value, {
    style: 'currency',
    currency
  });
};

export const formatPercentage = (value: number): string => {
  return formatNumber(value, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  });
};