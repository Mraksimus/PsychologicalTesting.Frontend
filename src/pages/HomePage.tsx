// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Welcome } from '../components/Welcome/Welcome';
import TestCard from '../components/TestCard';
import Popup from '../components/Popup';
import AIAssistant from '../components/AIAssistant';
import { Test, PopupState } from '../types';

// Моковые данные тестов
const mockTests: Test[] = [
    {
        id: 1,
        title: "Тест на уровень стресса",
        description: "Определите ваш текущий уровень стресса и получите рекомендации по его снижению",
        questionsCount: 15,
        time: 10,
        category: "Психология"
    },
    {
        id: 2,
        title: "Тест на эмоциональный интеллект",
        description: "Проверьте ваш EQ и узнайте сильные стороны вашего эмоционального интеллекта",
        questionsCount: 20,
        time: 15,
        category: "Психология"
    },
    {
        id: 3,
        title: "Тест на адаптацию к изменениям",
        description: "Узнайте, насколько хорошо вы справляетесь с переменами в жизни",
        questionsCount: 12,
        time: 8,
        category: "Развитие"
    }
];

const HomePage: React.FC = () => {
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [popup, setPopup] = useState<PopupState>({
        isOpen: false,
        testId: null
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setTests(mockTests);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenTest = (testId: number) => {
        setPopup({ isOpen: true, testId });
    };

    const handleClosePopup = () => {
        setPopup({ isOpen: false, testId: null });
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            {/* ХЭДЕР УБРАН ОТСЮДА */}

            <main style={{ padding: '20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Приветственная секция */}
                    <Welcome />

                    {/* Секция тестов */}
                    <section style={{ marginTop: '40px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                color: '#2c3e50'
                            }}>
                                Психологические тесты
                            </h2>
                            <p style={{
                                fontSize: '1.2rem',
                                color: '#666',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}>
                                Пройдите тесты и получите анализ от ИИ
                            </p>
                        </div>

                        {loading ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '3rem',
                                color: '#666'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid #f3f3f3',
                                    borderTop: '4px solid #007bff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginBottom: '1rem'
                                }}></div>
                                <p>Загрузка тестов...</p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '20px',
                                marginTop: '20px'
                            }}>
                                {tests.map(test => (
                                    <TestCard
                                        key={test.id}
                                        test={test}
                                        onStartTest={handleOpenTest}
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* AI ассистент */}
                    <section style={{ marginTop: '40px' }}>
                        <AIAssistant />
                    </section>
                </div>
            </main>

            {popup.isOpen && (
                <Popup
                    testId={popup.testId!}
                    onClose={handleClosePopup}
                />
            )}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default HomePage;