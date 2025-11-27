import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import {
    PaginatedResponse,
    QuestionResponsePayload,
    TestingSession,
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

const buildAnswersPayload = (questionResponses: QuestionResponsePayload[]): UpdateAnswersSessionRequest => ({
    questionResponses,
});

export const testingSessionsApi = {
    async create(testId: string): Promise<TestingSession> {
        const { data } = await httpClient.post<TestingSession>(`/testing/sessions/${testId}`);
        return data;
    },
    async get(sessionId: string): Promise<TestingSession> {
        const { data } = await httpClient.get<TestingSession>(`/testing/sessions/${sessionId}`);
        return data;
    },
    async list(params?: ListSessionsParams): Promise<PaginatedResponse<TestingSession>> {
        const { data } = await httpClient.get<PaginatedResponse<TestingSession>>('/testing/sessions', {
            params: withDefaultPagination(params),
        });
        return data;
    },
    async updateAnswers(sessionId: string, questionResponses: QuestionResponsePayload[]): Promise<void> {
        await httpClient.put(`/testing/sessions/${sessionId}/answers`, buildAnswersPayload(questionResponses));
    },
    async complete(sessionId: string): Promise<TestingSession> {
        const { data } = await httpClient.put<TestingSession>(`/testing/sessions/${sessionId}/complete`);
        return data;
    },
    async close(sessionId: string): Promise<void> {
        await httpClient.put(`/testing/sessions/${sessionId}/close`);
    },
};

export const isConflictError = (error: unknown): boolean => {
    return axios.isAxiosError(error) && error.response?.status === 409;
};

