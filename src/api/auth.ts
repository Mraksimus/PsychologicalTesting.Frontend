import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import {
    clearToken,
    hasValidToken,
    persistToken,
    readSubject,
    readToken,
} from '@/shared/storage/tokenStorage';

interface AuthSuccessResponse {
    token: string;
}

interface ApiErrorField {
    message: string;
    path: string;
}

interface ApiErrorResponse {
    status: number;
    fields?: ApiErrorField[];
}

export const register = async (
    name: string,
    surname: string,
    patronymic: string | undefined,
    email: string,
    password: string,
): Promise<void> => {
    try {
        const response = await httpClient.post<AuthSuccessResponse>('/auth/register', {
            name,
            surname,
            patronymic,
            email,
            password,
        });

        persistToken(response.data.token);
    } catch (error) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            if (error.response?.status === 422) {
                throw new Error(error.response.data.fields?.[0]?.message ?? 'Некорректные данные');
            }
            if (error.response?.status === 409) {
                throw new Error('Пользователь с таким email уже существует');
            }
        }

        throw new Error('Не удалось завершить регистрацию. Попробуйте позже.');
    }
};

export const login = async (email: string, password: string): Promise<void> => {
    try {
        const response = await httpClient.post<AuthSuccessResponse>('/auth/login', { email, password });
        persistToken(response.data.token);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Неверный email или пароль');
            }
        }

        throw new Error('Не удалось выполнить вход. Попробуйте позже.');
    }
};

export const logout = (): void => {
    clearToken();
};

export const getCurrentUser = (): { id: string | null } => {
    if (!hasValidToken()) {
        logout();
        throw new Error('Not authenticated');
    }

    return {
        id: readSubject(),
    };
};

export const isAuthenticated = (): boolean => {
    return Boolean(readToken()) && hasValidToken();
};

export const getToken = (): string | null => readToken();
