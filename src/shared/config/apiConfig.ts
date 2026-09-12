export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://psychological-testing.mraksimus.ru';

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
    surveys: {
        list: '/surveys',
    },
    surveySessions: {
        base: '/surveys/sessions',
        create: (surveyId: string) => `/surveys/sessions/${surveyId}`,
        session: (sessionId: string) => `/surveys/sessions/${sessionId}`,
        answers: (sessionId: string) => `/surveys/sessions/${sessionId}/answers`,
        complete: (sessionId: string) => `/surveys/sessions/${sessionId}/complete`,
        close: (sessionId: string) => `/surveys/sessions/${sessionId}/close`,
    },
    chat: {
        history: '/chat',
    },
    profile: {
        get: '/user/profile',
        update: '/user/profile',
        delete: '/user/profile',
        sessions: '/user/profile/sessions',
        surveySessions: '/user/profile/survey-sessions',
    },
} as const;

export const STORAGE_KEYS = {
    token: 'token',
} as const;

