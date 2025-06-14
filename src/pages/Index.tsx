
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();

  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (loading || hasRedirected) return;

    const dest = profile
      ? profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'manager'
        ? '/manager/dashboard'
        : profile.role === 'teamlead'
        ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    // Only redirect if not already there
    if (location.pathname !== dest) {
      setHasRedirected(true);
      navigate(dest, { replace: true });
    }
  }, [loading, profile, navigate, location.pathname, hasRedirected]);

  // If loading auth, show spinner
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

  // If we've triggered a redirect, render nothing
  if (hasRedirected) return null;

  // Fallback spinner if something is really strange
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading…</p>
      </div>
    </div>
  );
}
