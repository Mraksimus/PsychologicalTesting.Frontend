import React from "react";
import { Button, TextInput, PasswordInput, Paper, Title, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

const EMAIL_REGEX = /^(?!\.)([a-z0-9._-]{1,250})(?<!\.)@([a-zA-Z0-9.-]{1,64}|[а-яА-Я0-9.-]{1,64}|xn--[a-zA-Z0-9-]{1,61})$/
const PASSWORD_REGEX = /[a-zA-Z0-9~\-!@#$%^&*_()\[\]]{6,32}/
const NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/
const SURNAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/
const PATRONYMIC_REGEX = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/

// Базовый интерфейс для данных формы
interface AuthFormValues {
    name: string;
    surname: string;
    patronymic?: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface AuthFormProps {
    onSubmit: (values: AuthFormValues) => void;
    title: string;
    submitLabel: string;
    isRegister?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> =  ({
   onSubmit,
   title,
   submitLabel,
   isRegister = false
}) => {
    const form = useForm({
        initialValues: {
            name: "",
            surname: "",
            patronymic: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        validate: {
            ...(isRegister && {
                surname: (value) => {
                    if (!value) return "Не введена фамилия";
                    if (!SURNAME_REGEX.test(value.trim())) return "Фамилия содержит недопустимые символы";
                    return null;
                },
                name: (value) => {
                    if (!value) return "Не введено имя";
                    if (!NAME_REGEX.test(value.trim())) return "Имя содержит недопустимые символы";
                    return null;
                },
                patronymic: (value) => {
                    if (!value) return;
                    const trimmedValue = value.trim();
                    if (trimmedValue && !PATRONYMIC_REGEX.test(trimmedValue)) return "Отчество содержит недопустимые символы";
                    return null;
                },
                email: (value) => {
                    if (!value) return "Не введен email";
                    if (!EMAIL_REGEX.test(value.trim())) return "Некорректный формат email";
                    return null;
                },
                password: (value) => {
                    if (!value) return "Не введен пароль";
                    if (!PASSWORD_REGEX.test(value)) return "Пароль слишком короткий (минимум 6 символов)";
                    return null;
                },
                confirmPassword: (value, values) => {
                    if (!value) return "Повторите пароль";
                    if (value !== values.password) return "Введенные пароли не совпадают";
                    return null;
                },
            })
        },
    });

    return (
        <Paper withBorder shadow="md" p={30} radius="md" w={400}>
            <Title order={2} ta="center" mb="md">
                {title}
            </Title>

            <form onSubmit={form.onSubmit(onSubmit)} noValidate>
                <Stack>
                    {isRegister && (
                        <>
                            <TextInput
                                label="Фамилия"
                                placeholder="Введите фамилию"
                                required
                                {...form.getInputProps("surname")}
                            />
                            <TextInput
                                label="Имя"
                                placeholder="Введите имя"
                                required
                                {...form.getInputProps("name")}
                            />
                            <TextInput
                                label="Отчество"
                                placeholder="Введите отчество"
                                {...form.getInputProps("patronymic")}
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