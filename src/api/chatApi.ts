import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AnalysisRequest {
  message: string;
  testResults?: any[];
  userId?: string;
}

export interface AnalysisResponse {
  response: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

class ChatApi {
  private async request<T>(endpoint: string, data?: any): Promise<T> {
    try {
      // В реальном приложении здесь будет запрос к бэкенду
      // Сейчас имитируем API вызов
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      // Mock responses based on message content
      return this.mockAnalysis(data.message);
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Ошибка соединения с сервером');
    }
  }

  private mockAnalysis(message: string): AnalysisResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('стресс') || lowerMessage.includes('тревож')) {
      return {
        response: "На основе вашего описания я вижу признаки повышенного стресса. Рекомендую практиковать дыхательные упражнения, регулярную физическую активность и соблюдать режим сна. Если симптомы сохраняются более 2 недель,建议 обратиться к специалисту.",
        recommendations: [
          "Дыхательные упражнения 5-10 минут в день",
          "Регулярные прогулки на свежем воздухе",
          "Соблюдение режима сна 7-8 часов"
        ],
        riskLevel: 'medium'
      };
    }
    
    if (lowerMessage.includes('депресси') || lowerMessage.includes('плохое настроение')) {
      return {
        response: "Замечаю возможные признаки депрессивного состояния. Важно сохранять социальные контакты, заниматься приятными активностями и соблюдать режим дня. Рекомендую проконсультироваться с психологом для более точной оценки.",
        recommendations: [
          "Социальная активность с друзьями",
          "Регулярные физические упражнения",
          "Консультация специалиста"
        ],
        riskLevel: 'high'
      };
    }
    
    if (lowerMessage.includes('результат') || lowerMessage.includes('тест')) {
      return {
        response: "Для анализа результатов тестов, пожалуйста, опишите: 1) Название пройденного теста, 2) Ваши основные ответы, 3) Что вас беспокоит в результатах. Я помогу интерпретировать данные и дам рекомендации.",
        recommendations: [
          "Подробно опишите результаты теста",
          "Укажите беспокоящие вас аспекты",
          "Сохраняйте результаты для отслеживания динамики"
        ],
        riskLevel: 'low'
      };
    }
    
    return {
      response: "Спасибо за ваше сообщение! Чтобы я мог лучше помочь, пожалуйста, опишите: конкретные симптомы, результаты тестов или задайте конкретный вопрос о вашем психологическом состоянии. Я проанализирую информацию и дам персонализированные рекомендации.",
      recommendations: [
        "Опишите конкретные симптомы",
        "Поделитесь результатами тестов",
        "Задайте конкретный вопрос"
      ],
      riskLevel: 'low'
    };
  }

  async analyzeMessage(request: AnalysisRequest): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>('/chat/analyze', request);
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    // Mock история чата
    return [
      {
        id: 1,
        text: "Привет! Я ваш AI-помощник MindCheck. Я могу проанализировать результаты ваших тестов и помочь понять ваше психологическое состояние. Расскажите о своих результатах или задайте вопрос!",
        isUser: false,
        timestamp: new Date()
      }
    ];
  }

  async saveChatMessage(userId: string, message: ChatMessage): Promise<void> {
    // В реальном приложении здесь будет сохранение в базу
    console.log('Saving message:', { userId, message });
  }
}

export const chatApi = new ChatApi();