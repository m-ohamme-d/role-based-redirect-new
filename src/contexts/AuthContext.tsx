import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  console.log('[AuthProvider] Current state:', { loading, user: !!user, profile: !!profile });

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('[AuthProvider] useEffect starting...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('[AuthProvider] Setting up auth listener...');
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) {
              console.log('[AuthProvider] Component unmounted, ignoring auth change');
              return;
            }

            console.log('[AuthProvider] Auth state change:', event, session?.user?.id);

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
              try {
                const profileData = await fetchProfile(session.user.id);
                if (mounted) {
                  setProfile(profileData);
                }
              } catch (err) {
                console.error("Error in profile fetch in listener", err);
                if (mounted) setProfile(null);
              }
            } else {
              setProfile(null);
            }
            
            if (mounted) {
              console.log('[AuthProvider] Setting loading to false after auth change');
              setLoading(false);
            }
          }
        );

        // Check for existing session
        console.log('[AuthProvider] Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[AuthProvider] Error getting session:', error);
        }

        if (!mounted) return;

        console.log('[AuthProvider] Initial session check:', session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const profileData = await fetchProfile(session.user.id);
            if (mounted) setProfile(profileData);
          } catch (err) {
            console.error("Error in profile fetch in initial session", err);
            if (mounted) setProfile(null);
          }
        } else {
          setProfile(null);
        }

        if (mounted) {
          console.log('[AuthProvider] Setting loading to false after initial check');
          setLoading(false);
        }

        return () => {
          console.log('[AuthProvider] Cleaning up subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('[AuthProvider] Error in initializeAuth:', error);
        if (mounted) {
          console.log('[AuthProvider] Setting loading to false due to error');
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      console.log('[AuthProvider] useEffect cleanup');
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string) => {
    try {
      console.log('Attempting signup with:', { email, name, role });

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
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup successful:', data);
      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      setProfile(null);

      await supabase.auth.signOut();

      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

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
