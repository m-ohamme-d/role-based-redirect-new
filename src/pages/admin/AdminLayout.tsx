
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Home, Users, FileText, Activity, Settings } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

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
      to: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar links={adminLinks} role="admin" userName={user.name} />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-purple-50 via-white to-red-50">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
