import React from "react";
import { Button, TextInput, PasswordInput, Paper, Title, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";

interface AuthFormProps {
    onSubmit: (values: { email: string; password: string }) => void;
    title: string;
    submitLabel: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, title, submitLabel }) => {
    const form = useForm({
        initialValues: { email: "", password: "" },
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
            password: (value) => (value.length >= 6 ? null : "Минимум 6 символов"),
        },
    });

    return (
        <Paper withBorder shadow="md" p={30} radius="md" w={400}>
            <Title order={2} ta="center" mb="md">
                {title}
            </Title>

            <form onSubmit={form.onSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="you@example.com"
                        {...form.getInputProps("email")}
                    />
                    <PasswordInput
                        label="Пароль"
                        placeholder="Ваш пароль"
                        {...form.getInputProps("password")}
                    />
                    <Button type="submit" fullWidth mt="md">
                        {submitLabel}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};
