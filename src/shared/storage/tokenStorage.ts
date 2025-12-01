import { STORAGE_KEYS } from '@/shared/config/apiConfig';

export interface StoredTokenPayload {
    value: string;
    userId: string;
    expiresAt: string;
}

const withStorage = <T>(action: () => T): T => {
    if (typeof window === 'undefined') {
        throw new Error('localStorage is not available in the current environment');
    }
    return action();
};

export const persistToken = (token: StoredTokenPayload): void => {
    withStorage(() => {
        localStorage.setItem(STORAGE_KEYS.token, token.value);
        localStorage.setItem(STORAGE_KEYS.tokenExpiresAt, token.expiresAt);
        localStorage.setItem(STORAGE_KEYS.userId, token.userId);
    });
};

export const readToken = (): string | null => {
    return withStorage(() => localStorage.getItem(STORAGE_KEYS.token));
};

export const readTokenExpiry = (): string | null => {
    return withStorage(() => localStorage.getItem(STORAGE_KEYS.tokenExpiresAt));
};

export const readUserId = (): string | null => {
    return withStorage(() => localStorage.getItem(STORAGE_KEYS.userId));
};

export const clearToken = (): void => {
    withStorage(() => {
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.tokenExpiresAt);
        localStorage.removeItem(STORAGE_KEYS.userId);
    });
};

export const hasValidToken = (): boolean => {
    const expiry = readTokenExpiry();

    if (!expiry) {
        return false;
    }

    return new Date(expiry) > new Date();
};

