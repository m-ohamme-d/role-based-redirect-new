
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Users, FileText, HelpCircle, Settings, User, Bell, Building } from 'lucide-react';

const ManagerLayout = () => {
  const { profile } = useAuth();

  const sidebarLinks = [
    { to: "/manager/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/manager/team", icon: <Users size={20} />, label: "Team" },
    { to: "/manager/clients", icon: <Building size={20} />, label: "Clients" },
    { to: "/manager/alerts", icon: <Bell size={20} />, label: "Alerts" },
    { to: "/manager/notifications", icon: <Bell size={20} />, label: "Notifications" },
    { to: "/manager/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/manager/support", icon: <HelpCircle size={20} />, label: "Support" },
    { to: "/manager/settings", icon: <Settings size={20} />, label: "Settings" },
    { to: "/manager/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <MainLayout links={sidebarLinks} role="Manager" userName={profile?.name || 'Manager'} />
    </ProtectedRoute>
  );
};

export default ManagerLayout;
