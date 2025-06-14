
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guards against StrictMode double mount, and ensures redirect can occur every page load
  const hasRedirectedRef = useRef(false);

  // Triggers re-render after navigation so we can bail out in render
  const [, forceUpdate] = useState<{}>({});

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
    // Force re-render to trigger null return
    forceUpdate({});
  }, [loading, profile, navigate]);

  // Show spinner while loading or right after navigating
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

  // Hide everything after navigation, so router can swap us out
  return null;
}
