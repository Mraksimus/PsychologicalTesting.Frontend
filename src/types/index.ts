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
    /**
     * Дополнительные поля для UI (рассчитываются на клиенте).
     */
    category?: string;
    questionsCount?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    offset: number;
    limit: number;
}

export interface ChatMessage {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export type QuestionChoiceMod = 'SINGLE' | 'MULTIPLE' | 'BINARY' | 'SCALE';

export interface AnswerOption {
    index: number;
    text: string;
    isSelected?: boolean | null;
    isCorrect?: boolean | null;
    score?: number | null;
}

export interface ChoiceQuestionContent {
    type?: 'Choice';
    text: string;
    mod: QuestionChoiceMod;
    options: AnswerOption[];
}

export interface QuestionResponse {
    id: string;
    testId: string;
    position: number;
    content: ChoiceQuestionContent;
}

export type TestingSessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export interface TestingSession {
    id: string;
    userId: string;
    testId: string;
    questionResponses: QuestionResponse[];
    status: TestingSessionStatus;
    createdAt: string;
    closedAt?: string | null;
    result?: string | null;
}

export interface UpdateAnswersSessionRequest {
    questionResponses: QuestionResponsePayload[];
}

export interface QuestionResponsePayload {
    id: string;
    testId: string;
    position: number;
    content: ChoiceQuestionContentPayload;
}

interface ChoiceQuestionContentPayload {
    type: 'Choice';
    text: string;
    mod: QuestionChoiceMod;
    options: ClientAnswerPayload[];
}

export interface ClientAnswerPayload {
    index: number;
    text: string;
    isSelected: boolean;
}