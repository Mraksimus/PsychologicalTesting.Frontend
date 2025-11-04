import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";

// Используем именованный экспорт
export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, user } = useAuth();

    React.useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const handleSubmit = async (values: {
        name: string;
        surname: string;
        patronymic?: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) => {
        try {

            // Проверка обязательных полей
            if (!values.name.trim()) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Введите имя",
                });
                return;
            }

            if (!values.surname.trim()) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Введите фамилию",
                });
                return;
            }

            if (!values.email.trim()) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Введите email",
                });
                return;
            }

            // Валидация email
            const emailRegex = /^(?!\\.)([a-z0-9._-]{1,250})(?<!\\.)@([a-zA-Z0-9.-]{1,64}|[а-яА-Я0-9.-]{1,64}|xn--[a-zA-Z0-9-]{1,61})$/;
            if (!emailRegex.test(values.email)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Введите корректный email адрес",
                });
                return;
            }

            if (!values.password) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Введите пароль",
                });
                return;
            }

            // Проверка подтверждения пароля
            if (!values.confirmPassword) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Повторите пароль",
                });
                return;
            }

            if (values.password !== values.confirmPassword) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Пароли не совпадают",
                });
                return;
            }

            // Валидация имени и фамилии (только буквы)
            const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;
            if (!nameRegex.test(values.name)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Имя может содержать только буквы, пробелы и дефисы",
                });
                return;
            }

            if (!nameRegex.test(values.surname)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Фамилия может содержать только буквы, пробелы и дефисы",
                });
                return;
            }

            // Валидация отчества (если указано)
            if (values.patronymic && values.patronymic.trim() && !nameRegex.test(values.patronymic)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Отчество может содержать только буквы, пробелы и дефисы",
                });
                return;
            }

            // Вызов функции регистрации
            await register(
                values.name.trim(),
                values.surname.trim(),
                values.patronymic?.trim(),
                values.email.trim(),
                values.password
            );

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

// Экспорт по умолчанию для обратной совместимости
export default RegisterPage;