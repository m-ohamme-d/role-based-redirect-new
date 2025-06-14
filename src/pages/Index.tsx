
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Move the guard outside component scope
let hasRedirectedThisSession = false;

export default function Index() {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // local state just to trigger one re-render after redirect
  const [, forceUpdate] = useState<{}>({});

  useEffect(() => {
    if (loading || hasRedirectedThisSession) return;

    hasRedirectedThisSession = true;
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
    // force one re-render so we can bail out in render below
    forceUpdate({});
  }, [loading, profile, navigate]);

  // Show spinner while loading or *just* after navigating
  if (loading || !hasRedirectedThisSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  // After redirect, render nothing so router can swap us out
  return null;
}
