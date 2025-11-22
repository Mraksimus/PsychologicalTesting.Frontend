import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Пропсы для модального окна аутентификации
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Компонент модального окна для входа и регистрации
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  const { login, register, loading, error } = useAuth();

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Валидация
    if (!email || !password) {
      setFormError('Все поля обязательны для заполнения');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setFormError('Пароли не совпадают');
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
        onClose(); // Закрываем модальное окно после успешного входа
        resetForm();
      } else {
        await register(email, password);
        onClose(); // Закрываем модальное окно после успешной регистрации
        resetForm();
      }
    } catch (err) {
      // Ошибка уже обработана в контексте
      console.error('Ошибка аутентификации:', err);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFormError('');
  };

  // Переключение между входом и регистрацией
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormError('');
  };

  // Закрытие модального окна
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isLogin ? 'Вход в аккаунт' : 'Регистрация'}</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Поле email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              disabled={loading}
            />
          </div>

          {/* Поле пароля */}
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>

          {/* Подтверждение пароля (только для регистрации) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Повторите пароль"
                disabled={loading}
              />
            </div>
          )}

          {/* Ошибки */}
          {(formError || error) && (
            <div className="error-message">
              {formError || error}
            </div>
          )}

          {/* Кнопка отправки */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        {/* Переключение между входом и регистрацией */}
        <div className="auth-toggle">
          <p>
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
            <button type="button" onClick={toggleMode} className="toggle-button">
              {isLogin ? ' Зарегистрироваться' : ' Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;