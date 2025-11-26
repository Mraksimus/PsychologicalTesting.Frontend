import React from 'react';
import { useChat } from '../hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

export const ChatInterface: React.FC = () => {
    const { messages, sendMessage, isLoading, error } = useChat();

    return (
        <div className="chat-interface">
            {error && (
                <div className="ai-error">
                    ⚠️ {error}
                </div>
            )}
            <MessageList messages={messages} />
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
    );
};