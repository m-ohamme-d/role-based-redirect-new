
// Move this outside the component so it isn’t reset on remount
let didRedirectThisSession = false;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (loading || didRedirectThisSession) return;

    didRedirectThisSession = true;
    const dest = profile
      ? profile.role === 'admin'    ? '/admin/dashboard'
        : profile.role === 'manager'  ? '/manager/dashboard'
        : profile.role === 'teamlead' ? '/teamlead/dashboard'
        : '/login'
      : '/login';

    navigate(dest, { replace: true });
  }, [loading, profile, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {loading ? 'Loading…' : 'Redirecting…'}
        </p>
      </div>
    </div>
  );
}
