import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Страницы
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Компоненты
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

// Тема
import { theme } from "./theme";

// Стили фона
import "./styles/Background.css";

// Компонент для условного отображения Header
function AppContent() {
    const location = useLocation();
    // Хэдер показываем ТОЛЬКО на главной странице
    const showHeader = location.pathname === '/home' || location.pathname === '/';

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <AuthProvider>
                <BrowserRouter>
                    {/* Глобальный фон для всех страниц */}
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
                    
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
}