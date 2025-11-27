import axios from 'axios';
import { PaginatedResponse, Test } from '@/types';
import { httpClient } from '@/shared/http/httpClient';
import { API_ROUTES } from '@/shared/config/apiConfig';

interface RemoteTest {
    id: number;
    name?: string;
    title?: string;
    description?: string;
    durationMins?: number;
    category?: string;
    questionsCount?: number;
    popularity?: number;
    isNew?: boolean;
}

const mapRemoteTest = (test: RemoteTest): Test => ({
    id: Number(test.id),
    name: test.name ?? test.title ?? 'Без названия',
    description: test.description ?? 'Описание недоступно',
    durationMins: test.durationMins ?? 10,
    category: test.category ?? 'Психология',
    questionsCount: test.questionsCount ?? 10,
    popularity: test.popularity,
    isNew: test.isNew,
});

export const fetchTests = async (offset = 0, limit = 10): Promise<PaginatedResponse<Test>> => {
    try {
        const response = await httpClient.get<PaginatedResponse<RemoteTest>>(API_ROUTES.tests.list, {
            params: { offset, limit },
        });

        return {
            ...response.data,
            items: response.data.items.map(mapRemoteTest),
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Требуется авторизация');
            }
        }

        throw new Error('Не удалось загрузить список тестов');
    }
};

export const fetchTestById = async (testId: number): Promise<Test> => {
    try {
        const response = await httpClient.get<RemoteTest>(API_ROUTES.tests.details(testId));
        return mapRemoteTest(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
                throw new Error('Тест не найден');
            }
        }

        throw new Error('Не удалось загрузить тест');
    }
};
