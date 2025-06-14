import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    console.log('[Index] EFFECT: profile:', profile, 'loading:', loading, 'hasRedirected:', hasRedirectedRef.current);

    if (loading || hasRedirectedRef.current) {
      console.log('[Index] Skipping redirect. loading:', loading, 'hasRedirected:', hasRedirectedRef.current);
      return;
    }

    if (profile) {
      hasRedirectedRef.current = true;
      setRedirecting(true);
      console.log('[Index] Redirecting to dashboard for role:', profile.role);
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
      hasRedirectedRef.current = true;
      setRedirecting(true);
      console.log('[Index] No profile, redirecting to /login');
      navigate('/login', { replace: true });
    }
  }, [profile, loading, navigate]);

  // Prevent further rendering after redirect to break redirect loops
  if (redirecting) {
    console.log('[Index] RETURNING null post-redirect');
    return null;
  }

  console.log('[Index] RENDER: Showing loading spinner. loading:', loading, 'redirecting:', redirecting);

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
