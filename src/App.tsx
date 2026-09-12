import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Страницы
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TestingPage from "@/pages/TestingPage";
import ResultsPage from "@/pages/ResultsPage";
import SurveyPage from "@/pages/SurveyPage";
import SurveyingPage from "@/pages/SurveyingPage";
import SurveyDonePage from "@/pages/SurveyDonePage";

// Компоненты
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

// Тема
import { theme } from "./theme";

// Стили
import "./styles/background.css";
import { ProtectedRoute } from "./components/ProtectedRoute";
import TestPage from "@/pages/TestPage";

// Компонент для условного отображения Header
const Layout: React.FC = () => {
    const location = useLocation();
    // Показываем Header на всех страницах, кроме login и register
    const showHeader = !location.pathname.startsWith('/login') && !location.pathname.startsWith('/register');

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="/tests" element={<TestPage />} />
                <Route path="/test/:testId" element={
                    <ProtectedRoute>
                        <TestingPage />
                    </ProtectedRoute>
                } />
                <Route path="/test/:testId/results" element={
                    <ProtectedRoute>
                        <ResultsPage />
                    </ProtectedRoute>
                } />
                <Route path="/result" element={
                    <ProtectedRoute>
                        <ResultsPage />
                    </ProtectedRoute>
                } />
                <Route path="/surveys" element={<SurveyPage />} />
                <Route path="/survey/:surveyId" element={
                    <ProtectedRoute>
                        <SurveyingPage />
                    </ProtectedRoute>
                } />
                <Route path="/survey/:surveyId/done" element={
                    <ProtectedRoute>
                        <SurveyDonePage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" zIndex={2000} />
            <AuthProvider>
                <BrowserRouter>
                    <div className="mindcheck-background">
                        <div className="floating-icons">
                            <div className="icon">🧠</div>
                            <div className="icon">❤️</div>
                            <div className="icon">😊</div>
                            <div className="icon">📊</div>
                            <div className="icon">🌟</div>
                            <div className="icon">💭</div>
                            <div className="icon">🌈</div>
                            <div className="icon">🔮</div>
                            <div className="icon">🎯</div>
                            <div className="icon">💫</div>
                            <div className="icon">🌙</div>
                            <div className="icon">⭐</div>
                        </div>
                    </div>

                    <Layout />
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
};

export default App;
