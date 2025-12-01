import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthForm } from "@/components/AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { notifications } from "@mantine/notifications";
import { Center, Stack, Text } from "@mantine/core";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from '@/shared/validation/patterns';

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
            if (!EMAIL_REGEX.test(values.email)) {
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

            if (!PASSWORD_REGEX.test(values.password)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Пароль слишком короткий (минимум 6 символов)",
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
            if (!NAME_REGEX.test(values.name)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Имя может содержать только буквы, пробелы и дефисы",
                });
                return;
            }

            if (!NAME_REGEX.test(values.surname)) {
                notifications.show({
                    color: "red",
                    title: "Ошибка",
                    message: "Фамилия может содержать только буквы, пробелы и дефисы",
                });
                return;
            }

            // Валидация отчества (если указано)
            if (values.patronymic && values.patronymic.trim() && !NAME_REGEX.test(values.patronymic)) {
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
                    isRegister
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