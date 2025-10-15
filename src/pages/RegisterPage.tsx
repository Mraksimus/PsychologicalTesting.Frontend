// src/pages/RegisterPage.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { register } from "@/api/auth";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            await register(values.email, values.password);
            notifications.show({ title: "Успешная регистрация", message: "Теперь войдите в систему" });
            navigate("/login"); // редирект на страницу входа
        } catch (err: any) {
            notifications.show({
                color: "red",
                title: "Ошибка регистрации",
                message: err.response?.data?.message || "Ошибка",
            });
        }
    };

    return (
        <Center style={{ minHeight: "100vh" }}>
            <Stack align="center">
                <AuthForm title="Регистрация" submitLabel="Зарегистрироваться" onSubmit={handleSubmit} />
                <Text>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </Text>
            </Stack>
        </Center>
    );
};
export default RegisterPage
