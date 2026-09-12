import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import { API_ROUTES } from '@/shared/config/apiConfig';
import {
    ExistingSurveySession,
    FullSurveySession,
    PaginatedResponse,
    SessionAnswer,
    UpdateSurveyAnswersRequest,
} from '@/types';

interface ListSessionsParams {
    offset?: number;
    limit?: number;
}

const withDefaultPagination = (params?: ListSessionsParams) => ({
    offset: params?.offset ?? 0,
    limit: params?.limit ?? 50,
});

const buildAnswersPayload = (answers: SessionAnswer[]): UpdateSurveyAnswersRequest => ({
    answers,
});

interface CompleteResponse {
    session?: FullSurveySession;
}

export const surveySessionsApi = {
    async create(surveyId: string): Promise<FullSurveySession> {
        const { data } = await httpClient.post<FullSurveySession>(API_ROUTES.surveySessions.create(surveyId));
        return data;
    },
    async get(sessionId: string): Promise<FullSurveySession> {
        const { data } = await httpClient.get<FullSurveySession>(API_ROUTES.surveySessions.session(sessionId));
        return data;
    },
    async list(params?: ListSessionsParams): Promise<PaginatedResponse<ExistingSurveySession>> {
        const { data } = await httpClient.get<PaginatedResponse<ExistingSurveySession>>(
            API_ROUTES.surveySessions.base,
            { params: withDefaultPagination(params) },
        );
        return data;
    },
    async updateAnswers(sessionId: string, answers: SessionAnswer[]): Promise<void> {
        await httpClient.put(API_ROUTES.surveySessions.answers(sessionId), buildAnswersPayload(answers));
    },
    async complete(sessionId: string): Promise<FullSurveySession> {
        const { data } = await httpClient.put<FullSurveySession | CompleteResponse>(
            API_ROUTES.surveySessions.complete(sessionId),
        );
        const wrapped = (data as CompleteResponse).session;
        return wrapped ?? (data as FullSurveySession);
    },
    async close(sessionId: string): Promise<void> {
        await httpClient.put(API_ROUTES.surveySessions.close(sessionId));
    },
};

export const isSurveyConflictError = (error: unknown): boolean => {
    return axios.isAxiosError(error) && error.response?.status === 409;
};

export const isInactiveSurveyError = (error: unknown): boolean => {
    if (!axios.isAxiosError(error) || error.response?.status !== 400) {
        return false;
    }
    const data = error.response?.data as { description?: string } | undefined;
    return Boolean(data?.description?.toLowerCase().includes('not active'));
};

export const extractSurveyApiErrorMessage = (error: unknown, fallback: string): string => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { description?: string } | undefined;
        if (data?.description) {
            return data.description;
        }
    }
    return error instanceof Error ? error.message : fallback;
};
