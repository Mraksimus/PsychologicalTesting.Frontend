import {TestSession} from "@/types/session";

const SESSIONS_KEY = 'testSessions';
const ACTIVE_SESSIONS_KEY = 'activeSessions';

export const sessionUtils = {
    // Получить все сессии пользователя
    getAllSessions(): TestSession[] {
        try {
            return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
        } catch {
            return [];
        }
    },

    // Получить активные сессии
    getActiveSessions(): { [testId: number]: string } {
        try {
            return JSON.parse(localStorage.getItem(ACTIVE_SESSIONS_KEY) || '{}');
        } catch {
            return {};
        }
    },

    // Получить сессию для конкретного теста
    getSessionForTest(testId: number): TestSession | null {
        const sessions = this.getAllSessions();
        const activeSessions = this.getActiveSessions();
        const sessionId = activeSessions[testId];

        if (sessionId) {
            return sessions.find(session => session.id === sessionId) || null;
        }
        return null;
    },

    // Создать новую сессию
    createSession(testId: number, testTitle: string): TestSession {
        const sessions = this.getAllSessions();
        const activeSessions = this.getActiveSessions();

        // Закрываем предыдущую активную сессию для этого теста
        const previousSessionId = activeSessions[testId];
        if (previousSessionId) {
            const previousSessionIndex = sessions.findIndex(s => s.id === previousSessionId);
            if (previousSessionIndex !== -1) {
                sessions[previousSessionIndex].status = 'closed';
            }
        }

        const newSession: TestSession = {
            id: `session_${Date.now()}`,
            testId,
            testTitle,
            status: 'active',
            currentQuestionIndex: 0,
            userAnswers: {},
            startedAt: Date.now()
        };

        sessions.push(newSession);
        activeSessions[testId] = newSession.id;

        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
        localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(activeSessions));

        return newSession;
    },

    // Обновить прогресс сессии
    updateSessionProgress(sessionId: string, progress: { currentQuestionIndex: number; userAnswers: { [key: number]: number } }) {
        const sessions = this.getAllSessions();
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);

        if (sessionIndex !== -1) {
            sessions[sessionIndex] = {
                ...sessions[sessionIndex],
                ...progress
            };
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
        }
    },

    // Завершить сессию
    completeSession(sessionId: string, result: { percentile: number; category: string }) {
        const sessions = this.getAllSessions();
        const activeSessions = this.getActiveSessions();
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);

        if (sessionIndex !== -1) {
            sessions[sessionIndex] = {
                ...sessions[sessionIndex],
                status: 'completed',
                completedAt: Date.now(),
                result
            };

            // Удаляем из активных сессий
            const testId = sessions[sessionIndex].testId;
            delete activeSessions[testId];

            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
            localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(activeSessions));
        }
    },

    // Начать тест заново (закрыть текущую и создать новую)
    restartTest(testId: number, testTitle: string): TestSession {
        const activeSessions = this.getActiveSessions();
        const sessions = this.getAllSessions();

        // Закрываем текущую активную сессию
        const currentSessionId = activeSessions[testId];
        if (currentSessionId) {
            const sessionIndex = sessions.findIndex(s => s.id === currentSessionId);
            if (sessionIndex !== -1) {
                sessions[sessionIndex].status = 'closed';
            }
            delete activeSessions[testId];
        }

        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
        localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(activeSessions));

        // Создаем новую сессию
        return this.createSession(testId, testTitle);
    }
};