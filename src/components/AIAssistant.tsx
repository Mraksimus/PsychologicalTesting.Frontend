import React, { useState, useRef, useEffect } from 'react';
import { chatApi, AnalysisRequest } from '../api/chatApi';
import { useAuth } from '../contexts/AuthContext';

const AIAssistant: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      if (user) {
        const history = await chatApi.getChatHistory(user.id);
        setMessages(history);
      } else {
        // Default welcome message for non-authenticated users
        setMessages([{
          id: 1,
          text: "Привет! Я ваш AI-помощник MindCheck. Я могу проанализировать результаты ваших тестов и помочь понять ваше психологическое состояние. Расскажите о своих результатах или задайте вопрос!",
          isUser: false,
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      setMessages([{
        id: 1,
        text: "Привет! Я ваш AI-помощник MindCheck. Я могу проанализировать результаты ваших тестов и помочь понять ваше психологическое состояние. Расскажите о своих результатах или задайте вопрос!",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);
    setError(null);

    try {
      // Сохраняем сообщение пользователя
      if (user) {
        await chatApi.saveChatMessage(user.id, userMessage);
      }

      // Получаем ответ от API
      const request: AnalysisRequest = {
        message: inputMessage,
        userId: user?.id
      };

      const response = await chatApi.analyzeMessage(request);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Сохраняем ответ AI
      if (user) {
        await chatApi.saveChatMessage(user.id, aiMessage);
      }

    } catch (err: any) {
      console.error('Error analyzing message:', err);
      setError(err.message || 'Произошла ошибка при анализе сообщения');
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "Извините, произошла ошибка при обработке вашего сообщения. Пожалуйста, попробуйте еще раз.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
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

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

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
            Проанализирую ваши результаты и помогу с рекомендациями
          </p>
        </div>
      </div>

      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e9ecef' }}>
        {/* Сообщение об ошибке */}
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            border: '1px solid #f5c6cb'
          }}>
            {error}
          </div>
        )}

        <div style={{
          height: '400px',
          overflowY: 'auto',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '10px'
        }}>
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
                  {message.text}
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
          
          {isAnalyzing && (
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
                    }}></span>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#666',
                      animation: 'typing 1.4s infinite ease-in-out',
                      animationDelay: '-0.16s'
                    }}></span>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#666',
                      animation: 'typing 1.4s infinite ease-in-out',
                      animationDelay: '-0.32s'
                    }}></span>
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
          
          <div ref={messagesEndRef} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ marginBottom: '0.75rem', color: '#666', fontSize: '0.9rem' }}>
            Можете спросить:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                style={{
                  background: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  color: '#495057',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleQuickQuestion(question)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e9ecef';
                  e.currentTarget.style.borderColor = '#adb5bd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#dee2e6';
                }}
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
              transition: 'border-color 0.3s'
            }}
            rows={3}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isAnalyzing}
            style={{
              background: !inputMessage.trim() || isAnalyzing ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '1rem 1.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: !inputMessage.trim() || isAnalyzing ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.3s'
            }}
          >
            {isAnalyzing ? 'Анализ...' : 'Отправить'}
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
    </div>
  );
};

export default AIAssistant;