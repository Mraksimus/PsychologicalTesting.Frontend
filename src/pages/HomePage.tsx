import React, { useState, useEffect } from 'react';
import { Welcome } from '../components/Welcome/Welcome';
import TestCard from '../components/TestCard';
import Popup from '../components/Popup';
import AIAssistant from '../components/AIAssistant';
import { Test, PopupState } from '../types';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();
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

    const handleViewAllTests = () => {
        navigate('/tests');
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <main style={{ padding: '20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Приветственная секция */}
                    <Welcome />

                    {/* Секция тестов */}
                    <section style={{ marginTop: '60px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1rem',
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                fontWeight: '700'
                            }}>
                                Психологические тесты
                            </h2>
                            <p style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255,255,255,0.9)',
                                maxWidth: '600px',
                                margin: '0 auto',
                                textShadow: '0 1px 5px rgba(0,0,0,0.3)',
                                lineHeight: '1.6'
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
                                padding: '4rem',
                                color: 'white'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    borderTop: '4px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    marginBottom: '1.5rem'
                                }}></div>
                                <p style={{
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    opacity: 0.8
                                }}>
                                    Загрузка тестов...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                    gap: '25px',
                                    marginBottom: '40px'
                                }}>
                                    {tests.map(test => (
                                        <TestCard
                                            key={test.id}
                                            test={test}
                                            onStartTest={handleOpenTest}
                                        />
                                    ))}
                                </div>

                                {/* Кнопка "Посмотреть еще" */}
                                <div style={{
                                    textAlign: 'center',
                                    position: 'relative',
                                    marginTop: '2rem'
                                }}>
                                    {/* Декоративная линия */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '100%',
                                        height: '1px',
                                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                        zIndex: 1
                                    }}></div>

                                    {/* Кнопка */}
                                    <button
                                        onClick={handleViewAllTests}
                                        style={{
                                            position: 'relative',
                                            zIndex: 2,
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            border: 'none',
                                            borderRadius: '50px',
                                            padding: '14px 36px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            color: '#4a6cf7',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 20px rgba(74, 108, 247, 0.25)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            backdropFilter: 'blur(10px)',
                                            fontFamily: 'inherit'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 6px 25px rgba(74, 108, 247, 0.35)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.95)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(74, 108, 247, 0.25)';
                                        }}
                                    >
                                        <span>Посмотреть еще</span>
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            style={{ transition: 'transform 0.2s ease' }}
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </section>

                    {/* AI ассистент */}
                    <section style={{ marginTop: '80px' }}>
                        <AIAssistant />
                    </section>

                    {/* Секция "О проекте" */}
                    <section
                        id="about"  // ✅ ДОБАВЬТЕ ID
                        style={{
                            marginTop: '100px',
                            padding: '60px 0',
                            borderTop: '2px solid rgba(255,255,255,0.15)'
                        }}>
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                marginBottom: '1.5rem',
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                fontWeight: '700'
                            }}>
                                О проекте
                            </h2>

                            <div style={{
                                background: 'rgba(255,255,255,0.95)',
                                padding: '3rem',
                                borderRadius: '20px',
                                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
                                maxWidth: '900px',
                                margin: '0 auto',
                                textAlign: 'left',
                                backdropFilter: 'blur(10px)'
                            }}>
                                <p style={{
                                    fontSize: '1.15rem',
                                    lineHeight: '1.7',
                                    color: '#333',
                                    marginBottom: '1.5rem'
                                }}>
                                    <strong style={{ color: '#4a6cf7' }}>MindCheck</strong> — это инновационный сервис психологического тестирования,
                                    созданный специально для студентов Московского технического университета
                                    связи и информатики (МТУСИ).
                                </p>

                                <p style={{
                                    fontSize: '1.15rem',
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
                                    fontSize: '1.15rem',
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
                        <div style={{ marginTop: '4rem' }}>
                            <h3 style={{
                                textAlign: 'center',
                                fontSize: '2.2rem',
                                marginBottom: '3rem',
                                color: 'white',
                                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                fontWeight: '600'
                            }}>
                                Наша команда психологов
                            </h3>

                            <div style={{
                                position: 'relative',
                                maxWidth: '100%',
                                overflowX: 'auto',
                                padding: '2rem 0',
                                cursor: 'grab'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '2rem',
                                    padding: '0 2rem',
                                    minWidth: 'min-content'
                                }}>
                                    {teamPsychologists.map(psychologist => (
                                        <div
                                            key={psychologist.id}
                                            style={{
                                                background: 'rgba(255,255,255,0.95)',
                                                borderRadius: '20px',
                                                padding: '2rem',
                                                minWidth: '300px',
                                                textAlign: 'center',
                                                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <img
                                                src={psychologist.photo}
                                                alt={psychologist.name}
                                                style={{
                                                    width: '120px',
                                                    height: '120px',
                                                    borderRadius: '50%',
                                                    objectFit: 'cover',
                                                    margin: '0 auto 1.5rem',
                                                    border: '4px solid #4a6cf7',
                                                    boxShadow: '0 4px 15px rgba(74, 108, 247, 0.3)'
                                                }}
                                            />
                                            <h4 style={{
                                                fontSize: '1.4rem',
                                                marginBottom: '0.75rem',
                                                color: '#2c3e50',
                                                fontWeight: '600'
                                            }}>
                                                {psychologist.name}
                                            </h4>
                                            <p style={{
                                                color: '#4a6cf7',
                                                fontWeight: '600',
                                                marginBottom: '0.75rem',
                                                fontSize: '1rem'
                                            }}>
                                                {psychologist.position}
                                            </p>
                                            <p style={{
                                                color: '#666',
                                                fontSize: '0.95rem',
                                                marginBottom: '0.75rem',
                                                lineHeight: '1.5'
                                            }}>
                                                {psychologist.specialization}
                                            </p>
                                            <p style={{
                                                color: '#888',
                                                fontSize: '0.9rem',
                                                margin: 0,
                                                fontWeight: '500'
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
                                marginTop: '2rem',
                                color: 'rgba(255,255,255,0.7)',
                                fontSize: '1rem',
                                fontStyle: 'italic'
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