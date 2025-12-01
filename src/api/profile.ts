import axios from 'axios';
import { httpClient } from '@/shared/http/httpClient';
import { API_ROUTES } from '@/shared/config/apiConfig';
import { UserProfile, TestingSessionCardResponse } from '@/types';

export interface UpdateProfileRequest {
    name: string;
    surname: string;
    patronymic?: string;
}

export const profileApi = {
    async get(): Promise<UserProfile> {
        try {
            const response = await httpClient.get<UserProfile>(API_ROUTES.profile.get);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Профиль не найден');
                }
            }
            throw new Error('Не удалось загрузить профиль');
        }
    },

    async update(data: UpdateProfileRequest): Promise<string> {
        try {
            const response = await httpClient.put<string>(API_ROUTES.profile.update, data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    throw new Error('Некорректные данные');
                }
                if (error.response?.status === 404) {
                    throw new Error('Профиль не найден');
                }
            }
            throw new Error('Не удалось обновить профиль');
        }
    },

    async delete(): Promise<string> {
        try {
            const response = await httpClient.delete<string>(API_ROUTES.profile.delete);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error('Профиль не найден');
                }
            }
            throw new Error('Не удалось удалить аккаунт');
        }
    },

    async getSessions(params: { offset: number; limit: number }): Promise<TestingSessionCardResponse> {
        try {
            const queryParams = new URLSearchParams({
                offset: params.offset.toString(),
                limit: params.limit.toString(),
            });
            const response = await httpClient.get<TestingSessionCardResponse>(
                `${API_ROUTES.profile.sessions}?${queryParams}`,
            );
            return response.data;
        } catch (error) {
            throw new Error('Не удалось загрузить список сессий');
        }
    },
};

