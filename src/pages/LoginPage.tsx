import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";
import { login } from "../api/auth";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const data = await login(values.email, values.password);
            localStorage.setItem("token", data.token);
            notifications.show({ title: "Успешный вход", message: "Добро пожаловать!" });
            navigate("/home");
        } catch (err: any) {
            notifications.show({
                color: "red",
                title: "Ошибка входа",
                message: err.response?.data?.message || "Ошибка",
            });
        }
    };

    return (
        <Center style={{ minHeight: "100vh" }}>
            <Stack align="center">
                <AuthForm title="Вход" submitLabel="Войти" onSubmit={handleSubmit} />
                <Text>
                    Ещё нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </Text>
            </Stack>
        </Center>
    );
};

export default LoginPage;