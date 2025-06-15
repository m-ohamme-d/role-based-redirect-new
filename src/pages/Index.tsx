
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();

  const hasRedirected = useRef(false);

  useEffect(() => {
    // Debugging - log what state we're in
    console.log(
      '[Index] effect',
      { location: location.pathname, loading, profile, hasRedirected: hasRedirected.current }
    );
    if (loading || hasRedirected.current) return;

    // Calculate destination path
    const dest = profile
      ? profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'manager'
        ? '/manager/dashboard'
        : profile.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    // If already at the intended path, do not redirect
    if (location.pathname === dest) {
      return;
    }

    // Mark as redirected BEFORE navigating
    hasRedirected.current = true;
    console.log(`[Index] Redirecting to ${dest} from ${location.pathname}`);
    navigate(dest, { replace: true });

    // After issue is fixed, you can remove these logs.
  }, [loading, profile, location.pathname, navigate]);

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

  // If we triggered a redirect, render nothing to prevent render loop
  if (hasRedirected.current) return null;

  // If still on / after loading + no profile, show a fallback spinner for robustness
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading…</p>
      </div>
    </div>
  );
}
