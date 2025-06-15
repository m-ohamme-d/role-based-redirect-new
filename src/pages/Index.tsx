
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const hasRedirected = useRef(false);

  // Compute the correct destination route based on user role
  const dest =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

  useEffect(() => {
    // Only perform redirect logic on the root route, after loading, and not yet redirected
    if (loading) return;
    if (location.pathname !== '/') return;
    if (hasRedirected.current) return;

    hasRedirected.current = true;
    navigate(dest, { replace: true });
  }, [loading, profile, location.pathname, navigate, dest]);

  // Show spinner only while loading
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

  // If user is not on root route, render nothing (we do not handle other paths here)
  if (location.pathname !== '/') {
    return null;
  }

  // Nothing more to render on "/"
  return null;
}
