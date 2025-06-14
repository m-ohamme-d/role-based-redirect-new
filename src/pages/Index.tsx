
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  // Ensure hasRedirectedRef persists across rapid re-renders/mounts
  const hasRedirectedRef = useRef(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Absolutely never redirect when loading
    if (loading) return;
    // If we've already redirected, do nothing
    if (hasRedirectedRef.current) return;

    // Nothing to do until loading is complete
    if (typeof loading === "undefined") return;

    // After loading, decide where to redirect
    hasRedirectedRef.current = true;
    setRedirecting(true);

    if (profile) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'manager':
          navigate('/manager/dashboard', { replace: true });
          break;
        case 'teamlead':
          navigate('/teamlead/dashboard', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    } else {
      // No profile after loading
      navigate('/login', { replace: true });
    }
  }, [profile, loading, navigate]);

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

