import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import {
    clearToken,
    hasValidToken,
    persistToken,
    readToken,
    readUserId,
    StoredTokenPayload,
} from '@/shared/storage/tokenStorage';

interface AuthSuccessResponse {
    token: StoredTokenPayload | { value: string; userId: string; expiresAt: string };
}

interface ApiErrorField {
    message: string;
    path: string;
}

interface ApiErrorResponse {
    status: number;
    fields?: ApiErrorField[];
}

const normalizeTokenPayload = (payload: AuthSuccessResponse | StoredTokenPayload): StoredTokenPayload => {
    if ('value' in payload && 'userId' in payload) {
        return {
            value: payload.value,
            userId: payload.userId,
            expiresAt: payload.expiresAt,
        };
    }

    if ('token' in payload && payload.token) {
        return {
            value: payload.token.value,
            userId: payload.token.userId,
            expiresAt: payload.token.expiresAt,
        };
    }

    throw new Error('Unexpected token structure received from the server');
};

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

        persistToken(normalizeTokenPayload(response.data));
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
        persistToken(normalizeTokenPayload(response.data));
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
        id: readUserId(),
    };
};

export const isAuthenticated = (): boolean => {
    return Boolean(readToken()) && hasValidToken();
};

export const getToken = (): string | null => readToken();