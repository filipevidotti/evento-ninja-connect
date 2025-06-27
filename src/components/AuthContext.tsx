
import React, { createContext, useContext, useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string, type: 'freelancer' | 'producer'): Promise<boolean> => {
    setLoading(true);
    
    // Simular delay de login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Criar usuário mockado
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      type,
      city: 'São Paulo',
      phone: '(11) 99999-9999',
      rating: type === 'freelancer' ? 4.5 : undefined,
      avatar: '',
      skills: type === 'freelancer' ? ['Fotografia', 'Edição'] : [],
      description: `${type === 'freelancer' ? 'Freelancer' : 'Produtor'} experiente`,
      courses: [],
      otherKnowledge: ''
    };
    
    setUser(mockUser);
    setLoading(false);
    return true;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    setLoading(true);
    
    // Simular delay de registro
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      rating: userData.type === 'freelancer' ? 0 : undefined,
      skills: userData.skills || []
    };
    
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setUser(prev => prev ? { ...prev, ...userData } : null);
    return true;
  };

  const refreshUser = async () => {
    // No-op para compatibilidade
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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
