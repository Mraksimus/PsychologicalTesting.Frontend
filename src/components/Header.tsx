import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Компонент шапки сайта с аутентификацией
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      // Перенаправляем на страницу логина
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Логотип сайта */}
          <div className="logo">
            <span className="logo-text">MindCheck</span>
          </div>
          
          {/* Навигационное меню */}
          <nav className="navigation">
            <ul className="nav-list">
              <li className="nav-item">
                <a href="#" className="nav-link">Главная</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">Тесты</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">О проекте</a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">Контакты</a>
              </li>
            </ul>
          </nav>

          {/* Блок аутентификации */}
          <div className="auth-section">
            {isAuthenticated && user && (
              <span className="user-email">{user.email}</span>
            )}
            <button 
              className="login-button"
              onClick={handleAuthClick}
            >
              {isAuthenticated ? 'Выйти' : 'Войти'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;