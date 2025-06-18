
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Users, FileText, HelpCircle, Settings, User, Building } from 'lucide-react';

const TeamLeadLayout = () => {
  const { profile } = useAuth();

  const sidebarLinks = [
    { to: "/teamlead/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { to: "/teamlead/team", icon: <Users size={20} />, label: "Team List" },
    { to: "/teamlead/clients", icon: <Building size={20} />, label: "Clients" },
    { to: "/teamlead/reports", icon: <FileText size={20} />, label: "Reports" },
    { to: "/teamlead/support", icon: <HelpCircle size={20} />, label: "Support" },
    { to: "/teamlead/settings", icon: <Settings size={20} />, label: "Settings" },
    { to: "/teamlead/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <ProtectedRoute allowedRoles={['teamlead']}>
      <MainLayout links={sidebarLinks} role="Team Lead" userName={profile?.name || 'Team Lead'} />
    </ProtectedRoute>
  );
};

export default TeamLeadLayout;
