import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileApi } from '@/api/profile';
import { useAuth } from '@/contexts/AuthContext';

interface NavButtonProps {
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, active = false, onClick }) => {
    const baseStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        textDecoration: 'none',
        color: active ? '#007bff' : '#333',
        fontWeight: 500,
        transition: 'all 0.3s',
        cursor: 'pointer',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        backgroundColor: active ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
        whiteSpace: 'nowrap',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            style={baseStyle}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.color = '#007bff';
                    e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.05)';
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.color = '#333';
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
        >
            {label}
        </button>
    );
};

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [fullName, setFullName] = useState<string>('Пользователь');

    useEffect(() => {
        const loadProfile = async () => {
            if (user) {
                try {
                    const profile = await profileApi.get();
                    const parts = [profile.surname, profile.name];
                    if (profile.patronymic) {
                        parts.push(profile.patronymic);
                    }
                    setFullName(parts.join(' '));
                } catch {
                    // Если не удалось загрузить, оставляем дефолтное значение
                }
            }
        };
        loadProfile();
    }, [user]);

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const isActivePage = (path: string) => location.pathname === path;

    const scrollToAbout = () => {
        const element = document.getElementById('about');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleAboutClick = () => {
        if (location.pathname === '/home') {
            scrollToAbout();
        } else {
            navigate('/home');
            setTimeout(scrollToAbout, 100);
        }
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
                        <button
                            type="button"
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#007bff',
                                cursor: 'pointer',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                            }}
                            onClick={() => handleNavigation('/home')}
                        >
                            MindCheck
                        </button>
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
                                <NavButton
                                    label="Главная"
                                    active={isActivePage('/home')}
                                    onClick={() => handleNavigation('/home')}
                                />
                            </li>
                            <li>
                                <NavButton
                                    label="Тесты"
                                    active={isActivePage('/tests')}
                                    onClick={() => handleNavigation('/tests')}
                                />
                            </li>
                            <li>
                                <NavButton
                                    label="О проекте"
                                    onClick={handleAboutClick}
                                />
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
                        <button
                            type="button"
                            style={{
                                color: '#333',
                                fontWeight: '500',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                background: 'rgba(102, 126, 234, 0.1)',
                                transition: 'all 0.3s ease',
                                whiteSpace: 'nowrap',
                                border: 'none'
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
                            {fullName}
                        </button>

                        {/* Кнопка профиля */}
                        <button
                            type="button"
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
