import { STORAGE_KEYS } from '@/shared/config/apiConfig';

interface JwtPayload {
    sub?: string;
    exp?: number;
    iss?: string;
    aud?: string | string[];
    iat?: number;
}

const withStorage = <T>(action: () => T): T => {
    if (typeof window === 'undefined') {
        throw new Error('localStorage is not available in the current environment');
    }
    return action();
};

const decodeBase64Url = (segment: string): string => {
    const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padding = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
    return atob(padded + padding);
};

export const decodeJwt = (token: string): JwtPayload | null => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }
    try {
        const json = decodeBase64Url(parts[1]);
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
};

export const persistToken = (token: string): void => {
    withStorage(() => {
        localStorage.setItem(STORAGE_KEYS.token, token);
    });
};

export const readToken = (): string | null => {
    return withStorage(() => localStorage.getItem(STORAGE_KEYS.token));
};

export const readSubject = (): string | null => {
    const token = readToken();
    if (!token) {
        return null;
    }
    return decodeJwt(token)?.sub ?? null;
};

export const clearToken = (): void => {
    withStorage(() => {
        localStorage.removeItem(STORAGE_KEYS.token);
    });
};

export const hasValidToken = (): boolean => {
    const token = readToken();
    if (!token) {
        return false;
    }
    const payload = decodeJwt(token);
    if (!payload?.exp) {
        return false;
    }
    return payload.exp * 1000 > Date.now();
};
