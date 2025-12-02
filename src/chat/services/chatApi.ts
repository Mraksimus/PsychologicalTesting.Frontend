import { httpClient } from '@/shared/http/httpClient';

export interface ChatResponse {
    message: string;
}

export interface HistoryMessage {
    role: 'USER' | 'ASSISTANT';
    content: string;
}

export class ChatApiService {
    static async sendMessage(message: string): Promise<string> {
        try {
            const response = await httpClient.post<ChatResponse>('/chat', { message });
            return response.data.message;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Ошибка авторизации: неверный или просроченный токен');
            } else if (error.response?.status === 403) {
                throw new Error('Доступ запрещен');
            } else if (error.response?.status >= 500) {
                throw new Error('Ошибка сервера. Пожалуйста, попробуйте позже');
            } else {
                throw new Error(error.response?.data?.message || `Ошибка API: ${error.response?.status || 'Неизвестная ошибка'}`);
            }
        }
    }

    static async getHistory(): Promise<HistoryMessage[]> {
        try {
            const response = await httpClient.get<HistoryMessage[]>('/chat');
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Ошибка авторизации: неверный или просроченный токен');
            } else if (error.response?.status === 403) {
                throw new Error('Доступ запрещен');
            } else {
                throw new Error(error.response?.data?.message || `Ошибка загрузки истории: ${error.response?.status || 'Неизвестная ошибка'}`);
            }
        }
    }
}