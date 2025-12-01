import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Alert,
    Badge,
    Button,
    Card,
    Container,
    Group,
    Stack,
    Text,
    Title,
    Loader,
    Center,
} from '@mantine/core';
import { Test, TestingSession } from '@/types';
import { testingSessionsApi } from '@/api/testingSessions';
import { fetchTests } from '@/api/tests';
import { enrichTest, getCategoryLabel, getCategoryColor } from '@/utils/testAdapters';
import ReactMarkdown from 'react-markdown';

interface LocationState {
    session?: TestingSession;
    test?: Test;
}

const ResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { testId: routeTestId } = useParams<{ testId: string }>();
    const [searchParams] = useSearchParams();
    const locationState = (location.state as LocationState | undefined) ?? {};

    const [session, setSession] = useState<TestingSession | null>(locationState.session ?? null);
    const [testDetails, setTestDetails] = useState<Test | null>(locationState.test ?? null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sessionIdFromParams = searchParams.get('sessionId');
    const sessionId = session?.id ?? sessionIdFromParams ?? '';

    const loadSession = useCallback(async () => {
        if (!sessionId) {
            setError('Идентификатор сессии не найден');
            setLoading(false);
            return;
        }

        // Если session уже есть в state, все равно загружаем свежие данные
        setLoading(true);
        setError(null);
        try {
            const data = await testingSessionsApi.get(sessionId);
            setSession(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось загрузить результаты теста');
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        loadSession();
    }, [loadSession]);

    const loadTestDetails = useCallback(async () => {
        if (testDetails || !session) {
            return;
        }

        try {
            const data = await fetchTests({ offset: 0, limit: 50 });
            const match = data.items.find(item => item.id === session.testId);
            if (match) {
                setTestDetails(enrichTest(match));
            }
        } catch {
            // описание не обязательно
        }
    }, [session, testDetails]);

    useEffect(() => {
        loadTestDetails();
    }, [loadTestDetails]);

    const handleRetake = () => {
        const targetTestId = session?.testId ?? routeTestId ?? '';
        if (!targetTestId) {
            navigate('/tests');
            return;
        }
        navigate(`/test/${targetTestId}`);
    };

    const handleBackToTests = () => {
        navigate('/tests');
    };

    if (!sessionId) {
        return (
            <>
                <Container size="sm" py="xl">
                    <Alert color="red" title="Ошибка">
                        Не указан идентификатор сессии. Пожалуйста, вернитесь на страницу тестов и попробуйте снова.
                    </Alert>
                    <Button mt="lg" onClick={handleBackToTests}>
                        К списку тестов
                    </Button>
                </Container>
            </>
        );
    }

    if (loading || !session) {
        return (
            <>
                <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
                    <Center style={{ minHeight: '60vh' }}>
                        <Stack align="center" gap="md">
                            <Loader size="lg" />
                            <Text c="white">Загрузка результатов...</Text>
                        </Stack>
                    </Center>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Container size="sm" py="xl">
                    <Alert color="red" mb="lg" title="Ошибка">
                        {error}
                    </Alert>
                    <Button onClick={loadSession}>Попробовать снова</Button>
                </Container>
            </>
        );
    }

    const resultText = session.result ?? 'Результат появится чуть позже. Попробуйте обновить страницу через пару минут.';
    const answeredQuestions = session.questionResponses?.filter(question =>
        question.content.options.some(option => option.isSelected),
    );

    return (
        <>
            <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
                <Stack gap="lg" mb="xl" align="center" style={{ color: 'white' }}>
                    <Title order={1}>Результаты теста</Title>
                    <Text size="lg" style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
                        {testDetails?.name ?? 'Психологический тест'}
                    </Text>
                    <Group gap="sm">
                        <Badge color="violet">
                            Статус: {session.status === 'COMPLETED' ? 'Завершен' : session.status}
                        </Badge>
                        {testDetails?.category && (
                            <Badge color={getCategoryColor(testDetails.category)}>
                                {getCategoryLabel(testDetails.category)}
                            </Badge>
                        )}
                    </Group>
                </Stack>

                <Card shadow="md" p="xl" mb="xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <Stack gap="md">
                        <Title order={3}>Анализ результата</Title>
                        <ReactMarkdown>{resultText}</ReactMarkdown>
                    </Stack>
                </Card>

                <Card shadow="md" p="xl" mb="xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <Group mb="lg">
                        <Text fw={600} size="lg">Ответы</Text>
                        <Badge color="green">{answeredQuestions.length} / {session.questionResponses.length}</Badge>
                    </Group>
                    <Stack gap="md">
                        {session.questionResponses.map(question => {
                            const selectedOptions = question.content.options.filter(option => option.isSelected);
                            return (
                                <Card key={question.id} withBorder radius="md">
                                    <Stack gap="xs">
                                        <Text fw={600}>{question.content.text}</Text>
                                        {selectedOptions.length ? (
                                            <Stack gap={4}>
                                                {selectedOptions.map(option => (
                                                    <Text key={option.index} size="sm">• {option.text}</Text>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Text size="sm" c="dimmed">Ответ не выбран</Text>
                                        )}
                                    </Stack>
                                </Card>
                            );
                        })}
                    </Stack>
                </Card>

                <Group justify="center" mt="lg">
                    <Button variant="light" onClick={handleRetake}>
                        Пройти еще раз
                    </Button>
                    <Button onClick={handleBackToTests}>
                        К другим тестам
                    </Button>
                </Group>
            </Container>
        </>
    );
};

export default ResultsPage;

