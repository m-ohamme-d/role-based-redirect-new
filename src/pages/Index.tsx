
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirectedRef.current || loading) return;

    console.log('Index - Auth state:', { profile, loading });
    
    // Set the flag immediately to prevent duplicate runs
    hasRedirectedRef.current = true;
    
    if (profile) {
      console.log('Redirecting user with role:', profile.role);
      
      // Use setTimeout to defer navigation and prevent rapid calls
      const timer = setTimeout(() => {
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
      }, 50);

      return () => clearTimeout(timer);
    } else {
      console.log('No profile found, redirecting to login');
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [profile, loading, navigate]);

  // Reset the redirect flag when component unmounts
  useEffect(() => {
    return () => {
      hasRedirectedRef.current = false;
    };
  }, []);

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
