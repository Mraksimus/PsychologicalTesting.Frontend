import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Страницы
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TestsPage from "@/pages/TestPage";

// Компоненты
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";

// Тема
import { theme } from "./theme";

// Стили
import "./styles/Background.css";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Компонент для условного отображения Header
const Layout: React.FC = () => {
    const location = useLocation();
    const showHeader = location.pathname === '/home' || location.pathname === '/profile';

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                } />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/home" replace />} />
                <Route path="/tests" element={<TestsPage />} />
            </Routes>
        </>
    );
};

const App: React.FC = () => {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
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