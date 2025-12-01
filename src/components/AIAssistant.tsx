import React, { useState, useRef, useEffect } from 'react';
import { isAuthenticated } from '@/api/auth';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {useChat} from "@/chat/hooks/useChat";

const AIAssistant: React.FC = () => {
    const { messages, sendMessage, isLoading, isLoadingHistory, error } = useChat();
    const [inputMessage, setInputMessage] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Автоматическая прокрутка к последнему сообщению при изменении сообщений
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) {
            return;
        }

        setInputMessage('');
        await sendMessage(inputMessage);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickQuestions = [
        "Как анализировать результаты теста на стресс?",
        "У меня плохое настроение, что делать?",
        "Какие признаки тревожности?",
        "Как улучшить психическое здоровье?"
    ];

    const handleQuickQuestion = async (question: string) => {
        await sendMessage(question);
    };

    // Компоненты для кастомизации Markdown
    const MarkdownComponents = {
        p: ({ children }: any) => <p style={{ margin: '0 0 8px 0', lineHeight: '1.5' }}>{children}</p>,
        h1: ({ children }: any) => <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '16px 0 8px 0', color: '#2c3e50' }}>{children}</h1>,
        h2: ({ children }: any) => <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', margin: '14px 0 7px 0', color: '#2c3e50' }}>{children}</h2>,
        h3: ({ children }: any) => <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '12px 0 6px 0', color: '#2c3e50' }}>{children}</h3>,
        ul: ({ children }: any) => <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ul>,
        ol: ({ children }: any) => <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>{children}</ol>,
        li: ({ children }: any) => <li style={{ margin: '4px 0', lineHeight: '1.4' }}>{children}</li>,
        strong: ({ children }: any) => <strong style={{ fontWeight: 'bold', color: '#2c3e50' }}>{children}</strong>,
        em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
        blockquote: ({ children }: any) => (
            <blockquote style={{
                borderLeft: '4px solid #007bff',
                paddingLeft: '12px',
                margin: '12px 0',
                color: '#666',
                fontStyle: 'italic'
            }}>
                {children}
            </blockquote>
        ),
        code: ({ children, inline }: any) => {
            if (inline) {
                return <code style={{
                    background: '#f8f9fa',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '0.9em',
                    color: '#e83e8c'
                }}>{children}</code>;
            }
            return (
                <pre style={{
                    background: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '8px',
                    overflow: 'auto',
                    margin: '12px 0',
                    fontSize: '0.9em',
                    lineHeight: '1.4'
                }}>
                    <code>{children}</code>
                </pre>
            );
        },
        hr: () => <hr style={{ border: 'none', borderTop: '1px solid #e9ecef', margin: '16px 0' }} />,
        table: ({ children }: any) => (
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                margin: '12px 0',
                fontSize: '0.9em'
            }}>{children}</table>
        ),
        th: ({ children }: any) => (
            <th style={{
                border: '1px solid #dee2e6',
                padding: '8px',
                background: '#f8f9fa',
                fontWeight: 'bold',
                textAlign: 'left'
            }}>{children}</th>
        ),
        td: ({ children }: any) => (
            <td style={{
                border: '1px solid #dee2e6',
                padding: '8px'
            }}>{children}</td>
        )
    };

    // Если есть ошибка авторизации, показываем сообщение о необходимости перелогина
    if (!isAuthenticated() || (error && error.includes('Сессия истекла'))) {
        return (
            <div style={{
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
                <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                    {error && error.includes('Сессия истекла') ? 'Сессия истекла' : 'Доступ к AI-помощнику'}
                </h3>
                <p style={{ color: '#666', marginBottom: '2rem' }}>
                    {error && error.includes('Сессия истекла')
                        ? 'Ваша сессия истекла. Пожалуйста, войдите снова.'
                        : 'Для использования AI-помощника необходимо авторизоваться в системе'
                    }
                </p>
                <button
                    type="button"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        window.location.href = '/login';
                    }}
                >
                    Войти в систему
                </button>
            </div>
        );
    }

    return (
        <div style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <div style={{ fontSize: '3rem' }}>🧠</div>
                <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>AI-помощник MindCheck</h3>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
                        Подключен к психологическому API • Режим реального времени
                    </p>
                </div>
            </div>

            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e9ecef' }}>
                {error && !error.includes('Сессия истекла') && (
                    <div style={{
                        background: '#ffeaa7',
                        color: '#2d3436',
                        padding: '1rem',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                        border: '1px solid #fdcb6e'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <div
                    ref={messagesContainerRef}
                    style={{
                        height: '400px',
                        overflowY: 'auto',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '10px'
                    }}
                >
                    {isLoadingHistory ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            color: '#666',
                            fontStyle: 'italic'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <span>Загрузка истории сообщений...</span>
                                <div style={{ display: 'flex', gap: '2px' }}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#666',
                                        animation: 'typing 1.4s infinite ease-in-out'
                                    }} />
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#666',
                                        animation: 'typing 1.4s infinite ease-in-out',
                                        animationDelay: '-0.16s'
                                    }} />
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#666',
                                        animation: 'typing 1.4s infinite ease-in-out',
                                        animationDelay: '-0.32s'
                                    }} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map(message => (
                                <div
                                    key={message.id}
                                    style={{
                                        display: 'flex',
                                        marginBottom: '1.5rem',
                                        gap: '0.75rem',
                                        flexDirection: message.isUser ? 'row-reverse' : 'row'
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '70%',
                                        padding: '1rem',
                                        borderRadius: '15px',
                                        position: 'relative',
                                        background: message.isUser
                                            ? 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
                                            : 'white',
                                        color: message.isUser ? 'white' : '#333',
                                        border: message.isUser ? 'none' : '1px solid #e9ecef',
                                        borderBottomRightRadius: message.isUser ? '5px' : '15px',
                                        borderBottomLeftRadius: message.isUser ? '15px' : '5px',
                                        boxShadow: message.isUser ? 'none' : '0 2px 8px rgba(0,0,0,0.1)'
                                    }}>
                                        <div style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>
                                            {message.isUser ? (
                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                    {message.text}
                                                </div>
                                            ) : (
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={MarkdownComponents}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            )}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            opacity: 0.7,
                                            textAlign: message.isUser ? 'right' : 'left'
                                        }}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        flexShrink: 0,
                                        background: message.isUser ? '#007bff' : '#6c757d',
                                        color: 'white'
                                    }}>
                                        {message.isUser ? '👤' : '🤖'}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div style={{
                                    display: 'flex',
                                    marginBottom: '1.5rem',
                                    gap: '0.75rem'
                                }}>
                                    <div style={{
                                        padding: '1rem',
                                        borderRadius: '15px',
                                        background: 'white',
                                        border: '1px solid #e9ecef',
                                        borderBottomLeftRadius: '5px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#666',
                                            fontStyle: 'italic'
                                        }}>
                                            <span>AI анализирует...</span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: '#666',
                                                    animation: 'typing 1.4s infinite ease-in-out'
                                                }} />
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: '#666',
                                                    animation: 'typing 1.4s infinite ease-in-out',
                                                    animationDelay: '-0.16s'
                                                }} />
                                                <span style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background: '#666',
                                                    animation: 'typing 1.4s infinite ease-in-out',
                                                    animationDelay: '-0.32s'
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.2rem',
                                        flexShrink: 0,
                                        background: '#6c757d',
                                        color: 'white'
                                    }}>
                                        🤖
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ marginBottom: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
                        Быстрые вопросы:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {quickQuestions.map((question, index) => (
                            <button
                                type="button"
                                key={index}
                                style={{
                                    background: '#f8f9fa',
                                    border: '1px solid #dee2e6',
                                    borderRadius: '20px',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.85rem',
                                    color: '#495057',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onClick={() => handleQuickQuestion(question)}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#e9ecef';
                                    e.currentTarget.style.borderColor = '#adb5bd';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = '#f8f9fa';
                                    e.currentTarget.style.borderColor = '#dee2e6';
                                }}
                                disabled={isLoading || isLoadingHistory}
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Опишите ваши результаты теста или задайте вопрос..."
                        style={{
                            flex: 1,
                            padding: '1rem',
                            border: '1px solid #dee2e6',
                            borderRadius: '10px',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            minHeight: '60px',
                            opacity: isLoadingHistory ? 0.6 : 1
                        }}
                        disabled={isLoading || isLoadingHistory}
                        rows={3}
                    />
                    <button
                        type="button"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading || isLoadingHistory}
                        style={{
                            background: !inputMessage.trim() || isLoading || isLoadingHistory ? '#6c757d' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '1rem 1.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: !inputMessage.trim() || isLoading || isLoadingHistory ? 'not-allowed' : 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'background 0.2s'
                        }}
                    >
                        {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </div>

            <div style={{ padding: '2rem', background: '#f8f9fa' }}>
                <h4 style={{ marginBottom: '1rem', color: '#2c3e50', textAlign: 'center' }}>Что я могу:</h4>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                        <span>Анализ результатов тестов</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span>
                        <span>Персонализированные рекомендации</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                        <span>Оценка факторов риска</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>💡</span>
                        <span>Советы по самопомощи</span>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes typing {
                        0%, 60%, 100% { transform: translateY(0); }
                        30% { transform: translateY(-10px); }
                    }
                `}
            </style>
        </div>
    );
};

export default AIAssistant;