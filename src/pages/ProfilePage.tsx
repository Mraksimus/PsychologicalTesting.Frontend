import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Button,
    Group,
    Stack,
    Skeleton,
    Alert,
    TextInput,
    ActionIcon,
    Card,
    Divider,
    Grid,
    Box,
    Avatar,
    Modal,
    Badge,
    Paper,
    Tabs,
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
    IconTrash,
    IconMoodSmile,
    IconArrowRight,
    IconEye,
} from '@tabler/icons-react';
import { useAuth } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { UserProfile, TestingSessionCard, SurveySessionCard } from '@/types';
import { profileApi } from '@/api/profile';
import { testingSessionsApi } from '@/api/testingSessions';
import { surveySessionsApi } from '@/api/surveySessions';
import { testingSessionStorage } from '@/utils/testingSessionStorage';
import { surveySessionStorage } from '@/utils/surveySessionStorage';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingName, setEditingName] = useState(false);
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sessions, setSessions] = useState<TestingSessionCard[]>([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState<string | null>(null);
    const [sessionsOffset, setSessionsOffset] = useState(0);
    const [sessionsTotal, setSessionsTotal] = useState(0);
    const [loadingMoreSessions, setLoadingMoreSessions] = useState(false);

    const [surveySessions, setSurveySessions] = useState<SurveySessionCard[]>([]);
    const [surveySessionsLoading, setSurveySessionsLoading] = useState(false);
    const [surveySessionsError, setSurveySessionsError] = useState<string | null>(null);
    const [surveySessionsOffset, setSurveySessionsOffset] = useState(0);
    const [surveySessionsTotal, setSurveySessionsTotal] = useState(0);
    const [loadingMoreSurveySessions, setLoadingMoreSurveySessions] = useState(false);

    const [activeSessionsTab, setActiveSessionsTab] = useState<string>('tests');
    const SESSIONS_PER_PAGE = 10;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadProfileData();
        loadSessions(true);
        loadSurveySessions(true);
    }, [user, navigate]);

    const loadProfileData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await profileApi.get();
            setProfile(data);
            setName(data.name);
            setSurname(data.surname);
            setPatronymic(data.patronymic || '');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить профиль';
            setError(errorMessage);
            notifications.show({
                title: 'Ошибка загрузки',
                message: errorMessage,
                color: 'red',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartEdit = () => {
        if (profile) {
            setName(profile.name);
            setSurname(profile.surname);
            setPatronymic(profile.patronymic || '');
            setEditingName(true);
        }
    };

    const handleCancelEdit = () => {
        if (profile) {
            setName(profile.name);
            setSurname(profile.surname);
            setPatronymic(profile.patronymic || '');
        }
        setEditingName(false);
    };

    const handleUpdateName = async () => {
        if (!name.trim() || !surname.trim()) {
            notifications.show({
                title: 'Ошибка валидации',
                message: 'Имя и фамилия обязательны для заполнения',
                color: 'red',
            });
            return;
        }

        try {
            await profileApi.update({
                name: name.trim(),
                surname: surname.trim(),
                patronymic: patronymic.trim() || undefined,
            });
            await loadProfileData();
            setEditingName(false);
            notifications.show({
                title: 'Успешно',
                message: 'ФИО успешно обновлено',
                color: 'green',
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка обновления',
                message: err instanceof Error ? err.message : 'Не удалось обновить ФИО',
                color: 'red',
            });
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await profileApi.delete();
            logout();
            notifications.show({
                title: 'Аккаунт удален',
                message: 'Ваш аккаунт успешно удален',
                color: 'blue',
            });
            navigate('/login');
        } catch (err) {
            notifications.show({
                title: 'Ошибка удаления',
                message: err instanceof Error ? err.message : 'Не удалось удалить аккаунт',
                color: 'red',
            });
        } finally {
            setIsDeleting(false);
            setDeleteModalOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        notifications.show({
            title: 'Выход выполнен',
            message: 'Вы успешно вышли из аккаунта',
            color: 'blue',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU');
    };

    const getFullName = (p: UserProfile) => {
        const parts = [p.surname, p.name];
        if (p.patronymic) {
            parts.push(p.patronymic);
        }
        return parts.join(' ');
    };

    const loadSessions = async (reset: boolean = false) => {
        try {
            if (reset) {
                setSessionsLoading(true);
                setSessionsOffset(0);
            } else {
                setLoadingMoreSessions(true);
            }
            setSessionsError(null);
            const offset = reset ? 0 : sessionsOffset;
            const data = await profileApi.getSessions({ offset, limit: SESSIONS_PER_PAGE });
            if (reset) {
                setSessions(data.items);
            } else {
                setSessions(prev => [...prev, ...data.items]);
            }
            setSessionsTotal(data.total);
            setSessionsOffset(offset + data.items.length);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить список сессий';
            setSessionsError(errorMessage);
        } finally {
            setSessionsLoading(false);
            setLoadingMoreSessions(false);
        }
    };

    const loadMoreSessions = () => {
        loadSessions(false);
    };

    const loadSurveySessions = async (reset: boolean = false) => {
        try {
            if (reset) {
                setSurveySessionsLoading(true);
                setSurveySessionsOffset(0);
            } else {
                setLoadingMoreSurveySessions(true);
            }
            setSurveySessionsError(null);
            const offset = reset ? 0 : surveySessionsOffset;
            const data = await profileApi.getSurveySessions({
                offset,
                limit: SESSIONS_PER_PAGE,
            });
            if (reset) {
                setSurveySessions(data.items);
            } else {
                setSurveySessions(prev => [...prev, ...data.items]);
            }
            setSurveySessionsTotal(data.total);
            setSurveySessionsOffset(offset + data.items.length);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Не удалось загрузить сессии опросов';
            setSurveySessionsError(errorMessage);
        } finally {
            setSurveySessionsLoading(false);
            setLoadingMoreSurveySessions(false);
        }
    };

    const loadMoreSurveySessions = () => {
        loadSurveySessions(false);
    };

    const handleContinueSurveySession = async (sessionId: string) => {
        try {
            const fullSession = await surveySessionsApi.get(sessionId);
            const surveyId = fullSession.surveyId;
            surveySessionStorage.saveSessionId(surveyId, sessionId);
            navigate(`/survey/${surveyId}`, {
                state: { continueFromProfile: true },
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка',
                message: err instanceof Error ? err.message : 'Не удалось загрузить сессию',
                color: 'red',
            });
        }
    };

    const handleCloseSurveySession = async (sessionId: string) => {
        try {
            await surveySessionsApi.close(sessionId);
            setSurveySessions(prev =>
                prev.map(s =>
                    s.id === sessionId ? { ...s, status: 'CLOSED' as const } : s,
                ),
            );
            notifications.show({
                title: 'Успешно',
                message: 'Сессия закрыта',
                color: 'green',
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка',
                message: err instanceof Error ? err.message : 'Не удалось закрыть сессию',
                color: 'red',
            });
        }
    };

    const handleContinueSession = async (sessionId: string) => {
        try {
            const fullSession = await testingSessionsApi.get(sessionId);
            const testId = fullSession.testId;
            testingSessionStorage.saveSessionId(testId, sessionId);
            navigate(`/test/${testId}`, {
                state: { continueFromProfile: true },
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка',
                message: err instanceof Error ? err.message : 'Не удалось загрузить сессию',
                color: 'red',
            });
        }
    };

    const handleViewResult = async (sessionId: string) => {
        try {
            const fullSession = await testingSessionsApi.get(sessionId);
            navigate(`/test/${fullSession.testId}/results?sessionId=${sessionId}`, {
                state: { session: fullSession },
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка',
                message: err instanceof Error ? err.message : 'Не удалось загрузить сессию',
                color: 'red',
            });
        }
    };

    const handleCloseSession = async (sessionId: string) => {
        try {
            await testingSessionsApi.close(sessionId);
            // Обновляем список сессий локально - меняем статус на CLOSED
            setSessions(prev => prev.map(s => 
                s.id === sessionId ? { ...s, status: 'CLOSED' as const } : s
            ));
            // Обновляем только статистику профиля, без полной перезагрузки
            if (profile) {
                setProfile(prev => prev ? {
                    ...prev,
                    inProgressSessionsCount: Math.max(0, prev.inProgressSessionsCount - 1),
                } : null);
            }
            notifications.show({
                title: 'Успешно',
                message: 'Сессия закрыта',
                color: 'green',
            });
        } catch (err) {
            notifications.show({
                title: 'Ошибка',
                message: err instanceof Error ? err.message : 'Не удалось закрыть сессию',
                color: 'red',
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <Badge color="green">Завершен</Badge>;
            case 'IN_PROGRESS':
                return <Badge color="blue">В процессе</Badge>;
            case 'CLOSED':
                return <Badge color="gray">Закрыт</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getSessionsStats = () => {
        if (!profile) {
            return { total: 0, completed: 0, inProgress: 0 };
        }
        return {
            total: profile.sessionsCount,
            completed: profile.completedSessionsCount,
            inProgress: profile.inProgressSessionsCount,
        };
    };

    const getSurveySessionsStats = () => {
        if (!profile) {
            return { total: 0, completed: 0, inProgress: 0 };
        }
        return {
            total: profile.surveySessionsCount,
            completed: profile.completedSurveySessionsCount,
            inProgress: profile.inProgressSurveySessionsCount,
        };
    };

    const hasMoreSessions = sessions.length < sessionsTotal;
    const hasMoreSurveySessions = surveySessions.length < surveySessionsTotal;

    if (loading) {
        return (
            <Container size="lg" py="xl" style={{ position: 'relative' }}>
                <Group justify="space-between" mb="xl">
                    <Group>
                        <IconUser size={32} style={{ color: 'white' }} />
                        <Title order={1} c="white">Профиль пользователя</Title>
                    </Group>
                </Group>
                <Grid gutter="xl" align="stretch">
                    <Grid.Col span={{ md: 4 }}>
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                            <Stack gap="md" align="center">
                                <Skeleton height={56} circle />
                                <Skeleton height={20} width="70%" />
                                <Skeleton height={14} width="40%" />
                                <Divider style={{ width: '100%' }} />
                                <Skeleton height={28} width="30%" />
                                <Skeleton height={14} width="60%" />
                                <Divider style={{ width: '100%' }} />
                                <Skeleton height={28} width="30%" />
                                <Skeleton height={14} width="60%" />
                            </Stack>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={{ md: 8 }}>
                        <Card shadow="sm" p="lg" radius="md" withBorder style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                            <Skeleton height={28} width="40%" mb="lg" />
                            <Stack gap="md">
                                <Skeleton height={18} />
                                <Skeleton height={18} width="80%" />
                                <Skeleton height={18} width="60%" />
                                <Skeleton height={18} width="70%" />
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Container>
        );
    }

    if (error && !profile) {
        return (
            <Container size="lg" py="xl" style={{ position: 'relative' }}>
                <Alert color="red" title="Ошибка" mb="lg">
                    {error}
                </Alert>
                <Button onClick={loadProfileData}>Попробовать снова</Button>
            </Container>
        );
    }

    if (!profile) {
        return null;
    }

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <Container size="lg" py="xl" style={{ position: 'relative' }}>
                <Group justify="space-between" mb="xl">
                    <Group>
                        <IconUser size={32} style={{ color: 'white' }} />
                        <Title order={1} c="white">Профиль пользователя</Title>
                    </Group>
                </Group>

                {error && (
                    <Alert color="yellow" mb="xl" withCloseButton onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Grid gutter="xl" align="stretch">
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
                                flexDirection: 'column',
                            }}
                        >
                            <Group justify="center" mb="md">
                                <Avatar color="blue" size="lg" radius="xl">
                                    <IconMoodSmile size={24} />
                                </Avatar>
                            </Group>
                            <Stack gap="md" style={{ flex: 1 }} justify="space-around">
                                <Box style={{ textAlign: 'center' }}>
                                    <Text size="lg" fw={700} c="blue">
                                        {getFullName(profile)}
                                    </Text>
                                    <Text size="sm" c="dimmed">Пользователь</Text>
                                </Box>

                                <Divider />

                                <Grid gutter="md">
                                    <Grid.Col span={6}>
                                        <Stack gap="sm">
                                            <Text size="xs" fw={600} c="dimmed" tt="uppercase" ta="center">
                                                Тесты
                                            </Text>
                                            <Box style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700} c="blue">
                                                    {getSessionsStats().total}
                                                </Text>
                                                <Text size="xs" c="dimmed">Пройдено</Text>
                                            </Box>
                                            <Box style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700} c="green">
                                                    {getSessionsStats().completed}
                                                </Text>
                                                <Text size="xs" c="dimmed">Завершено</Text>
                                            </Box>
                                            {getSessionsStats().inProgress > 0 && (
                                                <Box style={{ textAlign: 'center' }}>
                                                    <Text size="xl" fw={700} c="orange">
                                                        {getSessionsStats().inProgress}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">В процессе</Text>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid.Col>
                                    <Grid.Col span={6}>
                                        <Stack gap="sm">
                                            <Text size="xs" fw={600} c="dimmed" tt="uppercase" ta="center">
                                                Опросы
                                            </Text>
                                            <Box style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700} c="teal">
                                                    {getSurveySessionsStats().total}
                                                </Text>
                                                <Text size="xs" c="dimmed">Пройдено</Text>
                                            </Box>
                                            <Box style={{ textAlign: 'center' }}>
                                                <Text size="xl" fw={700} c="green">
                                                    {getSurveySessionsStats().completed}
                                                </Text>
                                                <Text size="xs" c="dimmed">Завершено</Text>
                                            </Box>
                                            {getSurveySessionsStats().inProgress > 0 && (
                                                <Box style={{ textAlign: 'center' }}>
                                                    <Text size="xl" fw={700} c="orange">
                                                        {getSurveySessionsStats().inProgress}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">В процессе</Text>
                                                </Box>
                                            )}
                                        </Stack>
                                    </Grid.Col>
                                </Grid>
                            </Stack>
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={{ md: 8 }}>
                        <Card
                            shadow="sm"
                            p="lg"
                            radius="md"
                            withBorder
                            style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Title order={2} mb="md">Личная информация</Title>

                            <Stack gap="md" style={{ flex: 1 }}>
                                <Group justify="space-between">
                                    <Group>
                                        <IconUser size={20} color="gray" />
                                        <Text size="sm" c="dimmed">ФИО:</Text>
                                    </Group>
                                    {editingName ? (
                                        <Stack gap="xs" style={{ flex: 1, maxWidth: 400 }}>
                                            <TextInput
                                                label="Фамилия"
                                                value={surname}
                                                onChange={(e) => setSurname(e.target.value)}
                                                placeholder="Введите фамилию"
                                                size="sm"
                                                required
                                            />
                                            <TextInput
                                                label="Имя"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Введите имя"
                                                size="sm"
                                                required
                                            />
                                            <TextInput
                                                label="Отчество (необязательно)"
                                                value={patronymic}
                                                onChange={(e) => setPatronymic(e.target.value)}
                                                placeholder="Введите отчество"
                                                size="sm"
                                            />
                                            <Group gap="xs">
                                                <ActionIcon
                                                    color="green"
                                                    onClick={handleUpdateName}
                                                    variant="filled"
                                                >
                                                    <IconCheck size={16} />
                                                </ActionIcon>
                                                <ActionIcon
                                                    color="red"
                                                    onClick={handleCancelEdit}
                                                    variant="filled"
                                                >
                                                    <IconX size={16} />
                                                </ActionIcon>
                                            </Group>
                                        </Stack>
                                    ) : (
                                        <Group gap="xs">
                                            <Text fw={500}>{getFullName(profile)}</Text>
                                            <ActionIcon onClick={handleStartEdit} variant="subtle">
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
                                    <Text fw={500}>{profile.email}</Text>
                                </Group>

                                <Group justify="space-between">
                                    <Group>
                                        <IconCalendar size={20} color="gray" />
                                        <Text size="sm" c="dimmed">Дата регистрации:</Text>
                                    </Group>
                                    <Text fw={500}>{formatDate(profile.registeredAt)}</Text>
                                </Group>

                                {profile.lastLoginAt && (
                                    <Group justify="space-between">
                                        <Group>
                                            <IconHistory size={20} color="gray" />
                                            <Text size="sm" c="dimmed">Последний вход:</Text>
                                        </Group>
                                        <Text fw={500}>{formatDate(profile.lastLoginAt)}</Text>
                                    </Group>
                                )}

                                <Divider style={{ marginTop: 'auto' }} />

                                <Group justify="center" gap="md">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        leftSection={<IconLogout size={16} />}
                                        onClick={handleLogout}
                                    >
                                        Выйти из аккаунта
                                    </Button>
                                    <Button
                                        variant="outline"
                                        color="red"
                                        leftSection={<IconTrash size={16} />}
                                        onClick={() => setDeleteModalOpen(true)}
                                    >
                                        Удалить аккаунт
                                    </Button>
                                </Group>
                            </Stack>
                        </Card>
                    </Grid.Col>
                </Grid>

                <Card shadow="sm" p="lg" radius="md" withBorder mt="xl" style={{ background: 'rgba(255, 255, 255, 0.95)' }}>
                    <Group mb="md">
                        <IconHistory size={24} />
                        <Title order={2}>Мои сессии</Title>
                    </Group>

                    <Tabs value={activeSessionsTab} onChange={value => setActiveSessionsTab(value ?? 'tests')}>
                        <Tabs.List mb="md">
                            <Tabs.Tab value="tests">
                                Тестирования{sessionsTotal ? ` (${sessionsTotal})` : ''}
                            </Tabs.Tab>
                            <Tabs.Tab value="surveys">
                                Опросы{surveySessionsTotal ? ` (${surveySessionsTotal})` : ''}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="tests">
                            {sessionsLoading ? (
                                <Stack gap="md">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Paper key={i} p="md" withBorder>
                                            <Group justify="space-between" mb="xs">
                                                <Group>
                                                    <Skeleton height={16} width={180} />
                                                    <Skeleton height={20} width={90} radius="xl" />
                                                </Group>
                                                <Skeleton height={14} width={140} />
                                            </Group>
                                            <Group justify="flex-end" mt="md">
                                                <Skeleton height={36} width={150} radius="sm" />
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : sessionsError ? (
                                <Alert color="red" title="Ошибка загрузки" mb="md">
                                    {sessionsError}
                                </Alert>
                            ) : sessions.length === 0 ? (
                                <Box py="xl" style={{ textAlign: 'center' }}>
                                    <Text c="dimmed" mb="sm">У вас пока нет сессий тестирования</Text>
                                    <Text size="sm" c="dimmed">
                                        Начните прохождение теста, чтобы увидеть его здесь
                                    </Text>
                                </Box>
                            ) : (
                                <Stack gap="md">
                                    {sessions.map((session) => (
                                        <Paper key={session.id} p="md" withBorder>
                                            <Group justify="space-between" mb="xs">
                                                <Group>
                                                    <Text fw={600}>{session.testName}</Text>
                                                    {getStatusBadge(session.status)}
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    {formatDate(session.createdAt)}
                                                </Text>
                                            </Group>

                                            <Group justify="flex-end" mt="md" gap="xs">
                                                {session.status === 'IN_PROGRESS' && (
                                                    <>
                                                        <Button
                                                            leftSection={<IconArrowRight size={16} />}
                                                            onClick={() => handleContinueSession(session.id)}
                                                            variant="light"
                                                            color="blue"
                                                            style={{ minWidth: 150 }}
                                                        >
                                                            Продолжить
                                                        </Button>
                                                        <Button
                                                            leftSection={<IconX size={16} />}
                                                            onClick={() => handleCloseSession(session.id)}
                                                            variant="light"
                                                            color="red"
                                                            style={{ minWidth: 150 }}
                                                        >
                                                            Закрыть
                                                        </Button>
                                                    </>
                                                )}
                                                {session.status === 'COMPLETED' && (
                                                    <Button
                                                        leftSection={<IconEye size={16} />}
                                                        onClick={() => handleViewResult(session.id)}
                                                        variant="light"
                                                        color="green"
                                                        style={{ minWidth: 150 }}
                                                    >
                                                        Просмотреть результат
                                                    </Button>
                                                )}
                                                {session.status === 'CLOSED' && (
                                                    <Text size="sm" c="dimmed" style={{ minWidth: 150, textAlign: 'right' }}>
                                                        Сессия закрыта
                                                    </Text>
                                                )}
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}

                            {hasMoreSessions && (
                                <Group justify="center" mt="md">
                                    <Button
                                        variant="light"
                                        onClick={loadMoreSessions}
                                        loading={loadingMoreSessions}
                                    >
                                        Посмотреть еще
                                    </Button>
                                </Group>
                            )}
                        </Tabs.Panel>

                        <Tabs.Panel value="surveys">
                            {surveySessionsLoading ? (
                                <Stack gap="md">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Paper key={i} p="md" withBorder>
                                            <Group justify="space-between" mb="xs">
                                                <Group>
                                                    <Skeleton height={16} width={180} />
                                                    <Skeleton height={20} width={90} radius="xl" />
                                                </Group>
                                                <Skeleton height={14} width={140} />
                                            </Group>
                                            <Group justify="flex-end" mt="md">
                                                <Skeleton height={36} width={150} radius="sm" />
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : surveySessionsError ? (
                                <Alert color="red" title="Ошибка загрузки" mb="md">
                                    {surveySessionsError}
                                </Alert>
                            ) : surveySessions.length === 0 ? (
                                <Box py="xl" style={{ textAlign: 'center' }}>
                                    <Text c="dimmed" mb="sm">У вас пока нет сессий опросов</Text>
                                    <Text size="sm" c="dimmed">
                                        Пройдите опрос, чтобы увидеть его здесь
                                    </Text>
                                </Box>
                            ) : (
                                <Stack gap="md">
                                    {surveySessions.map((session) => (
                                        <Paper key={session.id} p="md" withBorder>
                                            <Group justify="space-between" mb="xs">
                                                <Group>
                                                    <Text fw={600}>{session.surveyName}</Text>
                                                    {getStatusBadge(session.status)}
                                                </Group>
                                                <Text size="sm" c="dimmed">
                                                    {formatDate(session.createdAt)}
                                                </Text>
                                            </Group>

                                            <Group justify="flex-end" mt="md" gap="xs">
                                                {session.status === 'IN_PROGRESS' && (
                                                    <>
                                                        <Button
                                                            leftSection={<IconArrowRight size={16} />}
                                                            onClick={() => handleContinueSurveySession(session.id)}
                                                            variant="light"
                                                            color="teal"
                                                            style={{ minWidth: 150 }}
                                                        >
                                                            Продолжить
                                                        </Button>
                                                        <Button
                                                            leftSection={<IconX size={16} />}
                                                            onClick={() => handleCloseSurveySession(session.id)}
                                                            variant="light"
                                                            color="red"
                                                            style={{ minWidth: 150 }}
                                                        >
                                                            Закрыть
                                                        </Button>
                                                    </>
                                                )}
                                                {session.status === 'COMPLETED' && (
                                                    <Text size="sm" c="dimmed" style={{ minWidth: 150, textAlign: 'right' }}>
                                                        Опрос пройден
                                                    </Text>
                                                )}
                                                {session.status === 'CLOSED' && (
                                                    <Text size="sm" c="dimmed" style={{ minWidth: 150, textAlign: 'right' }}>
                                                        Сессия закрыта
                                                    </Text>
                                                )}
                                            </Group>
                                        </Paper>
                                    ))}
                                </Stack>
                            )}

                            {hasMoreSurveySessions && (
                                <Group justify="center" mt="md">
                                    <Button
                                        variant="light"
                                        onClick={loadMoreSurveySessions}
                                        loading={loadingMoreSurveySessions}
                                    >
                                        Посмотреть еще
                                    </Button>
                                </Group>
                            )}
                        </Tabs.Panel>
                    </Tabs>
                </Card>
            </Container>

            <Modal
                opened={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Удаление аккаунта"
                centered
            >
                <Stack>
                    <Text>
                        Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
                        Все ваши данные будут безвозвратно удалены.
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                            Отмена
                        </Button>
                        <Button color="red" onClick={handleDeleteAccount} loading={isDeleting}>
                            Удалить аккаунт
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </div>
    );
};

export default ProfilePage;
