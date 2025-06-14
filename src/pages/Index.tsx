
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Prevents repeated redirects
  const hasRedirectedRef = useRef(false);
  const prevProfileRef = useRef<typeof profile | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  // Only reset guard ONCE after a *real* logout
  useEffect(() => {
    if (
      prevProfileRef.current !== null && // previously authenticated
      profile === null &&                // now logged out
      !loading &&                        // not loading
      hasRedirectedRef.current           // we redirected previously
    ) {
      hasRedirectedRef.current = false;
      setRedirecting(false);
    }
    prevProfileRef.current = profile;
  }, [profile, loading]);

  // One-time-per-transition redirection
  useEffect(() => {
    if (loading) return;

    if (hasRedirectedRef.current || redirecting) return;

    // Helper to navigate only if not already at dest (compare full path)
    function safeNavigate(dest: string) {
      const currentFullPath =
        window.location.pathname + window.location.search + window.location.hash;

      // Accept either with/without trailing slash
      const normalize = (str: string) =>
        str.endsWith('/') && str.length > 1 ? str.slice(0, -1) : str;
      if (
        normalize(currentFullPath) === normalize(dest)
      ) {
        // Already at destination, don't navigate
        // console.log('[Index] Already at dest', currentFullPath, dest);
        hasRedirectedRef.current = true;
        setRedirecting(false);
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      // console.log('[Index] Redirecting to:', dest);
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
      // Not logged in
      if (
        window.location.pathname === '/login' ||
        window.location.pathname === '/login/'
      ) {
        hasRedirectedRef.current = true;
        setRedirecting(false);
      } else {
        safeNavigate('/login');
      }
    }
  }, [profile, loading, redirecting, navigate]);

  // Spinner UI while loading or redirecting
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

  // Fallback UI (should never render, but is safe)
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
