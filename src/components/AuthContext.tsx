
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
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
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        setSession(session);
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile && mounted) {
            setUser({
              id: profile.id,
              name: profile.name || session.user.email?.split('@')[0] || 'Usuário',
              email: session.user.email || '',
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
        } else if (mounted) {
          setUser(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        if (session?.user) {
          refreshUser();
        } else {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, type: 'freelancer' | 'producer'): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
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

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
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

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...userData } : null);
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
