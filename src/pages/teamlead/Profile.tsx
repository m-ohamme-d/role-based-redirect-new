
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '@/components/layouts/ProfileSettings';

const TeamLeadProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <ProfileSettings userData={user} />
    </div>
  );
};

export default TeamLeadProfile;
