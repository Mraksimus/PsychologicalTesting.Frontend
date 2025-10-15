import axios from "axios";

// Базовый URL для API - замените на ваш бэкенд
const API_URL = "http://localhost:5000/api/auth";

// Типы для аутентификации
export interface User {
  id: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Функция для входа пользователя
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    // Сохраняем токен в localStorage
    if (res.data.token) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    throw new Error('Ошибка при входе: ' + (error as any).response?.data?.message || 'Неизвестная ошибка');
  }
};

// Функция для регистрации пользователя
export const register = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    // Сохраняем токен в localStorage
    if (res.data.token) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    throw new Error('Ошибка при регистрации: ' + (error as any).response?.data?.message || 'Неизвестная ошибка');
  }
};

// Функция для выхода
export const logout = (): void => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

// Функция для проверки авторизации
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('userToken');
};

// Функция для получения текущего пользователя
export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Функция для получения токена
export const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};