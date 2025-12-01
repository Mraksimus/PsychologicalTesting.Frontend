import { PaginatedResponse, Test } from '@/types';
import { httpClient } from '@/shared/http/httpClient';

interface FetchTestsParams {
    offset?: number;
    limit?: number;
}

const DEFAULT_PARAMS: Required<FetchTestsParams> = {
    offset: 0,
    limit: 50,
};

export const fetchTests = async (params?: FetchTestsParams): Promise<PaginatedResponse<Test>> => {
    const { data } = await httpClient.get<PaginatedResponse<Test>>('/testing/tests', {
        params: {
            offset: params?.offset ?? DEFAULT_PARAMS.offset,
            limit: params?.limit ?? DEFAULT_PARAMS.limit,
        },
    });

    return data;
};
