
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (typeof loading === "undefined" || loading) return;
    if (hasRedirectedRef.current || redirecting) return; // extra guard

    function safeNavigate(dest: string) {
      // Never redirect to yourself, and never if already redirected!
      if (
        window.location.pathname === dest ||
        hasRedirectedRef.current ||
        redirecting
      ) {
        return;
      }
      hasRedirectedRef.current = true;
      setRedirecting(true);
      // Small timeout to break render chain loop for safety
      setTimeout(() => {
        navigate(dest, { replace: true });
      }, 0);
    }

    // Main redirect logic
    if (profile) {
      switch (profile.role) {
        case 'admin':
          safeNavigate('/admin/dashboard');
          break;
        case 'manager':
          safeNavigate('/manager/dashboard');
          break;
        case 'teamlead':
          safeNavigate('/teamlead/dashboard');
          break;
        default:
          safeNavigate('/login');
      }
    } else {
      safeNavigate('/login');
    }

    // Failsafe: clear redirecting after 2s (if for some reason not redirected)
    const reset = setTimeout(() => setRedirecting(false), 2000);
    return () => clearTimeout(reset);
  }, [profile, loading, navigate, redirecting]);

  // Show loading OR redirect in progress
  if (redirecting || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Non-authenticated fallback (should almost never occur)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
};

export default Index;
