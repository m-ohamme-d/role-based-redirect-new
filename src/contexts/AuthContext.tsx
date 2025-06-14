
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState } from '@/utils/authCleanup';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'manager' | 'teamlead';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log('[AuthProvider] Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthProvider] Error fetching profile:', error);
        return null;
      }

      console.log('[AuthProvider] Profile fetched successfully:', data);
      return data as Profile;
    } catch (error) {
      console.error('[AuthProvider] Exception fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('[AuthProvider] Starting auth initialization...');

    let subscriptionObject: any = null;

    const setStatesFromSession = (sessionObj: Session | null) => {
      setSession(sessionObj);
      setUser(sessionObj?.user ?? null);
    };

    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('[AuthProvider] onAuthStateChange:', event, 'Session:', !!session);
            setStatesFromSession(session);

            if (session?.user && (event === 'SIGNED_IN' || event === 'USER_UPDATED')) {
              // Defer profile fetch to avoid deadlock
              setTimeout(async () => {
                const profileData = await fetchProfile(session.user.id);
                setProfile(profileData);
                console.log('[AuthProvider] PROFILE SET after onAuthStateChange', profileData);
              }, 0);
            } else {
              setProfile(null);
              console.log('[AuthProvider] Profile cleared after auth state change');
            }
          }
        );
        subscriptionObject = subscription;

        // THEN get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[AuthProvider] Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('[AuthProvider] Current session check: ', !!currentSession);

        setStatesFromSession(currentSession);

        if (currentSession?.user) {
          // Defer fetchProfile just in case
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
            console.log('[AuthProvider] PROFILE SET at init', profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('[AuthProvider] Error in auth initialization:', error);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (subscriptionObject) {
        subscriptionObject.unsubscribe();
        console.log('[AuthProvider] Subscription cleaned up.');
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[AuthProvider] Starting sign in...');
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[AuthProvider] Sign in error:', error);
        return { error };
      }

      console.log('[AuthProvider] Sign in successful');
      return { error: null };
    } catch (error: any) {
      console.error('[AuthProvider] Sign in exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      console.log('[AuthProvider] Starting sign up...');
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('[AuthProvider] Sign up error:', error);
        return { error };
      }

      console.log('[AuthProvider] Sign up successful');
      return { error: null };
    } catch (error: any) {
      console.error('[AuthProvider] Sign up exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[AuthProvider] Starting sign out...');
      
      setUser(null);
      setSession(null);
      setProfile(null);

      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });

      window.location.href = '/login';
    } catch (error) {
      console.error('[AuthProvider] Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  console.log('[AuthProvider] Current state:', { 
    loading, 
    user: !!user, 
    profile: !!profile, 
    profileRole: profile?.role 
  });

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
