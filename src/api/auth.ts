const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export interface Token {
    userId: string;
    value: string;
    createdAt: string;
    expiresAt: string;
}

export interface LoginResponse {
    token: Token;
}

export interface RegisterResponse {
    token: Token;
}

export interface ApiError {
    status: number;
    fields?: Array<{
        message: string;
        path: string;
    }>;
}

// Сохраняем токен в localStorage
const saveToken = (token: Token): void => {
    localStorage.setItem('token', token.value);
    localStorage.setItem('token_expires', token.expiresAt);
    localStorage.setItem('user_id', token.userId);
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

    const data: RegisterResponse = await response.json();
    saveToken(data.token);
};

// Вход
export const login = async (email: string, password: string): Promise<void> => {
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

    const data: LoginResponse = await response.json();
    saveToken(data.token);
};

// Выход
export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('user_id');
};

// Получение текущего пользователя
export const getCurrentUser = async (): Promise<any> => {
    const token = getToken();

    if (!token || !isTokenValid()) {
        logout();
        throw new Error('Not authenticated');
    }

    // Если ваш бекенд имеет endpoint для получения данных пользователя
    // можно добавить запрос здесь
    // Пока возвращаем базовые данные из localStorage

    return {
        id: localStorage.getItem('user_id'),
        email: 'user@example.com' // Можно сохранять email при логине/регистрации
    };
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
    return !!getToken() && isTokenValid();
};