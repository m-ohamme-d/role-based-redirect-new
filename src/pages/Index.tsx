
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guard to prevent redirect loop
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  // Reset guards ONLY once when a user fully logs out
  useEffect(() => {
    // Only reset guards when user explicitly logs out (profile just transitioned to null)
    if (!loading && !profile && hasRedirectedRef.current) {
      hasRedirectedRef.current = false;
      setRedirecting(false);
      console.log('[Index] Resetting redirect guards: fully logged out');
    }
    // Do NOT reset if already logged out, or if logging in
  }, [loading, profile]);

  // Main redirect logic - only redirect ONCE after log in
  useEffect(() => {
    if (typeof loading === 'undefined' || loading) return;
    if (hasRedirectedRef.current || redirecting) return;

    /**
     * Safe navigation: redirect only if needed
     */
    function safeNavigate(dest: string) {
      if (window.location.pathname === dest) {
        console.log('[Index] Already at target:', dest);
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      console.log('[Index] Navigating to:', dest);
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
      // Not authenticated, go to login if not already there
      safeNavigate('/login');
    }
  }, [profile, loading, redirecting, navigate]);

  // Show loading/redirect spinner
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

