import React, { useState, useEffect } from 'react';
import { Question } from '../types';

interface PopupProps {
  testId: number;
  onClose: () => void;
}

const mockQuestions: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      text: "Как часто вы чувствуете напряжение в последнее время?",
      options: [
        "Почти никогда",
        "Иногда",
        "Часто",
        "Постоянно"
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: "Насколько хорошо вы спите?",
      options: [
        "Очень хорошо",
        "Нормально",
        "Плохо",
        "Очень плохо"
      ],
      correctAnswer: 0
    },
    {
      id: 3,
      text: "Как вы справляетесь со сложными ситуациями?",
      options: [
        "Легко нахожу решение",
        "Обычно справляюсь",
        "Часто испытываю трудности",
        "Очень тяжело даются"
      ],
      correctAnswer: 0
    }
  ],
  2: [
    {
      id: 1,
      text: "Как легко вы понимаете чувства других людей?",
      options: [
        "Очень легко",
        "Довольно легко",
        "Иногда сложно",
        "Часто не понимаю"
      ],
      correctAnswer: 0
    }
  ]
};

const Popup: React.FC<PopupProps> = ({ testId, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const testQuestions = mockQuestions[testId] || [];
    setQuestions(testQuestions);
    setAnswers(new Array(testQuestions.length).fill(-1));
  }, [testId]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setTestCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div className="popup-overlay">
        <div className="popup-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка вопросов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Тест #{testId}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>

        <div className="popup-body">
          {!testCompleted ? (
            <div className="question-container">
              <div className="question-header">
                <span className="question-number">
                  Вопрос {currentQuestion + 1} из {questions.length}
                </span>
              </div>
              
              <h3 className="question-text">
                {questions[currentQuestion].text}
              </h3>

              <div className="options-container">
                {questions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`option ${
                      answers[currentQuestion] === index ? 'selected' : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                  </div>
                ))}
              </div>

              <div className="navigation-buttons">
                <button 
                  className="nav-button prev-button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Назад
                </button>
                
                <button 
                  className="nav-button next-button"
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === -1}
                >
                  {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                </button>
              </div>
            </div>
          ) : (
            <div className="results-container">
              <h3>Тест завершен!</h3>
              <p>Вы ответили на все вопросы.</p>
              
              <div className="results-stats">
                <p>Правильных ответов: {answers.filter((answer, index) => 
                  answer === questions[index].correctAnswer
                ).length} из {questions.length}</p>
              </div>

              <div className="results-actions">
                <button 
                  className="restart-button"
                  onClick={handleRestartTest}
                >
                  Пройти еще раз
                </button>
                <button 
                  className="close-results-button"
                  onClick={onClose}
                >
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;