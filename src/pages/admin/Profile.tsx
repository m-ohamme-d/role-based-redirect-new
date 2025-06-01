
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '@/components/layouts/ProfileSettings';

const AdminProfile = () => {
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
      <ProfileSettings userData={user} />
    </div>
  );
};

export default AdminProfile;
