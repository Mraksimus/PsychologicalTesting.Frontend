import React, { useState, useRef, useEffect } from 'react';

// Компонент AI-ассистента для анализа результатов тестов
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

  // Автопрокрутка к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Функция для анализа текста пользователя (имитация AI)
  const analyzeMessage = async (userMessage: string): Promise<string> => {
    // Имитация задержки AI-ответа
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Простой анализ ключевых слов для демонстрации
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
    
    // Стандартный ответ
    return "Спасибо за ваше сообщение! Чтобы я мог лучше помочь, пожалуйста, опишите: конкретные симптомы, результаты тестов или задайте конкретный вопрос о вашем психологическом состоянии. Я проанализирую информацию и дам персонализированные рекомендации.";
  };

  // Отправка сообщения
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAnalyzing(true);

    // Получаем ответ AI
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

  // Обработка нажатия Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Быстрые вопросы для пользователя
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
    <div className="ai-assistant">
      {/* Заголовок AI-ассистента */}
      <div className="ai-header">
        <div className="ai-icon">🧠</div>
        <div className="ai-title">
          <h3>AI-помощник MindCheck</h3>
          <p>Проанализирую ваши результаты и помогу с рекомендациями</p>
        </div>
      </div>

      {/* Чат с AI */}
      <div className="ai-chat-container">
        <div className="ai-chat-messages">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="message-avatar">
                {message.isUser ? '👤' : '🤖'}
              </div>
            </div>
          ))}
          
          {isAnalyzing && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span>AI анализирует...</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
              <div className="message-avatar">🤖</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Быстрые вопросы */}
        <div className="quick-questions">
          <p>Можете спросить:</p>
          <div className="quick-buttons">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Поле ввода сообщения */}
        <div className="ai-input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Опишите ваши результаты теста или задайте вопрос..."
            className="ai-input"
            rows={3}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isAnalyzing}
            className="ai-send-button"
          >
            Отправить
          </button>
        </div>
      </div>

      {/* Информация о возможностях AI */}
      <div className="ai-capabilities">
        <h4>Что я могу:</h4>
        <div className="capabilities-grid">
          <div className="capability-item">
            <span className="capability-icon">📊</span>
            <span>Анализ результатов тестов</span>
          </div>
          <div className="capability-item">
            <span className="capability-icon">🎯</span>
            <span>Персонализированные рекомендации</span>
          </div>
          <div className="capability-item">
            <span className="capability-icon">⚠️</span>
            <span>Оценка факторов риска</span>
          </div>
          <div className="capability-item">
            <span className="capability-icon">💡</span>
            <span>Советы по самопомощи</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;