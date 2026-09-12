const STORAGE_KEY = 'active_server_survey_sessions';

interface SessionMap {
    [surveyId: string]: string;
}

const readMap = (): SessionMap => {
    if (typeof window === 'undefined') {
        return {};
    }
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

const writeMap = (map: SessionMap): void => {
    if (typeof window === 'undefined') {
        return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

export const surveySessionStorage = {
    getSessionId(surveyId: string): string | null {
        return readMap()[surveyId] ?? null;
    },
    saveSessionId(surveyId: string, sessionId: string): void {
        const map = readMap();
        map[surveyId] = sessionId;
        writeMap(map);
    },
    clearSessionId(surveyId: string): void {
        const map = readMap();
        if (map[surveyId]) {
            delete map[surveyId];
            writeMap(map);
        }
    },
    reset(): void {
        if (typeof window === 'undefined') {
            return;
        }
        window.localStorage.removeItem(STORAGE_KEY);
    },
};
