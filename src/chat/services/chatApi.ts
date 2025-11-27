import { getToken } from '@/api/auth';

const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export interface ChatResponse {
    message: string;
}

export interface HistoryMessage {
    role: 'USER' | 'ASSISTANT';
    content: string;
}

export class ChatApiService {
    static async sendMessage(message: string): Promise<string> {
        const token = getToken();

        if (!token) {
            throw new Error('Пользователь не авторизован');
        }

        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Ошибка авторизации: неверный или просроченный токен');
            } else if (response.status === 403) {
                throw new Error('Доступ запрещен');
            } else if (response.status >= 500) {
                throw new Error('Ошибка сервера. Пожалуйста, попробуйте позже');
            } else {
                throw new Error(`Ошибка API: ${response.status}`);
            }
        }

        const data: ChatResponse = await response.json();
        return data.message;
    }

    static async getHistory(): Promise<HistoryMessage[]> {
        const token = getToken();

        if (!token) {
            throw new Error('Пользователь не авторизован');
        }

        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Ошибка авторизации: неверный или просроченный токен');
            } else if (response.status === 403) {
                throw new Error('Доступ запрещен');
            } else {
                throw new Error(`Ошибка загрузки истории: ${response.status}`);
            }
        }

        return await response.json();
    }
}