// src/App.tsx
import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Контексты
import { AuthProvider } from "./contexts/AuthContext";

// Страницы
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

// Компоненты
import Header from "./components/Header";

// Тема
import { theme } from "./theme";

// Компонент для условного отображения Header
function AppContent() {
    const location = useLocation();
    const showHeader = location.pathname !== '/profile'; // Не показывать Header на странице профиля

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
                    <AppContent />
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
}