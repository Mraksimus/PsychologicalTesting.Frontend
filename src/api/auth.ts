// src/api/auth.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export interface User {
  id: string;
  email: string;
  token: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login API response:', res.data);
    
    if (res.data.token) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      console.log('User data saved to localStorage');
    }
    return res.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('Ошибка при входе: ' + (error as any).response?.data?.message || 'Неизвестная ошибка');
  }
};

export const register = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    console.log('Register API response:', res.data);
    
    if (res.data.token) {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userData', JSON.stringify(res.data.user));
      console.log('User data saved to localStorage');
    }
    return res.data;
  } catch (error) {
    console.error('Register API error:', error);
    throw new Error('Ошибка при регистрации: ' + (error as any).response?.data?.message || 'Неизвестная ошибка');
  }
};

export const logout = (): void => {
  console.log('Clearing localStorage...');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userData');
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('userToken');
  console.log('isAuthenticated check - token exists:', !!token);
  return !!token;
};

export const getCurrentUser = (): User | null => {
  const userData = localStorage.getItem('userData');
  console.log('getCurrentUser - userData:', userData);
  return userData ? JSON.parse(userData) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem('userToken');
};