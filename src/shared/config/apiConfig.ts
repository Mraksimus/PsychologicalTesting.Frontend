export const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export const API_ROUTES = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
    },
    tests: {
        list: '/testing/tests',
        details: (testId: number | string) => `/tests/${testId}`,
    },
    chat: {
        history: '/chat/history',
        message: '/chat/message',
    },
} as const;

export const STORAGE_KEYS = {
    token: 'token',
    tokenExpiresAt: 'token_expires',
    userId: 'user_id',
} as const;


