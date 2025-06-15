
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect from "/" route and only once after loading finishes
    if (loading) return;

    // Only run on the root route
    if (location.pathname !== '/') return;

    // Prevent repeat redirects
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

    // If already at destination, do not redirect
    if (location.pathname === dest) {
      hasRedirected.current = true;
      return;
    }

    // Lock before navigation to prevent duplicate navigations
    hasRedirected.current = true;
    navigate(dest, { replace: true });
  }, [loading, profile, location.pathname, navigate]);

  // While authenticating (initial load), show spinner
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

  // Immediately after launching redirect, render nothing (eliminates flicker)
  if (hasRedirected.current) {
    return null;
  }

  return null;
}
