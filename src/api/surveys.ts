import { httpClient } from '@/shared/http/httpClient';
import { API_ROUTES } from '@/shared/config/apiConfig';
import { PaginatedResponse, Survey } from '@/types';

interface FetchSurveysParams {
    offset?: number;
    limit?: number;
}

const DEFAULT_PARAMS: Required<FetchSurveysParams> = {
    offset: 0,
    limit: 50,
};

export const fetchSurveys = async (params?: FetchSurveysParams): Promise<PaginatedResponse<Survey>> => {
    const { data } = await httpClient.get<PaginatedResponse<Survey>>(API_ROUTES.surveys.list, {
        params: {
            offset: params?.offset ?? DEFAULT_PARAMS.offset,
            limit: params?.limit ?? DEFAULT_PARAMS.limit,
        },
    });
    return data;
};
