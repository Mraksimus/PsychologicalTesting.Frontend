import { useState, useCallback } from 'react';
import { ChatApiService } from '../services/chatApi';
import { ChatMessage } from '@/types';
import { isAuthenticated } from '@/api/auth';

export interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearMessages: () => void;
}

export const useChat = (): UseChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (text: string) => {
        if (!isAuthenticated()) {
            setError('Для использования чата необходимо авторизоваться');
            return;
        }
        if (!text.trim()) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await ChatApiService.sendMessage(text.trim());

            const botMessage: ChatMessage = {
                id: Date.now() + 1,
                text: response,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке сообщения';
            setError(errorMessage);

            const errorResponse: ChatMessage = {
                id: Date.now() + 1,
                text: `Извините, произошла ошибка: ${errorMessage}. Пожалуйста, попробуйте еще раз.`,
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        sendMessage,
        isLoading,
        error,
        clearMessages,
    };
};