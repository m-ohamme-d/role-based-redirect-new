
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only act on initial "/" route, after loading is false, and if not already redirected
    if (loading) return;
    if (location.pathname !== '/') return;
    if (hasRedirected.current) return;

    const dest =
      profile?.role === 'admin'
        ? '/admin/dashboard'
        : profile?.role === 'manager'
        ? '/manager/dashboard'
        : profile?.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login';

    // Do not redirect if already at the right destination
    if (location.pathname === dest) {
      hasRedirected.current = true;
      return;
    }

    hasRedirected.current = true;
    navigate(dest, { replace: true });
  }, [loading, profile, location.pathname, navigate]);

  // Show spinner only while loading (`loading === true`)
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

  // After launching redirect, render nothing to prevent flickering/looping
  if (hasRedirected.current) {
    return null;
  }

  // If already at destination, render nothing as well
  const dest =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

  if (location.pathname === dest && location.pathname !== '/') {
    return null;
  }

  // Nothing more to render on "/"
  return null;
}
