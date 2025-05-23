
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Home, Users, Settings, User } from 'lucide-react';

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
    { to: "/teamlead/team", icon: <Users size={20} />, label: "Teams" },
    { to: "/teamlead/settings", icon: <Settings size={20} />, label: "Settings" },
    { to: "/teamlead/profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={sidebarLinks} role="teamlead" userName={user.name} />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TeamLeadLayout;
