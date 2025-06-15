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
    // Only try redirecting ONCE, and ONLY from the "/" route!
    if (
      !loading &&
      !didRedirect &&
      location.pathname === '/'
    ) {
      setDidRedirect(true); // Next render skips effect and rendering
      navigate(dest, { replace: true });
    }
    // Only run effect when loading, path, profile, or didRedirect changes
  }, [loading, didRedirect, location.pathname, navigate, dest, profile]);

  // If we've started redirecting, or are no longer at "/", don't render
  if (didRedirect || location.pathname !== '/') {
    return null;
  }

  // Show spinner ONLY while loading at "/"
  if (loading && location.pathname === '/' && !didRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // Otherwise, just render nothing (should never reach here with logic above)
  return null;
}
