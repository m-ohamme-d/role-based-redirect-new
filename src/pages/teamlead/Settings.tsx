
import SettingsLayout from '@/components/layouts/SettingsLayout';
import { useAuth } from '@/contexts/AuthContext';

const TeamLeadSettings = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <SettingsLayout role="teamlead" />
    </div>
  );
};

export default TeamLeadSettings;
