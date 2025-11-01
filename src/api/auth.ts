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

// Сохраняем токен в localStorage с обработкой разных структур
const saveToken = (tokenData: any): void => {
    console.log('📦 Token data received:', tokenData);

    let token: string;
    let userId: string;
    let expiresAt: string;

    // Проверяем структуру ответа
    if (tokenData.value && tokenData.userId) {
        // Прямой объект Token { value, userId, createdAt, expiresAt }
        token = tokenData.value;
        userId = tokenData.userId;
        expiresAt = tokenData.expiresAt;
    } else if (tokenData.token && tokenData.token.value) {
        // Объект { token: { value, userId, createdAt, expiresAt } }
        token = tokenData.token.value;
        userId = tokenData.token.userId;
        expiresAt = tokenData.token.expiresAt;
    } else {
        console.error('❌ Unexpected token structure:', tokenData);
        throw new Error('Unexpected response structure from server');
    }

    console.log('💾 Saving token:', { token, userId, expiresAt });

    localStorage.setItem('token', token);
    localStorage.setItem('token_expires', expiresAt);
    localStorage.setItem('user_id', userId);
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
    console.log('📝 Register attempt:', email);

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    console.log('📨 Register response status:', response.status);

    if (!response.ok) {
        if (response.status === 422) {
            const error: ApiError = await response.json();
            const message = error.fields?.[0]?.message || 'Email is already taken';
            throw new Error(message);
        }
        throw new Error(`Registration failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Register success data:', data);
    saveToken(data);
};

// Вход
export const login = async (email: string, password: string): Promise<void> => {
    console.log('🔐 Login attempt:', email);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    console.log('📨 Login response status:', response.status);

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error('Invalid email or password');
        }
        throw new Error(`Login failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Login success data:', data);
    saveToken(data);
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

    return {
        id: localStorage.getItem('user_id'),
    };
};

// Проверка авторизации
export const isAuthenticated = (): boolean => {
    return !!getToken() && isTokenValid();
};