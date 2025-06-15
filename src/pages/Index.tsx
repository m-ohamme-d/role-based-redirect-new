
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const didRedirectRef = useRef(false);

  // Decide redirect destination based on user role
  const dest =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

  useEffect(() => {
    // Only redirect ONCE, ONLY from "/", ONLY if allowed
    if (
      !loading &&
      location.pathname === '/' &&
      !didRedirectRef.current
    ) {
      didRedirectRef.current = true;
      // For debugging: log one-time redirect
      // eslint-disable-next-line no-console
      console.log('[Index]: Redirecting from "/" to:', dest);
      // This triggers a navigation and a component unmount
      navigate(dest, { replace: true });
    }
    // Only tie this to changes of loading/path!
    // eslint-disable-next-line
  }, [loading, location.pathname, navigate]);

  // After navigation or if not on root, render nothing. This prevents flicker and infinite redirects.
  if (didRedirectRef.current || location.pathname !== '/') {
    return null;
  }

  // Show loading spinner ONLY while initializing at "/"
  if (loading && location.pathname === '/' && !didRedirectRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // Fallback safety: render nothing
  return null;
}
