export interface Test {
    id: string;
    name: string;
    description: string;
    durationMins: string;
    position: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    offset: number;
    limit: number;
}

export interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

export interface PopupState {
    isOpen: boolean;
    testId: number | null;
}

export interface ChatMessage {
    id: number;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export interface AnalysisResult {
    hasConcerns: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    suggestedActions: string[];
}