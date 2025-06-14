
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
    
    const initAuth = async () => {
      try {
        // Get current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Error getting session:', error);
          setLoading(false);
          return;
        }

        console.log('[AuthProvider] Current session check:', !!currentSession);

        // Set initial state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Fetch profile if user exists
        if (currentSession?.user) {
          console.log('[AuthProvider] Fetching profile for existing user...');
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
        }

        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('[AuthProvider] Auth state change:', event, 'Session:', !!session);
            
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user && event === 'SIGNED_IN') {
              console.log('[AuthProvider] User signed in, fetching profile...');
              const profileData = await fetchProfile(session.user.id);
              setProfile(profileData);
            } else {
              console.log('[AuthProvider] No user or signed out, clearing profile');
              setProfile(null);
            }
          }
        );

        console.log('[AuthProvider] Auth initialization complete, setting loading to false');
        setLoading(false);

        return () => {
          console.log('[AuthProvider] Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('[AuthProvider] Error in auth initialization:', error);
        setLoading(false);
      }
    };

    const cleanup = initAuth();

    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
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
