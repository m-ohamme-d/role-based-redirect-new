import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Guard so we only ever redirect once per login/logout cycle
  const hasRedirectedRef = useRef(false);
  const prevProfileRef   = useRef<typeof profile | null>(null);

  // Reset the guard when we go from logged-in → logged-out
  useEffect(() => {
    if (
      prevProfileRef.current !== null &&  // we were logged in
      profile === null &&                 // now logged out
      !loading &&                         // and loading has finished
      hasRedirectedRef.current            // and we had redirected
    ) {
      hasRedirectedRef.current = false;
    }
    prevProfileRef.current = profile;
  }, [profile, loading]);

  // One-time redirect effect — fix loop here
  useEffect(() => {
    if (loading || hasRedirectedRef.current) {
      return;
    }

    const normalize = (u: string) =>
      u.endsWith('/') && u.length > 1 ? u.slice(0, -1) : u;
    const current = normalize(
      window.location.pathname +
      window.location.search +
      window.location.hash
    );

    let destination: string;
    if (profile) {
      switch (profile.role) {
        case 'admin':    destination = '/admin/dashboard';    break;
        case 'manager':  destination = '/manager/dashboard';  break;
        case 'teamlead': destination = '/teamlead/dashboard'; break;
        default:         destination = '/login';
      }
    } else {
      destination = '/login';
    }

    const destNorm = normalize(destination);
    // Fix: Always set guard BEFORE navigating
    if (current !== destNorm) {
      hasRedirectedRef.current = true;
      // For debugging, you may want to log here
      // console.log('Redirecting from', current, 'to', destNorm);
      navigate(destination, { replace: true });
    } else {
      hasRedirectedRef.current = true;
    }
  }, [loading, profile, navigate]);

  // Spinner while loading or redirecting
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
};

export default Index;
