import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import {
    ExistingTestingSession,
    FullTestingSession,
    PaginatedResponse,
    SessionAnswer,
    UpdateAnswersSessionRequest,
} from '@/types';

interface ListSessionsParams {
    offset?: number;
    limit?: number;
}

const withDefaultPagination = (params?: ListSessionsParams) => ({
    offset: params?.offset ?? 0,
    limit: params?.limit ?? 50,
});

const buildAnswersPayload = (answers: SessionAnswer[]): UpdateAnswersSessionRequest => ({
    answers,
});

interface CompleteResponse {
    session?: FullTestingSession;
}

export const testingSessionsApi = {
    async create(testId: string): Promise<FullTestingSession> {
        const { data } = await httpClient.post<FullTestingSession>(`/testing/sessions/${testId}`);
        return data;
    },
    async get(sessionId: string): Promise<FullTestingSession> {
        const { data } = await httpClient.get<FullTestingSession>(`/testing/sessions/${sessionId}`);
        return data;
    },
    async list(params?: ListSessionsParams): Promise<PaginatedResponse<ExistingTestingSession>> {
        const { data } = await httpClient.get<PaginatedResponse<ExistingTestingSession>>(
            '/testing/sessions',
            { params: withDefaultPagination(params) },
        );
        return data;
    },
    async updateAnswers(sessionId: string, answers: SessionAnswer[]): Promise<void> {
        await httpClient.put(`/testing/sessions/${sessionId}/answers`, buildAnswersPayload(answers));
    },
    async complete(sessionId: string): Promise<FullTestingSession> {
        const { data } = await httpClient.put<FullTestingSession | CompleteResponse>(
            `/testing/sessions/${sessionId}/complete`,
        );
        // Бек возвращает CompleteSessionResult.Success { session: FullTestingSession }.
        const wrapped = (data as CompleteResponse).session;
        return wrapped ?? (data as FullTestingSession);
    },
    async close(sessionId: string): Promise<void> {
        await httpClient.put(`/testing/sessions/${sessionId}/close`);
    },
};

export const isConflictError = (error: unknown): boolean => {
    return axios.isAxiosError(error) && error.response?.status === 409;
};

export const isInactiveTestError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error) || error.response?.status !== 400) {
        return false;
    }
    const data = error.response?.data as { description?: string } | undefined;
    return Boolean(data?.description?.toLowerCase().includes('not active'));
};

export const extractApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { description?: string } | undefined;
        if (data?.description) {
            return data.description;
        }
    }
    return error instanceof Error ? error.message : fallback;
};
