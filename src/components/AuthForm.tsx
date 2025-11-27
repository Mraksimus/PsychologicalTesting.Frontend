import React from "react";
import { Button, TextInput, PasswordInput, Paper, Title, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { EMAIL_REGEX, NAME_REGEX, PASSWORD_REGEX } from "@/shared/validation/patterns";

const SURNAME_REGEX = NAME_REGEX;
const PATRONYMIC_REGEX = NAME_REGEX;

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
    const baseValidation = {
        email: (value: string) => {
            if (!value) {
                return "Не введен email";
            }
            if (!EMAIL_REGEX.test(value.trim())) {
                return "Некорректный формат email";
            }
            return null;
        },
        password: (value: string) => {
            if (!value) {
                return "Не введен пароль";
            }
            if (!PASSWORD_REGEX.test(value)) {
                return "Пароль слишком короткий (минимум 6 символов)";
            }
            return null;
        },
    };

    const registerValidation = isRegister
        ? {
            surname: (value: string) => {
                if (!value) {
                    return "Не введена фамилия";
                }
                if (!SURNAME_REGEX.test(value.trim())) {
                    return "Фамилия содержит недопустимые символы";
                }
                return null;
            },
            name: (value: string) => {
                if (!value) {
                    return "Не введено имя";
                }
                if (!NAME_REGEX.test(value.trim())) {
                    return "Имя содержит недопустимые символы";
                }
                return null;
            },
            patronymic: (value?: string) => {
                if (!value) {
                    return null;
                }
                const trimmedValue = value.trim();
                if (trimmedValue && !PATRONYMIC_REGEX.test(trimmedValue)) {
                    return "Отчество содержит недопустимые символы";
                }
                return null;
            },
            confirmPassword: (value: string, values: AuthFormValues) => {
                if (!value) {
                    return "Повторите пароль";
                }
                if (value !== values.password) {
                    return "Введенные пароли не совпадают";
                }
                return null;
            },
        }
        : {};

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
            ...baseValidation,
            ...registerValidation,
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