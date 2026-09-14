// ───────── Categories ─────────

export interface Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    position: number;
    createdAt: string;
    updatedAt: string;
}

// ───────── Tests ─────────

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
    categoryId?: string | null;
    category?: Category | null;
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

export type QuestionChoiceMod = 'SINGLE' | 'SCALE' | 'MULTIPLE';

export interface Answer {
    index: number;
    text: string;
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
    testId?: string | null;
    surveyId?: string | null;
    content: QuestionContent;
    position: number;
}

// ───────── Sessions ─────────

export type TestingSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

/** Ответ пользователя на вопрос: индекс выбранного варианта (для Choice). */
export interface SessionAnswer {
    questionId: string;
    selectedIndex: number | null;
    selectedIndices?: number[] | null;
    textAnswer?: string | null;
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
    surveySessionsCount: number;
    completedSurveySessionsCount: number;
    inProgressSurveySessionsCount: number;
}

export interface TestingSessionCard {
    id: string;
    testName: string;
    status: TestingSessionStatus;
    createdAt: string;
}

export type TestingSessionCardResponse = PaginatedResponse<TestingSessionCard>;

// ───────── Surveys ─────────

export interface Survey {
    id: string;
    name: string;
    description: string;
    durationMins: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    position: number;
    categoryId?: string | null;
    category?: Category | null;
    questionsCount?: number;
}

export type SurveySessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface ExistingSurveySession {
    id: string;
    userId: string;
    surveyId: string;
    answers: SessionAnswer[];
    status: SurveySessionStatus;
    createdAt: string;
    closedAt?: string | null;
}

export interface FullSurveySession extends ExistingSurveySession {
    questions: ExistingQuestion[];
}

export interface UpdateSurveyAnswersRequest {
    answers: SessionAnswer[];
}

export interface SurveySessionCard {
    id: string;
    surveyName: string;
    status: SurveySessionStatus;
    createdAt: string;
}

export type SurveySessionCardResponse = PaginatedResponse<SurveySessionCard>;
