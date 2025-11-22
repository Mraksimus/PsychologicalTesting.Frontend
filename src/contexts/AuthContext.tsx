import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated as checkAuth, User } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const authenticated = checkAuth();
        console.log('isAuthenticated check:', authenticated);
        
        if (authenticated) {
          const currentUser = getCurrentUser();
          console.log('Current user from localStorage:', currentUser);
          setUser(currentUser);
        } else {
          console.log('User not authenticated');
        }
      } catch (err) {
        console.error('Ошибка при инициализации аутентификации:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Logging in...', email);
      const response = await loginService(email, password);
      console.log('Login response:', response);
      setUser(response.user);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Registering...', email);
      const response = await registerService(email, password);
      console.log('Register response:', response);
      setUser(response.user);
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('Logging out...');
    logoutService();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user, // Важно: используем состояние user, а не функцию checkAuth
    login,
    register,
    logout,
    loading,
    error
  };

  console.log('AuthProvider value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};