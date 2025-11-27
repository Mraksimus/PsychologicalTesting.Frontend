const STORAGE_KEY = 'active_server_testing_sessions';

interface SessionMap {
    [testId: string]: string;
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

export const testingSessionStorage = {
    getSessionId(testId: string): string | null {
        const map = readMap();
        return map[testId] ?? null;
    },
    saveSessionId(testId: string, sessionId: string): void {
        const map = readMap();
        map[testId] = sessionId;
        writeMap(map);
    },
    clearSessionId(testId: string): void {
        const map = readMap();
        if (map[testId]) {
            delete map[testId];
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

