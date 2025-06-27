
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
  // Usuário mockado sempre logado
  const [user] = useState<User>({
    id: '1',
    name: 'Usuário Demo',
    email: 'demo@exemplo.com',
    type: 'freelancer',
    city: 'São Paulo',
    phone: '(11) 99999-9999',
    rating: 4.5,
    avatar: '',
    skills: ['Fotografia', 'Edição'],
    description: 'Freelancer experiente',
    courses: [],
    otherKnowledge: ''
  });
  
  const [loading] = useState(false);

  const login = async (): Promise<boolean> => {
    return true;
  };

  const register = async (): Promise<boolean> => {
    return true;
  };

  const logout = () => {
    // Mock - não faz nada
  };

  const updateUser = async (): Promise<boolean> => {
    return true;
  };

  const refreshUser = async () => {
    // Mock - não faz nada
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
