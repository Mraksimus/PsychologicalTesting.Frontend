import { useState, useCallback, useEffect } from 'react';
import { ChatApiService } from '../services/chatApi';
import { ChatMessage } from '@/types';
import { isAuthenticated, logout } from '@/api/auth';

export interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (text: string) => Promise<void>;
    isLoading: boolean;
    isLoadingHistory: boolean;
    error: string | null;
    clearMessages: () => void;
    loadHistory: () => Promise<void>;
}

export const useChat = (): UseChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Загрузка истории сообщений
    const loadHistory = useCallback(async () => {
        if (!isAuthenticated()) {
            return;
        }

        setIsLoadingHistory(true);
        setError(null);

        try {
            const history = await ChatApiService.getHistory();

            const historyMessages: ChatMessage[] = history.map((item, index) => ({
                id: index + 1,
                text: item.content,
                isUser: item.role === 'USER',
                timestamp: new Date(),
            }));

            setMessages(historyMessages);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки истории';

            if (errorMessage.includes('401')) {
                logout();
                setError('Сессия истекла. Пожалуйста, войдите снова.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoadingHistory(false);
        }
    }, []);

    // Загружаем историю при монтировании
    useEffect(() => {
        if (isAuthenticated()) {
            loadHistory();
        }
    }, [loadHistory]);

    const sendMessage = useCallback(async (text: string) => {
        if (!isAuthenticated()) {
            setError('Для использования чата необходимо авторизоваться');
            return;
        }

        if (!text.trim()) {
            return;
        }

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

            // Если ошибка 401 - разлогиниваем пользователя
            if (errorMessage.includes('401')) {
                logout();
                setError('Сессия истекла. Пожалуйста, войдите снова.');
            } else {
                setError(errorMessage);

                const errorResponse: ChatMessage = {
                    id: Date.now() + 1,
                    text: `Извините, произошла ошибка: ${errorMessage}. Пожалуйста, попробуйте еще раз.`,
                    isUser: false,
                    timestamp: new Date(),
                };

                setMessages(prev => [...prev, errorResponse]);
            }
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
        isLoadingHistory,
        error,
        clearMessages,
        loadHistory,
    };
};