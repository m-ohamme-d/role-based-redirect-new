
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only attempt redirect when NOT loading and haven't already redirected
    if (loading) return; // IMPORTANT: absolutely never redirect while loading
    if (hasRedirectedRef.current) return;

    // After loading is done—proceed with redirects
    if (profile) {
      hasRedirectedRef.current = true;
      setRedirecting(true);
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
    } else {
      // No profile found AFTER loading is finished
      hasRedirectedRef.current = true;
      setRedirecting(true);
      navigate('/login', { replace: true });
    }
  }, [profile, loading, navigate]);

  if (redirecting) {
    return null;
  }

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
