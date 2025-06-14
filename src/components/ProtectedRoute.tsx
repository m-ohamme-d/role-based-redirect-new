
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
      if (!profile) {
        navigate('/login');
        return;
      }

      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Redirect to appropriate dashboard based on role
        switch (profile.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'manager':
            navigate('/manager/dashboard');
            break;
          case 'teamlead':
            navigate('/teamlead/dashboard');
            break;
          default:
            navigate('/login');
        }
      }
    }
  }, [profile, loading, allowedRoles, navigate]);

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
