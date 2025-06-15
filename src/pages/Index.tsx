
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPath = useRef(location.pathname);
  const { profile, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only trigger redirect once, on initial path after loading is done
    if (loading) return;
    if (location.pathname !== initialPath.current) return;
    if (hasRedirected.current) return;

    const dest = profile
      ? profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'manager'
        ? '/manager/dashboard'
        : profile.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    if (location.pathname === dest) {
      hasRedirected.current = true;
      return;
    }

    hasRedirected.current = true;
    navigate(dest, { replace: true });
  }, [loading, profile, location.pathname, navigate]);

  // 1. While authenticating, show spinner
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

  // 2. While just after loading (even for 1 render!), if we're redirecting, render nothing (no flicker)
  if (!loading && hasRedirected.current) {
    return null;
  }

  // 3. If on "/", profile loading done, and no redirect, show nothing (should never happen long!)
  return null;
}
