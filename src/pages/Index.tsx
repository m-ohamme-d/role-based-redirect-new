
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  // Debug effect for development
  useEffect(() => {
    console.log('[Index] Effect - loading:', loading, 'profile:', profile, 'redirecting:', redirecting, 'hasRedirected:', hasRedirectedRef.current);
  }, [profile, loading, redirecting]);

  useEffect(() => {
    if (typeof loading === "undefined" || loading) {
      return;
    }

    // Reset redirecting on every fresh load
    setRedirecting(false);
    hasRedirectedRef.current = false;
    // eslint-disable-next-line
  }, [profile?.id]);

  useEffect(() => {
    if (typeof loading === "undefined" || loading) return;
    if (hasRedirectedRef.current || redirecting) return;

    function safeNavigate(dest: string) {
      if (
        window.location.pathname === dest ||
        hasRedirectedRef.current ||
        redirecting
      ) {
        console.log('[Index] Not navigating because already at destination or already redirecting.');
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      setTimeout(() => {
        console.log('[Index] Navigating to', dest);
        navigate(dest, { replace: true });
      }, 0);
    }

    if (profile) {
      switch (profile.role) {
        case 'admin':
          safeNavigate('/admin/dashboard');
          break;
        case 'manager':
          safeNavigate('/manager/dashboard');
          break;
        case 'teamlead':
          safeNavigate('/teamlead/dashboard');
          break;
        default:
          safeNavigate('/login');
      }
    } else {
      safeNavigate('/login');
    }

    // Anti-stuck failsafe
    const resetTimeout = setTimeout(() => setRedirecting(false), 2500);
    return () => clearTimeout(resetTimeout);
  }, [profile, loading, navigate, redirecting]);

  // Show loading or in-progress redirect
  if (redirecting || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Fallback (should almost never render)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default Index;
