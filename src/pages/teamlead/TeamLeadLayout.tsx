
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Home, Users, FileText, HelpCircle, Settings, User, Building } from 'lucide-react';

const TeamLeadLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'teamlead') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

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
    <MainLayout links={sidebarLinks} role="teamlead" userName={user.name} />
  );
};

export default TeamLeadLayout;
