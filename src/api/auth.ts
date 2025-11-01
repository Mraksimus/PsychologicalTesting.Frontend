const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export interface Token {
    userId: string;
    value: string;
    createdAt: string;
    expiresAt: string;
}

export interface ApiError {
    status: number;
    fields?: Array<{
        message: string;
        path: string;
    }>;
}

// Сохраняем токен в localStorage
const saveToken = (token: Token, isAdmin: boolean = false): void => {
    localStorage.setItem('token', token.value);
    localStorage.setItem('token_expires', token.expiresAt);
    localStorage.setItem('user_id', token.userId);
    if (isAdmin) {
        localStorage.setItem('is_admin', 'true');
    }
};

// Получаем токен из localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Проверяем валидность токена
const isTokenValid = (): boolean => {
    const expiresAt = localStorage.getItem('token_expires');
    if (!expiresAt) return false;

    return new Date(expiresAt) > new Date();
};

// Проверяем является ли пользователь администратором
export const isAdmin = (): boolean => {
    return localStorage.getItem('is_admin') === 'true';
};

// Регистрация
export const register = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        if (response.status === 422) {
            const error: ApiError = await response.json();
            const message = error.fields?.[0]?.message || 'Email is already taken';
            throw new Error(message);
        }
        throw new Error(`Registration failed: ${response.status}`);
    }

    const data: Token = await response.json();
    saveToken(data);
};

// Вход
export const login = async (email: string, password: string): Promise<void> => {
    // Специальная логика для администратора
    if (email === 'admin' && password === 'admin') {
        // Создаем mock токен для администратора
        const adminToken: Token = {
            userId: 'admin-user-id',
            value: 'admin-token-' + Date.now(),
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 часа
        };
        saveToken(adminToken, true);
        return;
    }

    // Обычный вход для остальных пользователей
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid email or password');
        }
        throw new Error(`Login failed: ${response.status}`);
    }

    const data: Token = await response.json();
    saveToken(data);
};

// Выход
export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_admin');
};

// Получение текущего пользователя
export const getCurrentUser = async (): Promise<any> => {
    const token = getToken();

    if (!token || !isTokenValid()) {
        logout();
        throw new Error('Not authenticated');
    }

    // Для администратора возвращаем специальные данные
    if (isAdmin()) {
        return {
            id: 'admin-user-id',
            email: 'admin@psychological-testing.ru',
            isAdmin: true
        };
    }

    return {
        id: localStorage.getItem('user_id'),
        email: 'user@example.com',
        isAdmin: false
    };
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
    return !!getToken() && isTokenValid();
};