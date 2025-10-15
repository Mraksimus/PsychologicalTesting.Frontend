import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, isAuthenticated, User } from '../services/auth';

// Типы для контекста аутентификации
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Создаем контекст
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Пропсы для провайдера
interface AuthProviderProps {
  children: ReactNode;
}

// Провайдер аутентификации
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // При загрузке приложения проверяем, есть ли сохраненный пользователь
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isAuthenticated()) {
          const currentUser = getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Ошибка при инициализации аутентификации:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginService(email, password);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция регистрации
  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerService(email, password);
      setUser(response.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    logoutService();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для использования контекста аутентификации
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};