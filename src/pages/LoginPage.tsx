import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";

// Используем именованный экспорт
export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useAuth();
    const redirectTo = (location.state as { from?: string } | undefined)?.from ?? "/home";

    React.useEffect(() => {
        if (user) {
            navigate(redirectTo, { replace: true });
        }
    }, [user, navigate, redirectTo]);

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            await login(values.email, values.password);
            notifications.show({
                title: "Успешный вход",
                message: "Добро пожаловать!" ,
                color: "green"
            });
        } catch (err: any) {
            notifications.show({
                color: "red",
                title: "Ошибка входа",
                message: err.message || "Произошла ошибка при входе",
            });
        }
    };

    return (
        <Center style={{ minHeight: "100vh" }}>
            <Stack align="center">
                <AuthForm
                    title="Вход"
                    submitLabel="Войти"
                    onSubmit={handleSubmit}
                />
                <Text>
                    Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </Text>
            </Stack>
        </Center>
    );
};

// Экспорт по умолчанию для обратной совместимости
export default LoginPage;