
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Track if we've already navigated during this mount
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (loading || hasRedirectedRef.current) return;

    hasRedirectedRef.current = true;
    const dest = profile
      ? profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'manager'
        ? '/manager/dashboard'
        : profile.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    navigate(dest, { replace: true });
    // After navigation, we do not want to do anything else in this render
    // The component will be unmounted after navigation, so this is safe.
  }, [loading, profile, navigate]);

  // While loading auth or before redirect, show spinner
  if (loading || !hasRedirectedRef.current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // After redirect, render nothing so router can replace this route
  return null;
}
