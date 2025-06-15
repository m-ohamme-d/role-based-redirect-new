
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
  }, [profile, loading, allowedRoles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile || (allowedRoles && !allowedRoles.includes(profile.role))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
