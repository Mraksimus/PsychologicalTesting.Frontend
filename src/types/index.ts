// ───────── Tests ─────────

// Категории — фронтовая мета (бек категории не возвращает).
export type TestCategory =
    | 'PERSONALITY'
    | 'EMOTIONS'
    | 'INTELLECT'
    | 'CAREER'
    | 'RELATIONSHIPS'
    | 'DEVELOPMENT'
    | 'OTHER';

export interface Test {
    id: string;
    name: string;
    description: string;
    transcript: string;
    durationMins: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    position: number;
    /** Категория проставляется только на фронте (см. testAdapters). */
    category?: TestCategory;
    /** Количество вопросов теста публично с бека сейчас не приходит. */
    questionsCount?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    offset: number;
    limit: number;
}

// ───────── Chat (UI) ─────────

export interface ChatMessage {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

// ───────── Questions ─────────

/** Бек поддерживает только SINGLE и SCALE для Choice-вопросов. */
export type QuestionChoiceMod = 'SINGLE' | 'SCALE';

export interface Answer {
    index: number;
    text: string;
    score: number;
}

export interface ChoiceQuestionContent {
    type: 'Choice';
    text: string;
    mod: QuestionChoiceMod;
    options: Answer[];
}

export interface InputQuestionContent {
    type: 'Input';
    text: string;
    correctInputs?: string[] | null;
}

export type QuestionContent = ChoiceQuestionContent | InputQuestionContent;

export interface ExistingQuestion {
    id: string;
    testId: string;
    content: QuestionContent;
    position: number;
}

// ───────── Sessions ─────────

export type TestingSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

/** Ответ пользователя на вопрос: индекс выбранного варианта (для Choice). */
export interface SessionAnswer {
    questionId: string;
    selectedIndex: number | null;
}

/** Сессия без списка вопросов (используется в списках). */
export interface ExistingTestingSession {
    id: string;
    userId: string;
    testId: string;
    answers: SessionAnswer[];
    status: TestingSessionStatus;
    createdAt: string;
    closedAt?: string | null;
    result?: string | null;
}

/** Полная сессия (используется при создании, открытии, завершении). */
export interface FullTestingSession extends ExistingTestingSession {
    questions: ExistingQuestion[];
}

/** Алиас для совместимости с существующими импортами. */
export type TestingSession = FullTestingSession;

// ───────── Session API requests ─────────

export interface UpdateAnswersSessionRequest {
    answers: SessionAnswer[];
}

// ───────── User profile ─────────

export interface UserProfile {
    email: string;
    name: string;
    surname: string;
    patronymic?: string | null;
    registeredAt: string;
    lastLoginAt?: string | null;
    sessionsCount: number;
    completedSessionsCount: number;
    inProgressSessionsCount: number;
}

export interface TestingSessionCard {
    id: string;
    testName: string;
    status: TestingSessionStatus;
    createdAt: string;
}

export type TestingSessionCardResponse = PaginatedResponse<TestingSessionCard>;
