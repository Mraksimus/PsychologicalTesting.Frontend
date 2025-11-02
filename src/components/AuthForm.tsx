import React from "react";
import { Button, TextInput, PasswordInput, Paper, Title, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

// Базовый интерфейс для данных формы
interface AuthFormValues {
    email: string;
    password: string;
    lastName?: string;
    firstName?: string;
    middleName?: string;
    confirmPassword?: string;
}

// Для регистрации делаем поля обязательными
interface RegisterFormValues extends AuthFormValues {
    lastName: string;
    firstName: string;
    middleName: string;
    confirmPassword: string;
}

interface AuthFormProps {
    onSubmit: (values: AuthFormValues) => void;
    title: string;
    submitLabel: string;
    isRegister?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
                                                      onSubmit,
                                                      title,
                                                      submitLabel,
                                                      isRegister = false
                                                  }) => {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            lastName: "",
            firstName: "",
            middleName: "",
            confirmPassword: ""
        },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
            password: (value) => {
                if (isRegister) {
                    return value.length >= 6 ? null : "Минимум 6 символов";
                }
                return null; // Убираем валидацию для авторизации
            },
            ...(isRegister && {
                lastName: (value) => value.trim() ? null : "Введите фамилию",
                firstName: (value) => value.trim() ? null : "Введите имя",
                confirmPassword: (value, values) =>
                    value === values.password ? null : "Пароли не совпадают"
            })
        },
    });

    return (
        <Paper withBorder shadow="md" p={30} radius="md" w={400}>
            <Title order={2} ta="center" mb="md">
                {title}
            </Title>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack>
                    {isRegister && (
                        <>
                            <TextInput
                                label="Фамилия"
                                placeholder="Введите фамилию"
                                required
                                {...form.getInputProps("lastName")}
                            />
                            <TextInput
                                label="Имя"
                                placeholder="Введите имя"
                                required
                                {...form.getInputProps("firstName")}
                            />
                            <TextInput
                                label="Отчество"
                                placeholder="Введите отчество"
                                {...form.getInputProps("middleName")}
                            />
                        </>
                    )}

                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        required
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Пароль"
                        placeholder="Ваш пароль"
                        required
                        {...form.getInputProps("password")}
                    />

                    {isRegister && (
                        <PasswordInput
                            label="Подтвердите пароль"
                            placeholder="Повторите пароль"
                            required
                            {...form.getInputProps("confirmPassword")}
                        />
                    )}

                    <Button type="submit" fullWidth mt="md">
                        {submitLabel}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};