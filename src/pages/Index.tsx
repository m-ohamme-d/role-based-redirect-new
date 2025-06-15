
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Only proceed if we haven't redirected yet and we're on the root path
    if (hasRedirectedRef.current || location.pathname !== '/') {
      return;
    }

    // Only redirect when auth is not loading
    if (!loading) {
      // Mark as redirected IMMEDIATELY to prevent any re-runs
      hasRedirectedRef.current = true;
      
      // Decide redirect destination based on user role
      const dest = profile?.role === 'admin'
        ? '/admin/dashboard'
        : profile?.role === 'manager'
        ? '/manager/dashboard'
        : profile?.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login';

      console.log('[Index]: Redirecting from "/" to:', dest);
      navigate(dest, { replace: true });
    }
  }, [loading]); // Only depend on loading, not location.pathname

  // If we've redirected or not on root path, don't render anything
  if (hasRedirectedRef.current || location.pathname !== '/') {
    return null;
  }

  // Show loading spinner while auth is initializing
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

  // Fallback - should not reach here
  return null;
}
