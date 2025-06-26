
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('event-platform-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, type: 'freelancer' | 'producer'): Promise<boolean> => {
    // Simulação de login - em produção seria uma chamada real para API
    console.log('Login attempt:', { email, password, type });
    
    // Mock user data
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      type,
      city: 'São Paulo',
      rating: type === 'freelancer' ? 4.5 : undefined,
      skills: type === 'freelancer' ? ['Garçom', 'Operador de Caixa'] : undefined,
      description: type === 'freelancer' ? 'Profissional experiente em eventos' : 'Produtor de eventos corporativos'
    };

    setUser(mockUser);
    localStorage.setItem('event-platform-user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    console.log('Register attempt:', userData);
    
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setUser(newUser);
    localStorage.setItem('event-platform-user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('event-platform-user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('event-platform-user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
