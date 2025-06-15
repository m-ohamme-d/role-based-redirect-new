
import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const redirected = useRef(false);

  // Compute the target route based on role
  const dest =
    profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

  useEffect(() => {
    // Only trigger redirect ONCE per mount on "/"
    if (!loading && location.pathname === '/' && !redirected.current) {
      redirected.current = true;
      navigate(dest, { replace: true });
    }
    // Only rerun if loading, dest, location.pathname, or navigate changes
  }, [loading, dest, navigate, location.pathname]);

  // If already redirected OR not on "/", render nothing
  if (redirected.current || location.pathname !== '/') {
    return null;
  }

  // Show spinner while loading
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

  // After navigation, show nothing (navigation will occur immediately if not loading)
  return null;
}
