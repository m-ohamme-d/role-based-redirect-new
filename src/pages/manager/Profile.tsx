
import { useAuth } from '@/contexts/AuthContext';
import ProfileSettings from '@/components/layouts/ProfileSettings';

const ManagerProfile = () => {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <ProfileSettings userData={{
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role
      }} />
    </div>
  );
};

export default ManagerProfile;
