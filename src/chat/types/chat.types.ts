export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

export interface LLMChatResponse {
    llmChatResponse: {
        message: string;
    };
}

export interface UseChatReturn {
    messages: Message[];
    sendMessage: (text: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearMessages: () => void;
}