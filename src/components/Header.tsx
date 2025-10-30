// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    // Mock данные пользователя (в реальном приложении это будет из контекста или store)
    const currentUser = {
        fullName: 'Иванов Иван Иванович'
    };

    return (
        <header style={{
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '1rem 0',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
            <span
                style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#007bff',
                    cursor: 'pointer',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onClick={() => navigate('/home')}
            >
              MindCheck
            </span>
                    </div>

                    <nav>
                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '2rem',
                            margin: 0,
                            padding: 0
                        }}>
                            <li>
                                <a
                                    href="/home"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#333',
                                        fontWeight: '500',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                >
                                    Главная
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#tests"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#333',
                                        fontWeight: '500',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                >
                                    Тесты
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    style={{
                                        textDecoration: 'none',
                                        color: '#333',
                                        fontWeight: '500',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#007bff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
                                >
                                    О проекте
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        {/* Имя пользователя */}
                        <div
                            style={{
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                background: 'rgba(102, 126, 234, 0.1)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={handleProfileClick}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                                e.currentTarget.style.color = '#667eea';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                                e.currentTarget.style.color = '#333';
                            }}
                            title="Перейти в профиль"
                        >
                            {currentUser.fullName}
                        </div>

                        {/* Кнопка профиля (иконка человечка) */}
                        <button
                            onClick={handleProfileClick}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.3rem',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            title="Профиль"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            👤
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;