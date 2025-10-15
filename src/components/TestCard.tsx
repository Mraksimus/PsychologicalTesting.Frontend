import React from 'react';
import { Test } from '../types';

// Пропсы для компонента карточки теста
interface TestCardProps {
  test: Test;
  onStartTest: (testId: number) => void;
}

// Компонент карточки теста - БЕЗ ИЗОБРАЖЕНИЙ
const TestCard: React.FC<TestCardProps> = ({ test, onStartTest }) => {
  // Функция для получения цвета градиента в зависимости от категории
  const getGradientByCategory = (category: string): string => {
    const gradients: { [key: string]: string } = {
      'Психология': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Развитие': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Коммуникации': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Здоровье': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };
    return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  // Функция для получения иконки в зависимости от категории
  const getIconByCategory = (category: string): string => {
    const icons: { [key: string]: string } = {
      'Психология': '🧠',
      'Развитие': '📈',
      'Коммуникации': '💬',
      'Здоровье': '❤️'
    };
    return icons[category] || '📊';
  };

  return (
    <div className="test-card">
      {/* Верхняя часть карточки с цветным градиентом вместо изображения */}
      <div 
        className="test-header"
        style={{ background: getGradientByCategory(test.category) }}
      >
        <div className="test-icon">
          {getIconByCategory(test.category)}
        </div>
        <div className="test-category">{test.category}</div>
      </div>

      {/* Контент карточки с информацией о тесте */}
      <div className="test-content">
        <h3 className="test-title">{test.title}</h3>
        <p className="test-description">{test.description}</p>
        
        {/* Мета-информация о тесте */}
        <div className="test-meta">
          <div className="test-meta-item">
            <span className="meta-icon">❓</span>
            <span>{test.questionsCount} вопросов</span>
          </div>
          <div className="test-meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{test.time} мин</span>
          </div>
        </div>

        {/* Кнопка начала теста */}
        <button 
          className="start-test-button"
          onClick={() => onStartTest(test.id)}
        >
          Начать тест
        </button>
      </div>
    </div>
  );
};

export default TestCard;