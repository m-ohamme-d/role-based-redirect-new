
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // No spinner fallback here—Navigate immediately unmounts Index
  if (!profile) {
    return <Navigate to="/login" replace />;
  }
  if (profile.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (profile.role === 'manager') {
    return <Navigate to="/manager/dashboard" replace />;
  }
  if (profile.role === 'teamlead') {
    return <Navigate to="/teamlead/dashboard" replace />;
  }

  // Fallback to login if an unknown role is detected
  return <Navigate to="/login" replace />;
}
