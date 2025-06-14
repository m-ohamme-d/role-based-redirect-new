
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guards to prevent infinite loop navigation
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  // Clear guards ONLY when fully logged out and loading is finished
  useEffect(() => {
    if (!loading && !profile) {
      // Reset guards on explicit logout/state reset only
      hasRedirectedRef.current = false;
      setRedirecting(false);
      console.log('[Index] Reset redirecting state (logout or no profile)');
    }
  }, [profile, loading]);

  // Main redirect logic: only runs when profile (auth) is ready
  useEffect(() => {
    if (typeof loading === "undefined" || loading) return;
    if (hasRedirectedRef.current || redirecting) {
      console.log('[Index] Navigation is already in progress or completed:', { hasRedirected: hasRedirectedRef.current, redirecting });
      return;
    }

    function safeNavigate(dest: string) {
      // Do not navigate if already at the right route
      if (window.location.pathname === dest) {
        console.log('[Index] Already at destination:', dest);
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      console.log('[Index] Navigating to', dest);
      navigate(dest, { replace: true });
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
      // Not logged in, go to login if not already there
      safeNavigate('/login');
    }
  }, [profile, loading, redirecting, navigate]);

  // Show loading or redirect in progress
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

  // Fallback (should rarely render)
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
