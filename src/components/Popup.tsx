import React, { useState, useEffect } from 'react';
import { Question } from '@/types';

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
                        }} />
                        <p>Загрузка вопросов...</p>
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
                        type="button"
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

                <div style={{ height: '4px', background: '#eee', width: '100%' }}>
                    <div
                        style={{
                            height: '100%',
                            background: '#007bff',
                            transition: 'width 0.3s',
                            width: `${((currentQuestion + 1) / questions.length) * 100}%`
                        }}
                    />
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
                                {questions[currentQuestion].text}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        type="button"
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
                                            background: answers[currentQuestion] === index ? '#e7f3ff' : 'transparent',
                                            width: '100%'
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
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                                <button
                                    type="button"
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
                                    type="button"
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        background: answers[currentQuestion] === -1 ? '#ccc' : '#007bff',
                                        color: 'white'
                                    }}
                                    onClick={handleNextQuestion}
                                    disabled={answers[currentQuestion] === -1}
                                >
                                    {currentQuestion === questions.length - 1 ? 'Завершить' : 'Далее'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ color: '#28a745', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                ✅ Тест успешно пройден!
                            </h3>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                                <button
                                    type="button"
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
                                    type="button"
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