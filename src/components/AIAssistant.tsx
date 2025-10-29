import React, { useState, useRef, useEffect } from 'react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ id: number; text: string; isUser: boolean; timestamp: Date }>>([
    {
      id: 1,
      text: "Привет! Я ваш AI-помощник MindCheck. Я могу проанализировать результаты ваших тестов и помочь понять ваше психологическое состояние. Расскажите о своих результатах или задайте вопрос!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const analyzeMessage = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('стресс') || lowerMessage.includes('тревож')) {
      return "На основе вашего описания я вижу признаки повышенного стресса. Рекомендую практиковать дыхательные упражнения, регулярную физическую активность и соблюдать режим сна. Если симптомы сохраняются более 2 недель,建议 обратиться к специалисту.";
    }
    
    if (lowerMessage.includes('депресси') || lowerMessage.includes('плохое настроение')) {
      return "Замечаю возможные признаки депрессивного состояния. Важно сохранять социальные контакты, заниматься приятными активностями и соблюдать режим дня. Рекомендую проконсультироваться с психологом для более точной оценки.";
    }
    
    if (lowerMessage.includes('тревог') || lowerMessage.includes('паник')) {
      return "Похоже на симптомы тревожности. Попробуйте техники заземления, медитацию и ограничьте потребление кофеина. Регулярная практика релаксации может значительно улучшить состояние.";
    }
    
    if (lowerMessage.includes('результат') || lowerMessage.includes('тест')) {
      return "Для анализа результатов тестов, пожалуйста, опишите: 1) Название пройденного теста, 2) Ваши основные ответы, 3) Что вас беспокоит в результатах. Я помогу интерпретировать данные и дам рекомендации.";
    }
    
    if (lowerMessage.includes('помощь') || lowerMessage.includes('что делать')) {
      return "Я здесь чтобы помочь! Вы можете: 1) Поделиться результатами тестов для анализа, 2) Описать свои симптомы, 3) Задать вопросы о психологическом состоянии, 4) Получить рекомендации по самопомощи.";
    }
    
    return "Спасибо за ваше сообщение! Чтобы я мог лучше помочь, пожалуйста, опишите: конкретные симптомы, результаты тестов или задайте конкретный вопрос о вашем психологическом состоянии. Я проанализирую информацию и дам персонализированные рекомендации.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    const aiResponse = await analyzeMessage(inputMessage);
    
    const aiMessage = {
      id: messages.length + 2,
      text: aiResponse,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsAnalyzing(false);
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
                  cursor: 'pointer'
                }}
                onClick={() => handleQuickQuestion(question)}
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
              minHeight: '60px'
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
              whiteSpace: 'nowrap'
            }}
          >
            Отправить
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