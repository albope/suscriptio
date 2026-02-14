import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { identifyUser, resetUser } from '@/lib/revenueCat';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  recoveryMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ data: AuthResponse['data']; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
  clearRecoveryMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getPasswordResetRedirectUrl(): string {
  if (import.meta.env.DEV) {
    return 'http://localhost:5173/reset-password';
  }
  return `${window.location.origin}/reset-password`;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Detect password recovery flow from email link
      if (_event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }

      // Sync RevenueCat user identity with Supabase auth
      if (session?.user) {
        identifyUser(session.user.id);
      } else {
        resetUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    });
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  };

  const deleteAccount = async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.rpc('delete_own_account');
      if (error) {
        return { error: new Error(error.message) };
      }
      await supabase.auth.signOut();
      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Unknown error') };
    }
  };

  const clearRecoveryMode = () => setRecoveryMode(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        recoveryMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        deleteAccount,
        clearRecoveryMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
