import {getToken} from "@/api/auth";

const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export interface ChatMessage {
    message: string;
}

export interface ChatResponse {
    llmChatResponse: {
        message: string;
    };
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
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data: ChatResponse = await response.json();
        return data.llmChatResponse.message;
    }
}