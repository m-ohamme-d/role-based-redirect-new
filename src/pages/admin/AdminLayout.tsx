
import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import { Home, Users, FileText, Activity, Settings, HelpCircle, Bell, Building, User } from 'lucide-react';

const AdminLayout = () => {
  const { profile, loading } = useAuth();

  const adminLinks = [
    {
      to: '/admin/dashboard',
      icon: <Home className="h-5 w-5" />,
      label: 'Dashboard'
    },
    {
      to: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      label: 'Users'
    },
    {
      to: '/admin/departments',
      icon: <Building className="h-5 w-5" />,
      label: 'Departments'
    },
    {
      to: '/admin/records',
      icon: <FileText className="h-5 w-5" />,
      label: 'Records'
    },
    {
      to: '/admin/audit-log',
      icon: <Activity className="h-5 w-5" />,
      label: 'Audit Log'
    },
    {
      to: '/admin/notifications',
      icon: <Bell className="h-5 w-5" />,
      label: 'Notifications'
    },
    {
      to: '/admin/reports',
      icon: <FileText className="h-5 w-5" />,
      label: 'Reports'
    },
    {
      to: '/admin/support',
      icon: <HelpCircle className="h-5 w-5" />,
      label: 'Support'
    },
    {
      to: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings'
    },
    {
      to: '/admin/profile',
      icon: <User className="h-5 w-5" />,
      label: 'Profile'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout links={adminLinks} role="Admin" userName={profile?.name || 'Admin'}>
        <Outlet />
      </MainLayout>
    </ProtectedRoute>
  );
};

export default AdminLayout;
