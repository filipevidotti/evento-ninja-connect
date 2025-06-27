
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'freelancer' | 'producer';
  city: string;
  phone?: string;
  rating?: number;
  avatar?: string;
  skills?: string[];
  description?: string;
  courses?: string[];
  otherKnowledge?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string, type: 'freelancer' | 'producer') => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.name || 'Usuário',
          email: authUser.email || '',
          type: profile.user_type as 'freelancer' | 'producer',
          city: profile.city || '',
          phone: profile.phone || '',
          rating: profile.rating || 0,
          avatar: profile.avatar_url || '',
          skills: profile.skills || [],
          description: profile.description || '',
          courses: profile.courses || [],
          otherKnowledge: profile.other_knowledge || ''
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await loadUserProfile(session.user);
    }
  };

  const login = async (email: string, password: string, type: 'freelancer' | 'producer'): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return !error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            type: userData.type,
            city: userData.city,
            phone: userData.phone,
            skills: userData.skills,
            description: userData.description,
            courses: userData.courses,
            otherKnowledge: userData.otherKnowledge
          }
        }
      });
      return !error;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: userData.name,
          city: userData.city,
          phone: userData.phone,
          skills: userData.skills,
          description: userData.description,
          avatar_url: userData.avatar,
          courses: userData.courses,
          other_knowledge: userData.otherKnowledge,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (!error) {
        setUser(prev => prev ? { ...prev, ...userData } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
