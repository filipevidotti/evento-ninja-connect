
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
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, type: 'freelancer' | 'producer') => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
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

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          const mockUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
            email: session.user.email || '',
            type: session.user.user_metadata?.type || 'freelancer',
            city: session.user.user_metadata?.city || 'São Paulo',
            rating: session.user.user_metadata?.type === 'freelancer' ? 4.5 : undefined,
            skills: session.user.user_metadata?.type === 'freelancer' ? ['Garçom', 'Operador de Caixa'] : undefined,
            description: session.user.user_metadata?.type === 'freelancer' ? 'Profissional experiente em eventos' : 'Produtor de eventos corporativos'
          };
          setUser(mockUser);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const mockUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          type: session.user.user_metadata?.type || 'freelancer',
          city: session.user.user_metadata?.city || 'São Paulo',
          rating: session.user.user_metadata?.type === 'freelancer' ? 4.5 : undefined,
          skills: session.user.user_metadata?.type === 'freelancer' ? ['Garçom', 'Operador de Caixa'] : undefined,
          description: session.user.user_metadata?.type === 'freelancer' ? 'Profissional experiente em eventos' : 'Produtor de eventos corporativos'
        };
        setUser(mockUser);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, type: 'freelancer' | 'producer'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
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
            description: userData.description
          }
        }
      });

      if (error) throw error;

      return true;
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

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
