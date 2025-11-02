import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, user } = useAuth();

    React.useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const handleSubmit = async (values: {
        email: string;
        password: string;
        lastName?: string;
        firstName?: string;
        middleName?: string;
        confirmPassword?: string;
    }) => {
        try {
            // Проверяем, что все обязательные поля присутствуют
            if (!values.lastName || !values.firstName) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Заполните все обязательные поля",
                });
                return;
            }

            // Передаем только email и password в функцию register
            await register(values.email, values.password);
            notifications.show({
                title: "Успешная регистрация",
                message: "Добро пожаловать!",
                color: "green"
            });
        } catch (err: any) {
            notifications.show({
                color: "red",
                title: "Ошибка регистрации",
                message: err.message || "Произошла ошибка при регистрации",
            });
        }
    };

    return (
        <Center style={{ minHeight: "100vh" }}>
            <Stack align="center">
                <AuthForm
                    title="Регистрация"
                    submitLabel="Зарегистрироваться"
                    onSubmit={handleSubmit}
                    isRegister={true}
                />
                <Text>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </Text>
            </Stack>
        </Center>
    );
};

export default RegisterPage;