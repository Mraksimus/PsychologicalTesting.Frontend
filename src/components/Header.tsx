// src/components/Header.tsx (с защитой от ошибок AuthContext)
import React, { useState } from 'react';
import AuthModal from './AuthModal';

// Создаем fallback хук на случай ошибки AuthContext
const useAuthFallback = () => {
  return {
    user: null,
    isAuthenticated: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    loading: false,
    error: null
  };
};

const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Пробуем использовать AuthContext, но если ошибка - используем fallback
  let auth;
  try {
    const { useAuth } = require('../contexts/AuthContext');
    auth = useAuth();
  } catch (error) {
    auth = useAuthFallback();
    console.warn('AuthContext not available, using fallback');
  }

  const { user, logout, isAuthenticated } = auth;

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <header style={{ 
        background: '#fff', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1rem 0'
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
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#007bff'
              }}>
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
                <li><a href="/home" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Главная</a></li>
                <li><a href="#tests" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>Тесты</a></li>
                <li><a href="#about" style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>О проекте</a></li>
              </ul>
            </nav>

            <div>
              {isAuthenticated && user && (
                <span style={{ marginRight: '1rem', color: '#495057', fontSize: '0.9rem' }}>
                  {user.email}
                </span>
              )}
              <button 
                onClick={handleAuthClick}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {isAuthenticated ? 'Выйти' : 'Войти'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={handleCloseAuthModal} 
      />
    </>
  );
};

export default Header;