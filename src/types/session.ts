export interface TestSession {
    id: string;
    testId: number;
    testTitle: string;
    status: 'active' | 'completed' | 'closed';
    currentQuestionIndex: number;
    userAnswers: { [key: number]: number };
    startedAt: number;
    completedAt?: number;
    result?: {
        percentile: number;
        category: string;
    };
}

export interface TestProgress {
    testId: number;
    currentQuestionIndex: number;
    userAnswers: { [key: number]: number };
    timestamp: number;
}