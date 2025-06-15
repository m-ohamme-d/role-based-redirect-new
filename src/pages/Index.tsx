
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
    // Only perform redirect on the root route and after loading is false
    if (
      !loading && // Only after auth finished
      location.pathname === '/' && // Only at root
      !hasRedirected.current // Only if not already redirected
    ) {
      hasRedirected.current = true;
      navigate(dest, { replace: true });
    }
    // Only rerun when relevant
  }, [loading, location.pathname, dest, navigate]);

  // Show spinner only while loading (auth still in progress)
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

  // After redirect, or if not at root, render nothing
  if (hasRedirected.current || location.pathname !== '/') {
    return null;
  }

  // Nothing to render on "/"
  return null;
}
