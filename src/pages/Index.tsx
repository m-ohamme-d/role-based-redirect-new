
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only redirect once and prevent multiple redirects
    if (hasRedirectedRef.current || loading) return;

    console.log('Index - Auth state:', { profile, loading });
    
    if (profile) {
      console.log('Redirecting user with role:', profile.role);
      hasRedirectedRef.current = true;
      
      // Use a single timeout to prevent rapid navigation
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
      }, 100);

      return () => clearTimeout(timer);
    } else {
      console.log('No profile found, redirecting to login');
      hasRedirectedRef.current = true;
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [profile, loading, navigate]);

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
