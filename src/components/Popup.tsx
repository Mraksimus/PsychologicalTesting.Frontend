import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { testsApi, TestResult } from '../api/testsApi';
import { useAuth } from '../contexts/AuthContext';

interface PopupProps {
  testId: number;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ testId, onClose }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadQuestions();
  }, [testId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const testQuestions = await testsApi.getTestQuestions(testId);
      setQuestions(testQuestions);
      setAnswers(new Array(testQuestions.length).fill(-1));
    } catch (err: any) {
      console.error('Error loading questions:', err);
      setError(err.message || 'Ошибка загрузки вопросов');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleCompleteTest();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCompleteTest = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const results: Omit<TestResult, 'id'> = {
        testId,
        userId: user?.id || 'anonymous',
        answers,
        score: 0, // Будет рассчитано на бэкенде
        completedAt: new Date(),
        recommendations: []
      };

      const submittedResults = await testsApi.submitTestResults(results);
      setTestResults(submittedResults);
      setTestCompleted(true);
    } catch (err: any) {
      console.error('Error submitting test results:', err);
      setError(err.message || 'Ошибка сохранения результатов');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestartTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(-1));
    setTestCompleted(false);
    setTestResults(null);
    setError(null);
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p>Загрузка вопросов...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !testCompleted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '500px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#dc3545', marginBottom: '1rem' }}>Ошибка</h3>
          <p style={{ marginBottom: '2rem', color: '#666' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={loadQuestions}
            >
              Попробовать снова
            </button>
            <button
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #eee'
        }}>
          <h2 style={{ margin: 0 }}>Тест #{testId}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: '#666',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Прогресс бар */}
        <div style={{ height: '4px', background: '#eee', width: '100%' }}>
          <div 
            style={{
              height: '100%',
              background: '#007bff',
              transition: 'width 0.3s',
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>

        <div style={{ padding: '2rem' }}>
          {!testCompleted ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  Вопрос {currentQuestion + 1} из {questions.length}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.3rem', marginBottom: '2rem', color: '#2c3e50', lineHeight: '1.4' }}>
                {questions[currentQuestion]?.text}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {questions[currentQuestion]?.options.map((option, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      border: `2px solid ${answers[currentQuestion] === index ? '#007bff' : '#e9ecef'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      textAlign: 'left',
                      background: answers[currentQuestion] === index ? '#e7f3ff' : 'transparent'
                    }}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span style={{
                      background: answers[currentQuestion] === index ? '#007bff' : '#6c757d',
                      color: 'white',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span style={{ flex: 1 }}>{option}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button 
                  style={{
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    background: currentQuestion === 0 ? '#ccc' : '#6c757d',
                    color: 'white'
                  }}
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                >
                  Назад
                </button>
                
                <button 
                  style={{
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: '500',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    background: answers[currentQuestion] === -1 || submitting ? '#ccc' : '#007bff',
                    color: 'white'
                  }}
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === -1 || submitting}
                >
                  {submitting ? 'Сохранение...' : currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#28a745', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Тест завершен!
              </h3>
              
              {testResults && (
                <>
                  <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', margin: '2rem 0' }}>
                    <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem' }}>
                      Правильных ответов: {testResults.score} из {questions.length}
                    </p>
                    
                    {testResults.recommendations.length > 0 && (
                      <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                        <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Рекомендации:</p>
                        <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                          {testResults.recommendations.map((rec, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div style={{ 
                    background: '#e7f3ff', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    margin: '1rem 0',
                    border: '1px solid #b3d9ff'
                  }}>
                    <p style={{ margin: 0, color: '#0066cc', fontSize: '0.9rem' }}>
                      💡 Обсудите результаты с нашим AI-помощником для получения персонализированных рекомендаций!
                    </p>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button 
                  style={{
                    background: '#ffc107',
                    color: '#212529',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onClick={handleRestartTest}
                >
                  Пройти еще раз
                </button>
                <button 
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onClick={() => {
                    // Переход к AI-ассистенту для обсуждения результатов
                    onClose();
                    // Здесь можно добавить навигацию к чату
                  }}
                >
                  Обсудить с AI
                </button>
                <button 
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
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