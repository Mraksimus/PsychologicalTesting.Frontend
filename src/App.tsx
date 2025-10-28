// src/App.tsx
import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Контексты
import { AuthProvider } from "./contexts/AuthContext";

// Страницы
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage"; // Добавляем импорт профиля

// Компоненты
import Header from "./components/Header"; // Добавляем Header

// Тема
import { theme } from "./theme";

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Notifications position="top-right" />
            <AuthProvider>
                <BrowserRouter>
                    <Header /> {/* Добавляем Header чтобы он был на всех страницах */}
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/profile" element={<ProfilePage />} /> {/* Добавляем маршрут для профиля */}
                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
}