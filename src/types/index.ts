export interface Test {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  time: number;
  category: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface PopupState {
  isOpen: boolean;
  testId: number | null;
}

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