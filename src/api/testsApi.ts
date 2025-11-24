import { Test, Question } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export interface TestResult {
  testId: number;
  userId: string;
  answers: number[];
  score: number;
  completedAt: Date;
  recommendations: string[];
}

class TestsApi {
  private async request<T>(endpoint: string): Promise<T> {
    try {
      // Имитация API вызова
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
      
      // Mock данные
      return this.mockData[endpoint] as T;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Ошибка загрузки данных');
    }
  }

  private mockData: { [key: string]: any } = {
    '/tests': [
      {
        id: 1,
        title: "Тест на уровень стресса",
        description: "Определите ваш текущий уровень стресса и получите рекомендации по его снижению",
        questionsCount: 15,
        time: 10,
        category: "Психология",
        popularity: 95,
        isNew: true
      },
      {
        id: 2,
        title: "Тест на эмоциональный интеллект",
        description: "Проверьте ваш EQ и узнайте сильные стороны вашего эмоционального интеллекта",
        questionsCount: 20,
        time: 15,
        category: "Психология",
        popularity: 87,
        isNew: false
      },
      {
        id: 3,
        title: "Тест на адаптацию к изменениям",
        description: "Узнайте, насколько хорошо вы справляетесь с переменами в жизни",
        questionsCount: 12,
        time: 8,
        category: "Развитие",
        popularity: 76,
        isNew: true
      },
      {
        id: 4,
        title: "Тест на тревожность",
        description: "Оцените уровень тревожности и получите рекомендации по управлению",
        questionsCount: 18,
        time: 12,
        category: "Психология",
        popularity: 82,
        isNew: false
      },
      {
        id: 5,
        title: "Тест на выгорание",
        description: "Определите признаки профессионального и эмоционального выгорания",
        questionsCount: 16,
        time: 10,
        category: "Профессия",
        popularity: 79,
        isNew: false
      },
      {
        id: 6,
        title: "Тест коммуникативных навыков",
        description: "Проверьте ваши навыки общения и эффективной коммуникации",
        questionsCount: 14,
        time: 8,
        category: "Развитие",
        popularity: 71,
        isNew: true
      }
    ],
    '/tests/1/questions': [
      {
        id: 1,
        text: "Как часто вы чувствуете напряжение в последнее время?",
        options: ["Почти никогда", "Иногда", "Часто", "Постоянно"],
        correctAnswer: 0
      },
      {
        id: 2,
        text: "Насколько хорошо вы спите?",
        options: ["Очень хорошо", "Нормально", "Плохо", "Очень плохо"],
        correctAnswer: 0
      },
      {
        id: 3,
        text: "Как вы справляетесь со сложными ситуациями?",
        options: ["Легко нахожу решение", "Обычно справляюсь", "Часто испытываю трудности", "Очень тяжело даются"],
        correctAnswer: 0
      }
    ],
    '/tests/2/questions': [
      {
        id: 1,
        text: "Как легко вы понимаете чувства других людей?",
        options: ["Очень легко", "Довольно легко", "Иногда сложно", "Часто не понимаю"],
        correctAnswer: 0
      }
    ]
  };

  async getAllTests(): Promise<Test[]> {
    return this.request<Test[]>('/tests');
  }

  async getTestById(id: number): Promise<Test> {
    const tests = await this.getAllTests();
    const test = tests.find(t => t.id === id);
    if (!test) {
      throw new Error('Тест не найден');
    }
    return test;
  }

  async getTestQuestions(testId: number): Promise<Question[]> {
    return this.request<Question[]>(`/tests/${testId}/questions`);
  }

  async submitTestResults(results: Omit<TestResult, 'id'>): Promise<TestResult> {
    // Имитация сохранения результатов
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const score = results.answers.filter((answer, index) => {
      // Mock логика подсчета очков
      return answer === 0 || answer === 1; // Первые два ответа обычно "правильные"
    }).length;

    const fullResults: TestResult = {
      ...results,
      score,
      recommendations: [
        "Регулярно практикуйте техники релаксации",
        "Соблюдайте режим дня",
        "Обратитесь к специалисту при сохранении симптомов"
      ]
    };

    console.log('Test results saved:', fullResults);
    return fullResults;
  }

  async getUserTestHistory(userId: string): Promise<TestResult[]> {
    // Mock история тестов пользователя
    return [
      {
        testId: 1,
        userId,
        answers: [0, 1, 2],
        score: 2,
        completedAt: new Date('2024-01-20T14:30:00Z'),
        recommendations: ["Регулярные прогулки", "Дыхательные упражнения"]
      }
    ];
  }
}

export const testsApi = new TestsApi();