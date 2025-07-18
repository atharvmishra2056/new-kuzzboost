import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Define a new type for the user object that includes the role
interface UserWithRole extends User {
  role?: string;
}

interface AuthContextType {
  currentUser: UserWithRole | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async (user: User) => {
      try {
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;

        // Add the role to the user object
        setCurrentUser({ ...user, role: data?.role || 'user' });
      } catch (error) {
        console.error("Error fetching user role:", error);
        setCurrentUser(user); // Fallback to user without role
      } finally {
        setLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setSession(session);
          const user = session?.user ?? null;

          if (user) {
            fetchUserRole(user);
          } else {
            setCurrentUser(null);
            setLoading(false);
          }
        }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const user = session?.user ?? null;
      if (user) {
        fetchUserRole(user);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName || email,
          role: 'user' // Default role for new users
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  );
};