import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Burger, Drawer, Stack, Divider } from '@mantine/core';
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
    const [drawerOpen, setDrawerOpen] = useState(false);

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
                    // не удалось — оставляем дефолт
                }
            }
        };
        loadProfile();
    }, [user]);

    const handleProfileClick = () => {
        navigate('/profile');
        setDrawerOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const isActivePage = (path: string) => location.pathname === path;

    const scrollToAbout = () => {
        const element = document.getElementById('about');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleAboutClick = () => {
        setDrawerOpen(false);
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
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    {/* Логотип */}
                    <div style={{ flex: '0 0 auto' }}>
                        <button
                            type="button"
                            className="header-logo"
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

                    {/* Десктопная навигация */}
                    <nav className="header-desktop-nav" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <ul style={{
                            display: 'flex',
                            listStyle: 'none',
                            gap: '1rem',
                            margin: 0,
                            padding: 0
                        }}>
                            <li>
                                <NavButton label="Главная" active={isActivePage('/home')} onClick={() => handleNavigation('/home')} />
                            </li>
                            <li>
                                <NavButton label="Тесты" active={isActivePage('/tests')} onClick={() => handleNavigation('/tests')} />
                            </li>
                            <li>
                                <NavButton label="Опросы" active={isActivePage('/surveys')} onClick={() => handleNavigation('/surveys')} />
                            </li>
                            <li>
                                <NavButton label="О проекте" onClick={handleAboutClick} />
                            </li>
                        </ul>
                    </nav>

                    {/* Десктопные экшены (профиль / войти) */}
                    <div className="header-desktop-actions" style={{
                        flex: '0 0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        justifyContent: 'flex-end'
                    }}>
                        {user ? (
                            <>
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
                                    title="Перейти в профиль"
                                >
                                    {fullName}
                                </button>
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
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                        flexShrink: 0
                                    }}
                                    title="Профиль"
                                >
                                    👤
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => handleNavigation('/login')}
                                    style={{
                                        background: 'transparent',
                                        color: '#333',
                                        border: '1px solid rgba(102, 126, 234, 0.4)',
                                        padding: '0.5rem 1.1rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Войти
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleNavigation('/register')}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.55rem 1.2rem',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.35)',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Зарегистрироваться
                                </button>
                            </>
                        )}
                    </div>

                    {/* Бургер для мобильных */}
                    <Burger
                        opened={drawerOpen}
                        onClick={() => setDrawerOpen(o => !o)}
                        aria-label="Открыть меню"
                        className="header-burger"
                        size="sm"
                    />
                </div>
            </div>

            <Drawer
                opened={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Меню"
                position="right"
                size="80%"
                zIndex={2000}
            >
                <Stack gap="xs">
                    {user && (
                        <>
                            <button
                                type="button"
                                onClick={handleProfileClick}
                                style={{
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    border: 'none',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    color: '#333',
                                    textAlign: 'left',
                                }}
                            >
                                👤 {fullName}
                            </button>
                            <Divider my="xs" />
                        </>
                    )}

                    <NavButton label="Главная" active={isActivePage('/home')} onClick={() => handleNavigation('/home')} />
                    <NavButton label="Тесты" active={isActivePage('/tests')} onClick={() => handleNavigation('/tests')} />
                    <NavButton label="Опросы" active={isActivePage('/surveys')} onClick={() => handleNavigation('/surveys')} />
                    <NavButton label="О проекте" onClick={handleAboutClick} />

                    {!user && (
                        <>
                            <Divider my="xs" />
                            <button
                                type="button"
                                onClick={() => handleNavigation('/login')}
                                style={{
                                    background: 'transparent',
                                    color: '#333',
                                    border: '1px solid rgba(102, 126, 234, 0.4)',
                                    padding: '0.6rem 1rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 500,
                                }}
                            >
                                Войти
                            </button>
                            <button
                                type="button"
                                onClick={() => handleNavigation('/register')}
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.7rem 1rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                Зарегистрироваться
                            </button>
                        </>
                    )}
                </Stack>
            </Drawer>
        </header>
    );
};

export default Header;
