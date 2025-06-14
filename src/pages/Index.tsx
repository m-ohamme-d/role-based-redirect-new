
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guards to prevent infinite redirect loop
  const hasRedirectedRef = useRef(false);
  const prevProfileRef = useRef<typeof profile | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Only reset guards if user just fully logged out (profile went from not-null to null while not loading)
  useEffect(() => {
    if (
      prevProfileRef.current &&           // previously logged in
      !profile &&                        // now logged out
      !loading &&                        // auth idle
      hasRedirectedRef.current           // we've redirected earlier
    ) {
      hasRedirectedRef.current = false;
      setRedirecting(false);
    }
    prevProfileRef.current = profile;
  }, [profile, loading]);

  // Only perform redirect exactly ONCE per login/logout transition
  useEffect(() => {
    if (typeof loading === 'undefined' || loading) return;
    if (hasRedirectedRef.current || redirecting) return;

    const currentPath = window.location.pathname + window.location.search + window.location.hash;

    // Only navigate if destination is different from current path
    function safeNavigate(dest: string) {
      if (window.location.pathname === dest) {
        // Already at destination, do nothing and set guard anyway.
        hasRedirectedRef.current = true;
        setRedirecting(false);
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
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
      // Not authenticated. If we are already at login, set guard and do nothing
      if (window.location.pathname === '/login') {
        hasRedirectedRef.current = true;
        setRedirecting(false);
      } else {
        safeNavigate('/login');
      }
    }
  // Only re-run if absolutely necessary
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

  // Fallback UI; should never render
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

