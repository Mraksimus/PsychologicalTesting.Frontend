// Типы для TypeScript - БЕЗ КАРТИНОК

// Тип для теста
export interface Test {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  time: number;
  category: string;
}

// Тип для вопроса в тесте
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

// Тип для состояния попапа (всплывающего окна)
export interface PopupState {
  isOpen: boolean;
  testId: number | null;
}

// Типы для AI-ассистента
export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AnalysisResult {
  hasConcerns: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  suggestedActions: string[];
}