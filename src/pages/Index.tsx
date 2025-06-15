

import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Redirect logic: this page is ONLY rendered at "/"
export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const profileRoleRef = useRef<string | null>(null);

  useEffect(() => {
    // Only proceed if we're on the root path and auth is not loading
    if (location.pathname !== '/' || loading) {
      return;
    }

    // Check if profile role has actually changed to prevent unnecessary redirects
    const currentRole = profile?.role || null;
    if (hasRedirectedRef.current && profileRoleRef.current === currentRole) {
      return;
    }

    console.log('[Index] Auth loaded, profile:', currentRole);
    
    // Mark as redirected and store the current role
    hasRedirectedRef.current = true;
    profileRoleRef.current = currentRole;
    
    // Decide redirect destination based on user role
    const dest = profile?.role === 'admin'
      ? '/admin/dashboard'
      : profile?.role === 'manager'
      ? '/manager/dashboard'
      : profile?.role === 'teamlead'
      ? '/teamlead/dashboard'
      : '/login';

    console.log('[Index]: Redirecting from "/" to:', dest);
    navigate(dest, { replace: true });
  }, [loading, profile?.role, location.pathname]); // Removed navigate from dependencies

  // Show loading spinner while auth is initializing OR while we're redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading…</p>
      </div>
    </div>
  );
}

