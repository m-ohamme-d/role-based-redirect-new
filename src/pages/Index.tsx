
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const didRedirectRef = useRef(false);

  // Compute the target route based on role
  const dest =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

  useEffect(() => {
    // Only redirect ONCE, ONLY from "/" route, and only if allowed
    if (
      !loading &&
      location.pathname === '/' &&
      !didRedirectRef.current
    ) {
      didRedirectRef.current = true;
      navigate(dest, { replace: true });
    }
    // No dependency on profile or dest (which are recomputed on every render),
    // Just run on loading or path change.
    // eslint-disable-next-line
  }, [loading, location.pathname, navigate]);

  // After navigation, or if not on root, render nothing (avoids infinite loops)
  if (didRedirectRef.current || location.pathname !== '/') {
    return null;
  }

  // Loading spinner when initializing at "/"
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

  // Fallback (shouldn't occur)
  return null;
}
