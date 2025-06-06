
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects and wait for auth to load
    if (hasRedirectedRef.current || loading) return;

    console.log('Index - Auth state:', { profile, loading });
    
    // Mark that we've attempted redirect to prevent loops
    hasRedirectedRef.current = true;
    
    // Use a longer delay to ensure auth state is fully settled
    const timer = setTimeout(() => {
      if (profile) {
        console.log('Redirecting user with role:', profile.role);
        
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
            console.log('Unknown role, redirecting to login');
            navigate('/login', { replace: true });
        }
      } else {
        console.log('No profile found, redirecting to login');
        navigate('/login', { replace: true });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [profile, loading, navigate]);

  // Don't reset the flag on unmount to prevent issues during navigation
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {loading ? 'Loading...' : 'Redirecting to your dashboard...'}
        </p>
      </div>
    </div>
  );
};

export default Index;
