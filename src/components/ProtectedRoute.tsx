
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log('[ProtectedRoute] Auth loaded, profile:', profile?.role);
      
      if (!profile) {
        console.log('[ProtectedRoute] No profile, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        console.log('[ProtectedRoute] Role not allowed, redirecting based on role:', profile.role);
        // Redirect to appropriate dashboard based on role
        switch (profile.role) {
          case 'admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'manager':
            navigate('/manager/dashboard', { replace: true });
            break;
          case 'teamlead':
            navigate('/teamlead/dashboard', { replace: true });
            break;
          default:
            navigate('/login', { replace: true });
        }
      }
    }
  }, [profile, loading, allowedRoles, navigate]);

  // Show loading with a minimum time to prevent flashing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile || (allowedRoles && !allowedRoles.includes(profile.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
