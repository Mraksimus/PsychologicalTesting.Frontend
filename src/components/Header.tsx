import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    // Mock данные пользователя (в реальном приложении это будет из контекста или store)
    const currentUser = {
        fullName: 'Иванов Иван Иванович'
    };

    // Функция для определения активной страницы
    const isActivePage = (path: string) => {
        return location.pathname === path;
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
                    {/* Логотип */}
                    <div style={{ flex: 1 }}>
                        <span
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#007bff',
                                cursor: 'pointer',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => handleNavigation('/home')}
                        >
                            MindCheck
                        </span>
                    </div>

                    {/* Навигация по центру */}
                    <nav style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '1rem',
                            margin: 0,
                            padding: 0
                        }}>
                            <li>
                                <button
                                    onClick={() => handleNavigation('/home')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        textDecoration: 'none',
                                        color: isActivePage('/home') ? '#007bff' : '#333',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        backgroundColor: isActivePage('/home') ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePage('/home')) {
                                            e.currentTarget.style.color = '#007bff';
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePage('/home')) {
                                            e.currentTarget.style.color = '#333';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    Главная
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigation('/tests')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        textDecoration: 'none',
                                        color: isActivePage('/tests') ? '#007bff' : '#333',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        backgroundColor: isActivePage('/tests') ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePage('/tests')) {
                                            e.currentTarget.style.color = '#007bff';
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePage('/tests')) {
                                            e.currentTarget.style.color = '#333';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    Тесты
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavigation('/about')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        textDecoration: 'none',
                                        color: isActivePage('/about') ? '#007bff' : '#333',
                                        fontWeight: '500',
                                        transition: 'all 0.3s',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        backgroundColor: isActivePage('/about') ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActivePage('/about')) {
                                            e.currentTarget.style.color = '#007bff';
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActivePage('/about')) {
                                            e.currentTarget.style.color = '#333';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    О проекте
                                </button>
                            </li>
                        </ul>
                    </nav>

                    {/* Профиль пользователя - справа */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'flex-end'
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
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap'
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
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                flexShrink: 0
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