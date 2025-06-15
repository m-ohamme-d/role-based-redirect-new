import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const [didRedirect, setDidRedirect] = useState(false);

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
    // Debug output
    console.log('[Index]: Effect called.', {
      loading,
      pathname: location.pathname,
      profile,
      dest,
      didRedirect,
    });

    // Only trigger redirect ONCE per mount on "/" and only if not loading and not already redirected
    if (
      !loading &&
      location.pathname === '/' &&
      !didRedirect
    ) {
      setDidRedirect(true); // Prevent future redirects on this mount
      console.log('[Index]: Navigating to', dest);
      navigate(dest, { replace: true });
    }
  }, [loading, dest, navigate, location.pathname, profile, didRedirect]);

  // If already redirected OR not on "/", render nothing to avoid flicker or loop
  if (didRedirect || location.pathname !== '/') {
    return null;
  }

  // Show spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // After navigation, show nothing (navigation will occur immediately if not loading)
  return null;
}
