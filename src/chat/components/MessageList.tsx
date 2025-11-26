import React from 'react';
import {ChatMessage} from "@/types";

interface MessageListProps {
    messages: ChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="ai-chat-messages">
            {messages.map(message => (
                <div
                    key={message.id}
                    className={message.isUser ? 'message user-message' : 'message ai-message'}
                >
                    <div className="message-avatar">
                        {message.isUser ? '👤' : '🤖'}
                    </div>
                    <div className="message-content">
                        <div className="message-text">
                            {message.text}
                        </div>
                        <div className="message-time">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};