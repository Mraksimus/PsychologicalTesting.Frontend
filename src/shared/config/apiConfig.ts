export const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export const API_ROUTES = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
    },
    tests: {
        list: '/testing/tests',
    },
    testingSessions: {
        base: '/testing/sessions',
        create: (testId: string) => `/testing/sessions/${testId}`,
        session: (sessionId: string) => `/testing/sessions/${sessionId}`,
        answers: (sessionId: string) => `/testing/sessions/${sessionId}/answers`,
        complete: (sessionId: string) => `/testing/sessions/${sessionId}/complete`,
        close: (sessionId: string) => `/testing/sessions/${sessionId}/close`,
    },
    chat: {
        history: '/chat',
    },
    profile: {
        get: '/user/profile',
        update: '/user/profile',
        delete: '/user/profile',
        sessions: '/user/profile/sessions',
    },
} as const;

export const STORAGE_KEYS = {
    token: 'token',
    tokenExpiresAt: 'token_expires',
    userId: 'user_id',
} as const;

