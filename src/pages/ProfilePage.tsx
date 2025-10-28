import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Loader,
    Alert,
    TextInput,
    ActionIcon,
    Card,
    Badge,
    Divider,
    Grid,
    Box,
    Avatar
} from '@mantine/core';
import {
    IconUser,
    IconLogout,
    IconEdit,
    IconCheck,
    IconX,
    IconHistory,
    IconCalendar,
    IconMail,
    IconId,
    IconChartBar,
    IconListCheck,
    IconMoodSmile
} from '@tabler/icons-react';


// Типы
interface UserProfile {
    id: number;
    email: string;
    fullName: string;
    created_at: string;
    last_login: string;
    testsCompleted: number;
}

interface ActionHistory {
    id: number;
    action: string;
    timestamp: string;
    details: string;
    testName?: string;
}

// Mock данные
const mockProfile: UserProfile = {
    id: 1,
    email: 'user@example.com',
    fullName: 'Иванов Иван Иванович',
    created_at: '2024-01-15T10:00:00Z',
    last_login: new Date().toISOString(),
    testsCompleted: 8
};

const mockActionHistory: ActionHistory[] = [
    {
        id: 1,
        action: 'Тест пройден',
        timestamp: '2024-01-20T14:30:00Z',
        details: 'Успешно завершен тест на уровень стресса',
        testName: 'Тест на уровень стресса'
    },
    {
        id: 2,
        action: 'Тест начат',
        timestamp: '2024-01-18T16:45:00Z',
        details: 'Начат опросник депрессии Бека',
        testName: 'Опросник депрессии Бека'
    },
    {
        id: 3,
        action: 'Тест пройден',
        timestamp: '2024-01-15T11:20:00Z',
        details: 'Завершен тест на тревожность',
        testName: 'Тест на тревожность'
    },
    {
        id: 4,
        action: 'Профиль обновлен',
        timestamp: '2024-01-10T09:15:00Z',
        details: 'Обновлена личная информация'
    }
];

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            setLoading(true);

            // Имитация загрузки данных
            await new Promise(resolve => setTimeout(resolve, 1000));

            setProfile(mockProfile);
            setActionHistory(mockActionHistory);
            setNewName(mockProfile.fullName);

        } catch (error) {
            console.error('Error loading profile:', error);
            setMessage('Ошибка загрузки профиля');

            // Fallback данные
            setProfile(mockProfile);
            setActionHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateName = async () => {
        if (!newName || newName === profile?.fullName) {
            setEditingName(false);
            return;
        }

        try {
            // Mock обновление имени
            await new Promise(resolve => setTimeout(resolve, 500));

            setMessage('ФИО успешно обновлено');
            setProfile(prev => prev ? { ...prev, fullName: newName } : null);
            setEditingName(false);

            // Добавляем действие в историю
            const newAction: ActionHistory = {
                id: Date.now(),
                action: 'Профиль обновлен',
                timestamp: new Date().toISOString(),
                details: 'Изменено ФИО пользователя'
            };
            setActionHistory(prev => [newAction, ...prev]);

        } catch (error) {
            console.error('Error updating name:', error);
            setMessage('Ошибка обновления ФИО');
        }
    };

    const handleLogout = () => {
        // Здесь должна быть логика выхода
        navigate('/');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    if (loading) {
        return (
            <Container size="lg" py="xl">
                <Group position="center">
                    <Loader size="lg" />
                    <Text>Загрузка профиля...</Text>
                </Group>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            {/* Заголовок и кнопка выхода */}
            <Group position="apart" mb="xl">
                <Group>
                    <IconUser size={32} />
                    <Title order={1}>Профиль пользователя</Title>
                </Group>
                <Button
                    variant="outline"
                    color="red"
                    leftIcon={<IconLogout size={16} />}
                    onClick={handleLogout}
                >
                    Выйти
                </Button>
            </Group>

            {/* Сообщения */}
            {message && (
                <Alert
                    color={message.includes('Ошибка') ? 'red' : 'green'}
                    mb="xl"
                    withCloseButton
                    onClose={() => setMessage('')}
                >
                    {message}
                </Alert>
            )}

            <Grid gutter="xl">
                {/* Статистика */}
                <Grid.Col md={4}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                        <Group position="center" mb="md">
                            <Avatar color="blue" size="lg" radius="xl">
                                <IconMoodSmile size={24} />
                            </Avatar>
                        </Group>

                        <Stack spacing="md">
                            <Box style={{ textAlign: 'center' }}>
                                <Text size="xl" weight={700} color="blue">
                                    {profile?.testsCompleted || 0}
                                </Text>
                                <Text size="sm" color="dimmed">Пройдено тестов</Text>
                            </Box>

                            <Divider />

                            <Box style={{ textAlign: 'center' }}>
                                <Text size="xl" weight={700} color="green">
                                    {actionHistory.filter(action => action.action === 'Тест пройден').length}
                                </Text>
                                <Text size="sm" color="dimmed">Успешных тестов</Text>
                            </Box>

                            <Divider />

                            <Box style={{ textAlign: 'center' }}>
                                <Text size="xl" weight={700} color="orange">
                                    {actionHistory.length}
                                </Text>
                                <Text size="sm" color="dimmed">Всего действий</Text>
                            </Box>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* Информация о пользователе */}
                <Grid.Col md={8}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                        <Title order={2} mb="md">Личная информация</Title>

                        <Stack spacing="md">
                            {/* ФИО */}
                            <Group position="apart">
                                <Group>
                                    <IconUser size={20} color="gray" />
                                    <Text size="sm" color="dimmed">ФИО:</Text>
                                </Group>
                                {editingName ? (
                                    <Group spacing="xs">
                                        <TextInput
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Введите ФИО"
                                            size="sm"
                                            style={{ width: 250 }}
                                        />
                                        <ActionIcon
                                            color="green"
                                            onClick={handleUpdateName}
                                            variant="filled"
                                        >
                                            <IconCheck size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            onClick={() => {
                                                setEditingName(false);
                                                setNewName(profile?.fullName || '');
                                            }}
                                            variant="filled"
                                        >
                                            <IconX size={16} />
                                        </ActionIcon>
                                    </Group>
                                ) : (
                                    <Group spacing="xs">
                                        <Text weight={500}>{profile?.fullName}</Text>
                                        <ActionIcon
                                            onClick={() => {
                                                setEditingName(true);
                                                setNewName(profile?.fullName || '');
                                            }}
                                            variant="subtle"
                                        >
                                            <IconEdit size={16} />
                                        </ActionIcon>
                                    </Group>
                                )}
                            </Group>

                            <Divider />

                            <Group position="apart">
                                <Group>
                                    <IconMail size={20} color="gray" />
                                    <Text size="sm" color="dimmed">Email:</Text>
                                </Group>
                                <Text weight={500}>{profile?.email}</Text>
                            </Group>

                            <Group position="apart">
                                <Group>
                                    <IconId size={20} color="gray" />
                                    <Text size="sm" color="dimmed">ID пользователя:</Text>
                                </Group>
                                <Text weight={500}>{profile?.id || 'N/A'}</Text>
                            </Group>

                            <Group position="apart">
                                <Group>
                                    <IconCalendar size={20} color="gray" />
                                    <Text size="sm" color="dimmed">Дата регистрации:</Text>
                                </Group>
                                <Text weight={500}>
                                    {profile ? formatDate(profile.created_at) : 'N/A'}
                                </Text>
                            </Group>

                            <Group position="apart">
                                <Group>
                                    <IconHistory size={20} color="gray" />
                                    <Text size="sm" color="dimmed">Последний вход:</Text>
                                </Group>
                                <Text weight={500}>
                                    {profile?.last_login ? formatDate(profile.last_login) : 'N/A'}
                                </Text>
                            </Group>
                        </Stack>
                    </Card>
                </Grid.Col>

                {/* История действий */}
                <Grid.Col span={12}>
                    <Card shadow="sm" p="lg" radius="md" withBorder>
                        <Group mb="md">
                            <IconListCheck size={24} />
                            <Title order={2}>История действий</Title>
                        </Group>

                        {actionHistory.length === 0 ? (
                            <Box py="xl" style={{ textAlign: 'center' }}>
                                <Text color="dimmed" mb="sm">История действий пуста</Text>
                                <Text size="sm" color="dimmed">
                                    Здесь будут отображаться ваши действия с тестами
                                </Text>
                            </Box>
                        ) : (
                            <Stack spacing="md">
                                {actionHistory.map((action) => (
                                    <Paper key={action.id} p="md" withBorder>
                                        <Group position="apart" mb="xs">
                                            <Badge
                                                color={
                                                    action.action === 'Тест пройден' ? 'green' :
                                                        action.action === 'Тест начат' ? 'blue' : 'gray'
                                                }
                                                variant="light"
                                            >
                                                {action.action}
                                            </Badge>
                                            <Text size="sm" color="dimmed">
                                                {formatDate(action.timestamp)}
                                            </Text>
                                        </Group>

                                        <Text size="sm" mb="xs">
                                            {action.details}
                                        </Text>

                                        {action.testName && (
                                            <Text size="xs" color="dimmed">
                                                Тест: {action.testName}
                                            </Text>
                                        )}
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Кнопка назад */}
            <Group position="center" mt="xl">
                <Button
                    variant="light"
                    onClick={() => navigate('/')}
                >
                    Назад на главную
                </Button>
            </Group>
        </Container>
    );
};

export default ProfilePage;