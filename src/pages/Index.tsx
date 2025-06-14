
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guards to prevent infinite loop navigation
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  // Only reset guards if a full logout occurs (not on every profile state change!)
  useEffect(() => {
    if (!loading && !profile) {
      // User is definitely logged out and authentication is idle
      hasRedirectedRef.current = false;
      setRedirecting(false);
      console.log('[Index] (Logout) Reset redirecting state');
    }
    // DO NOT reset on profile change while logged in!
  }, [loading, profile]);

  // Main redirect logic - only redirect ONCE after freshly logging in or out
  useEffect(() => {
    if (typeof loading === "undefined" || loading) return; // Wait for auth to finish loading

    // If we've already redirected this session, abort
    if (hasRedirectedRef.current || redirecting) {
      // Only for debug:
      // console.log('[Index] Navigation already performed or in progress:', { hasRedirected: hasRedirectedRef.current, redirecting });
      return;
    }

    /**
     * @param dest {string} - destination URL
     */
    function safeNavigate(dest: string) {
      if (window.location.pathname === dest) {
        // Already at destination, no need to navigate
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      // Only after guards are set, do navigate
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
  if (loading || redirecting) {
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
