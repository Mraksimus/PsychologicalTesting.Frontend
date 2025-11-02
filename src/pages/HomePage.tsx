import React, { useState, useEffect } from 'react';
import { Welcome } from '@/components/Welcome/Welcome';
import TestCard from '@/components/TestCard';
import Popup from '../components/Popup';
import AIAssistant from '../components/AIAssistant';
import { Test, PopupState } from '@/types';

// Моковые данные
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

// Данные психологов команды
const teamPsychologists = [
    {
        id: 1,
        name: "Анна Иванова",
        position: "Ведущий психолог",
        specialization: "Клиническая психология, стресс-менеджмент",
        experience: "8 лет",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: 2,
        name: "Максим Петров",
        position: "Психолог-консультант",
        specialization: "Эмоциональный интеллект, коммуникации",
        experience: "6 лет",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: 3,
        name: "Елена Смирнова",
        position: "Когнитивно-поведенческий терапевт",
        specialization: "Тревожность, саморегуляция",
        experience: "7 лет",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: 4,
        name: "Дмитрий Козлов",
        position: "Нейропсихолог",
        specialization: "Адаптация к изменениям, развитие",
        experience: "5 лет",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: 5,
        name: "Ольга Николаева",
        position: "Психодиагност",
        specialization: "Психологическое тестирование, анализ",
        experience: "9 лет",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    },
    {
        id: 6,
        name: "Иван Соколов",
        position: "Психолог-исследователь",
        specialization: "Методология, валидация тестов",
        experience: "6 лет",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face"
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
        // СКРОЛЛИМ НАВЕРХ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
        window.scrollTo(0, 0);
        
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
        <div style={{ minHeight: '100vh', position: 'relative' }}>
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
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                Психологические тесты
                            </h2>
                            <p style={{ 
                                fontSize: '1.2rem', 
                                color: 'rgba(255,255,255,0.9)', 
                                maxWidth: '600px', 
                                margin: '0 auto',
                                textShadow: '0 1px 5px rgba(0,0,0,0.3)'
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
                                color: 'white' 
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    borderTop: '4px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginBottom: '1rem'
                                }}></div>
                                <p style={{ color: 'white' }}>Загрузка тестов...</p>
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

                    {/* Секция "О проекте" */}
                    <section style={{ 
                        marginTop: '80px', 
                        padding: '40px 0',
                        borderTop: '2px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ 
                                fontSize: '2.5rem', 
                                marginBottom: '1.5rem', 
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                О проекте
                            </h2>
                            
                            <div style={{
                                background: 'rgba(255,255,255,0.95)',
                                padding: '2.5rem',
                                borderRadius: '15px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                maxWidth: '900px',
                                margin: '0 auto',
                                textAlign: 'left'
                            }}>
                                <p style={{ 
                                    fontSize: '1.1rem', 
                                    lineHeight: '1.7',
                                    color: '#333',
                                    marginBottom: '1.5rem'
                                }}>
                                    <strong>MindCheck</strong> — это инновационный сервис психологического тестирования, 
                                    созданный специально для студентов Московского технического университета 
                                    связи и информатики (МТУСИ). 
                                </p>
                                
                                <p style={{ 
                                    fontSize: '1.1rem', 
                                    lineHeight: '1.7',
                                    color: '#333',
                                    marginBottom: '1.5rem'
                                }}>
                                    Мы — команда профессиональных психологов, которые понимают уникальные 
                                    вызовы и потребности современного студента. Наша миссия — помочь вам 
                                    лучше понять себя, свои эмоции и поведенческие паттерны, чтобы успешно 
                                    справляться с академическими нагрузками и личными вызовами.
                                </p>
                                
                                <p style={{ 
                                    fontSize: '1.1rem', 
                                    lineHeight: '1.7',
                                    color: '#333',
                                    marginBottom: '0'
                                }}>
                                    С помощью наших scientifically-validated тестов и AI-ассистента вы 
                                    получите не просто результаты, а персонализированные рекомендации 
                                    и практические инструменты для улучшения психологического благополучия 
                                    и академической успеваемости.
                                </p>
                            </div>
                        </div>

                        {/* Команда психологов */}
                        <div style={{ marginTop: '3rem' }}>
                            <h3 style={{ 
                                textAlign: 'center', 
                                fontSize: '2rem', 
                                marginBottom: '2rem', 
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                            }}>
                                Наша команда психологов
                            </h3>
                            
                            <div style={{
                                position: 'relative',
                                maxWidth: '100%',
                                overflowX: 'auto',
                                padding: '1rem 0'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '1.5rem',
                                    padding: '0 1rem',
                                    minWidth: 'min-content'
                                }}>
                                    {teamPsychologists.map(psychologist => (
                                        <div key={psychologist.id} style={{
                                            background: 'rgba(255,255,255,0.95)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            minWidth: '280px',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease'
                                        }}>
                                            <img 
                                                src={psychologist.photo} 
                                                alt={psychologist.name}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    margin: '0 auto 1rem',
                                                    border: '4px solid #667eea'
                                                }}
                                            />
                                            <h4 style={{ 
                                                fontSize: '1.3rem', 
                                                marginBottom: '0.5rem',
                                                color: '#2c3e50'
                                            }}>
                                                {psychologist.name}
                                            </h4>
                                            <p style={{ 
                                                color: '#667eea',
                                                fontWeight: '600',
                                                marginBottom: '0.5rem',
                                                fontSize: '0.95rem'
                                            }}>
                                                {psychologist.position}
                                            </p>
                                            <p style={{ 
                                                color: '#666',
                                                fontSize: '0.9rem',
                                                marginBottom: '0.5rem',
                                                lineHeight: '1.4'
                                            }}>
                                                {psychologist.specialization}
                                            </p>
                                            <p style={{ 
                                                color: '#888',
                                                fontSize: '0.85rem',
                                                margin: 0
                                            }}>
                                                Опыт: {psychologist.experience}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Индикатор скролла */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: '1rem',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '0.9rem'
                            }}>
                                ← Прокрутите, чтобы увидеть всю команду →
                            </div>
                        </div>
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
                    
                    /* Стили для скролла команды */
                    .team-scroll-container::-webkit-scrollbar {
                        height: 8px;
                    }
                    
                    .team-scroll-container::-webkit-scrollbar-track {
                        background: rgba(255,255,255,0.1);
                        border-radius: 4px;
                    }
                    
                    .team-scroll-container::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.3);
                        border-radius: 4px;
                    }
                    
                    .team-scroll-container::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.5);
                    }
                `}
            </style>
        </div>
    );
};

export default HomePage;