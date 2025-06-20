
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayout from '@/components/layouts/SettingsLayout';

const TeamLeadSettings = () => {
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
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <SettingsLayout role="teamlead" />
    </div>
  );
};

export default TeamLeadSettings;
