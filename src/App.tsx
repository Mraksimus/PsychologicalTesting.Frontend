import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import TestCard from './components/TestCard';
import Popup from './components/Popup';
import AIAssistant from './components/AIAssistant';
import { LoginPage } from './pages/LoginPage';
import { Test, PopupState } from './types';

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
  },
  {
    id: 4,
    title: "Тест на коммуникативные навыки",
    description: "Оцените ваши навыки общения и взаимодействия с другими людьми",
    questionsCount: 18,
    time: 12,
    category: "Коммуникации"
  }
];

// Компонент главной страницы
const MainPage: React.FC = () => {
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
    setPopup({
      isOpen: true,
      testId: testId
    });
  };

  const handleClosePopup = () => {
    setPopup({
      isOpen: false,
      testId: null
    });
  };

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          <section className="page-header">
            <h1 className="page-title">Психологические тесты</h1>
            <p className="page-subtitle">
              Пройдите психологические тесты и получите ответы с помощью ИИ
            </p>
          </section>

          <section className="tests-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Загрузка тестов...</p>
              </div>
            ) : (
              <div className="tests-grid">
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

          {/* Блок AI-ассистента */}
          <section className="ai-section">
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
    </div>
  );
};

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Главный компонент приложения
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;