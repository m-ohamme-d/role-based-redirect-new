
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();

  // Single “did I already run?” guard
  const hasRedirectedRef = useRef(false);
  const prevProfileRef = useRef<typeof profile | null>(null);

  // Reset the guard when we go from logged-in → logged-out
  useEffect(() => {
    if (
      prevProfileRef.current !== null &&  // we were logged in
      profile === null &&                 // now logged out
      !loading &&                         // finished loading
      hasRedirectedRef.current           // and had redirected
    ) {
      hasRedirectedRef.current = false;
    }
    prevProfileRef.current = profile;
  }, [profile, loading]);

  // Do one‐and‐only‐one redirect per auth state change
  useEffect(() => {
    if (loading || hasRedirectedRef.current) {
      return;
    }

    // Normalize path + search + hash (strip trailing “/”)
    const normalize = (u: string) =>
      u.endsWith('/') && u.length > 1 ? u.slice(0, -1) : u;
    const current = normalize(
      window.location.pathname +
      window.location.search +
      window.location.hash
    );

    // Compute where we ought to go
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

    // If we’re already there, just mark as done
    const destNorm = normalize(destination);
    if (current === destNorm) {
      hasRedirectedRef.current = true;
      return;
    }

    // Else navigate exactly once
    hasRedirectedRef.current = true;
    navigate(destination, { replace: true });
  }, [loading, profile, navigate]);

  // Always render a spinner while we decide
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

