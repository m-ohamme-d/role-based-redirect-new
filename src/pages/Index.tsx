import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPath = useRef(location.pathname);
  const { profile, loading } = useAuth();

  // Only redirect for exactly the mount page
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log(
      '[Index] effect',
      {
        location: location.pathname,
        loading,
        profile,
        hasRedirected: hasRedirected.current,
        initialPath: initialPath.current,
      }
    );

    // Don't do anything while still loading
    if (loading) return;

    // Only process redirect if on the original mount path ("/")
    if (location.pathname !== initialPath.current) return;

    // Only redirect once
    if (hasRedirected.current) return;

    // Where should we go?
    const dest = profile
      ? profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'manager'
        ? '/manager/dashboard'
        : profile.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    // Already there? No redirect
    if (location.pathname === dest) {
      hasRedirected.current = true; // Prevent future triggers
      console.log('[Index] Already at destination, skipping redirect.');
      return;
    }

    hasRedirected.current = true; // Prevent future triggers
    console.log(`[Index] Redirecting to ${dest} from ${location.pathname}`);
    navigate(dest, { replace: true });

  }, [loading, profile, location.pathname, navigate]);

  // Show spinner only on "/" route (mount page), otherwise return nothing (avoid loop)
  if (loading || (location.pathname === "/" && !hasRedirected.current)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // Otherwise, render nothing after redirect or on alternate path
  return null;
}
