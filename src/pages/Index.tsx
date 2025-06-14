
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

  // Only reset redirect guard ONCE after a *real* logout
  useEffect(() => {
    // If we were authenticated before, but now not authenticated, and not loading, and we redirected previously
    if (
      prevProfileRef.current !== null && // previously authenticated
      profile === null &&                // now logged out
      !loading &&                        // not loading
      hasRedirectedRef.current           // redirected previously
    ) {
      hasRedirectedRef.current = false;
      setRedirecting(false);
    }
    prevProfileRef.current = profile;
  }, [profile, loading]);

  useEffect(() => {
    if (loading) return;
    // Don't redirect if we've already done so for this session/transition
    if (hasRedirectedRef.current || redirecting) return;

    // Function to normalize URLs for comparison (removes trailing slashes)
    function normalizeLocation(url: string) {
      let u = url;
      if (u.endsWith('/') && u.length > 1) u = u.slice(0, -1);
      return u;
    }
    function currentPathWithSearchHash() {
      return (
        window.location.pathname +
        window.location.search +
        window.location.hash
      );
    }

    // Only navigate if not at the desired destination
    function safeNavigate(dest: string) {
      const destNorm = normalizeLocation(dest);
      const currNorm = normalizeLocation(currentPathWithSearchHash());
      // For debugging:
      // console.log("[Index] safeNavigate? dest:", dest, "curr:", currentPathWithSearchHash(), "normalized: ", currNorm, destNorm);

      if (currNorm === destNorm) {
        // Already at destination, no redirection necessary
        hasRedirectedRef.current = true;
        setRedirecting(false);
        // console.log("[Index] safeNavigate: NOOP already at dest", destNorm);
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      // console.log("[Index] safeNavigate: navigating to", destNorm);
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
      const currNorm = normalizeLocation(currentPathWithSearchHash());
      const loginPaths = ['/login', '/login/'].map(normalizeLocation);
      if (loginPaths.includes(currNorm)) {
        // Already on login page, no redirect needed
        hasRedirectedRef.current = true;
        setRedirecting(false);
      } else {
        safeNavigate('/login');
      }
    }
  }, [profile, loading, redirecting, navigate]);

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

