
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layouts/MainLayout';
import { Home, Users, FileText, HelpCircle, Settings, User, Bell, Building } from 'lucide-react';

const ManagerLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'manager') {
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
    <MainLayout links={sidebarLinks} role="manager" userName={user.name} />
  );
};

export default ManagerLayout;
