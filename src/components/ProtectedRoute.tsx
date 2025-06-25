
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log('[ProtectedRoute] Auth loaded, profile:', profile?.role);
      
      // If no user at all, redirect to login
      if (!user) {
        console.log('[ProtectedRoute] No user, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      // If user exists but no profile, there might be a profile loading issue
      if (!profile) {
        console.log('[ProtectedRoute] User exists but no profile');
        // Give it a moment for profile to load, then redirect if still no profile
        const timer = setTimeout(() => {
          if (!profile) {
            console.log('[ProtectedRoute] Profile still not loaded, redirecting to login');
            navigate('/login', { replace: true });
          }
        }, 2000);
        return () => clearTimeout(timer);
      }

      // Check role permissions
      if (allowedRoles && !allowedRoles.includes(profile.role)) {
        console.log('[ProtectedRoute] Role not allowed, redirecting based on role:', profile.role);
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
  }, [profile, loading, user, allowedRoles, navigate]);

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

  // If no user or profile mismatch, show redirecting state
  if (!user || !profile || (allowedRoles && !allowedRoles.includes(profile.role))) {
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
