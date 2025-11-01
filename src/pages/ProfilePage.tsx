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
    Avatar,
    Center
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
    IconListCheck,
    IconMoodSmile, IconShield
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';

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
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [actionHistory, setActionHistory] = useState<ActionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        loadProfileData();
    }, []);

    // Автоматическое перенаправление при выходе
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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
        logout();
        notifications.show({
            title: "Выход выполнен",
            message: "Вы успешно вышли из аккаунта",
            color: "blue"
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    if (loading) {
        return (
            <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Глобальный фон */}
                <div className="mindcheck-background">
                    <div className="floating-icons">
                        <div className="icon">🧠</div>
                        <div className="icon">❤️</div>
                        <div className="icon">😊</div>
                        <div className="icon">📊</div>
                        <div className="icon">🌟</div>
                        <div className="icon">💭</div>
                        <div className="icon">🌈</div>
                        <div className="icon">🔮</div>
                        <div className="icon">🎯</div>
                        <div className="icon">💫</div>
                        <div className="icon">🌙</div>
                        <div className="icon">⭐</div>
                    </div>
                </div>
                <Container size="lg" py="xl">
                    <Center>
                        <Group>
                            <Loader size="lg" />
                            <Text c="white">Загрузка профиля...</Text>
                        </Group>
                    </Center>
                </Container>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Глобальный фон */}
            <div className="mindcheck-background">
                <div className="floating-icons">
                    <div className="icon">🧠</div>
                    <div className="icon">❤️</div>
                    <div className="icon">😊</div>
                    <div className="icon">📊</div>
                    <div className="icon">🌟</div>
                    <div className="icon">💭</div>
                    <div className="icon">🌈</div>
                    <div className="icon">🔮</div>
                    <div className="icon">🎯</div>
                    <div className="icon">💫</div>
                    <div className="icon">🌙</div>
                    <div className="icon">⭐</div>
                </div>
            </div>

            <Container size="lg" py="xl" style={{ position: 'relative' }}>
                {/* Заголовок */}
                <Group justify="space-between" mb="xl">
                    <Group>
                        <IconUser size={32} style={{ color: 'white' }} />
                        <Title order={1} c="white">Профиль пользователя</Title>
                    </Group>
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

                <Grid gutter="xl" align="stretch">
                    {/* Статистика */}
                    <Grid.Col span={{ md: 4 }}>
                        <Card
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <Group justify="center" mb="md">
                                <Avatar color="blue" size="lg" radius="xl">
                                    <IconMoodSmile size={24} />
                                </Avatar>
                            </Group>

                            <Stack gap="md" style={{ flex: 1 }} justify="space-around">
                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="xl" fw={700} c="blue">
                                        {profile?.testsCompleted || 0}
                                    </Text>
                                    <Text size="sm" c="dimmed">Пройдено тестов</Text>
                                </Box>

                                <Divider />

                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="xl" fw={700} c="green">
                                        {actionHistory.filter(action => action.action === 'Тест пройден').length}
                                    </Text>
                                    <Text size="sm" c="dimmed">Успешных тестов</Text>
                                </Box>

                                <Divider />

                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="xl" fw={700} c="orange">
                                        {actionHistory.length}
                                    </Text>
                                    <Text size="sm" c="dimmed">Всего действий</Text>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* Информация о пользователе */}
                    <Grid.Col span={{ md: 8 }}>
                        <Card
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                height: '100%'
                            }}
                        >
                            <Title order={2} mb="md">Личная информация</Title>

                            <Stack gap="md">
                                {/* ФИО */}
                                <Group justify="space-between">
                                    <Group>
                                        <IconUser size={20} color="gray" />
                                        <Text size="sm" c="dimmed">ФИО:</Text>
                                    </Group>
                                    {editingName ? (
                                        <Group gap="xs">
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
                                            // В разделе личной информации добавьте:
                                            <Group justify="space-between">
                                                <IconShield size={20} color="gray" />
                                                    <Text size="sm" c="dimmed">Роль:</Text>
                                                </Group>
                                                <Badge
                                                    color={user?.isAdmin ? "red" : "blue"}
                                                    variant="light"
                                                >
                                                    {user?.isAdmin ? "Администратор" : "Пользователь"}
                                                </Badge>
                                        </Group>
                                    ) : (
                                        <Group gap="xs">
                                            <Text fw={500}>{profile?.fullName}</Text>
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

                                <Group justify="space-between">
                                    <Group>
                                        <IconMail size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Email:</Text>
                                    </Group>
                                    <Text fw={500}>{profile?.email}</Text>
                                </Group>

                                <Group justify="space-between">
                                    <Group>
                                        <IconId size={20} color="gray" />
                                        <Text size="sm" c="dimmed">ID пользователя:</Text>
                                    </Group>
                                    <Text fw={500}>{profile?.id || 'N/A'}</Text>
                                </Group>

                                <Group justify="space-between">
                                    <Group>
                                        <IconCalendar size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Дата регистрации:</Text>
                                    </Group>
                                    <Text fw={500}>
                                        {profile ? formatDate(profile.created_at) : 'N/A'}
                                    </Text>
                                </Group>

                                <Group justify="space-between">
                                    <Group>
                                        <IconHistory size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Последний вход:</Text>
                                    </Group>
                                    <Text fw={500}>
                                        {profile?.last_login ? formatDate(profile.last_login) : 'N/A'}
                                    </Text>
                                </Group>

                                {/* Кнопка выхода в разделе личной информации */}
                                <Divider />

                                <Group justify="center" mt="md">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                        onClick={handleLogout}
                                        fullWidth
                                        style={{ maxWidth: 200 }}
                                    >
                                        Выйти из аккаунта
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>

                    {/* История действий */}
                    <Grid.Col span={12}>
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                            <Group mb="md">
                                <IconListCheck size={24} />
                                <Title order={2}>История действий</Title>
                            </Group>

                            {actionHistory.length === 0 ? (
                                <Box py="xl" style={{ textAlign: 'center' }}>
                                    <Text c="dimmed" mb="sm">История действий пуста</Text>
                                    <Text size="sm" c="dimmed">
                                        Здесь будут отображаться ваши действия с тестами
                                    </Text>
                                </Box>
                            ) : (
                                <Stack gap="md">
                                    {actionHistory.map((action) => (
                                        <Paper key={action.id} p="md" withBorder>
                                            <Group justify="space-between" mb="xs">
                                                <Badge
                                                    color={
                                                        action.action === 'Тест пройден' ? 'green' :
                                                            action.action === 'Тест начат' ? 'blue' : 'gray'
                                                    }
                                                    variant="light"
                                                >
                                                    {action.action}
                                                </Badge>
                                                <Text size="sm" c="dimmed">
                                                    {formatDate(action.timestamp)}
                                                </Text>
                                            </Group>

                                            <Text size="sm" mb="xs">
                                                {action.details}
                                            </Text>

                                            {action.testName && (
                                                <Text size="xs" c="dimmed">
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
            </Container>
        </div>
    );
};

export default ProfilePage;