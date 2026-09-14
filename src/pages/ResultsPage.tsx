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
import { FullTestingSession, Test } from '@/types';
import { testingSessionsApi } from '@/api/testingSessions';
import { fetchTests } from '@/api/tests';
import { enrichTest, getCategoryLabel, getCategoryColor } from '@/utils/testAdapters';
import ReactMarkdown from 'react-markdown';

interface LocationState {
    session?: FullTestingSession;
    test?: Test;
}

const ResultsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { testId: routeTestId } = useParams<{ testId: string }>();
    const [searchParams] = useSearchParams();
    const locationState = (location.state as LocationState | undefined) ?? {};

    const [session, setSession] = useState<FullTestingSession | null>(locationState.session ?? null);
    const [testDetails, setTestDetails] = useState<Test | null>(locationState.test ?? null);
    // Если сессия пришла из location.state, не показываем спиннер — фоном подгрузим свежие данные.
    const [loading, setLoading] = useState(!locationState.session);
    const [error, setError] = useState<string | null>(null);

    const sessionIdFromParams = searchParams.get('sessionId');
    const sessionId = session?.id ?? sessionIdFromParams ?? '';

    const loadSession = useCallback(async () => {
        if (!sessionId) {
            setError('Идентификатор сессии не найден');
            setLoading(false);
            return;
        }

        // Если session уже есть в state, все равно загружаем свежие данные —
        // но без сброса в loading, чтобы UI не моргал.
        if (!session) {
            setLoading(true);
        }
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

    const [regenerating, setRegenerating] = useState(false);

    const handleRegenerate = async () => {
        if (!session) {return;}
        setRegenerating(true);
        setError(null);
        try {
            const updated = await testingSessionsApi.regenerateResult(session.id);
            setSession(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось сгенерировать результат');
        } finally {
            setRegenerating(false);
        }
    };

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

    if (error && !session) {
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

    const hasResult = Boolean(session.result && session.result.trim().length > 0);
    const resultText = session.result ?? '';
    const sortedQuestions = [...session.questions].sort((a, b) => a.position - b.position);
    const answersByQuestion = new Map(session.answers.map(a => [a.questionId, a.selectedIndex]));
    const answeredCount = sortedQuestions.filter(q => {
        const idx = answersByQuestion.get(q.id);
        return idx !== undefined && idx !== null;
    }).length;

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
                        {hasResult ? (
                            <ReactMarkdown>{resultText}</ReactMarkdown>
                        ) : (
                            <Stack gap="sm">
                                <Alert color="yellow" title="Результат ещё не готов">
                                    Модель анализа временно недоступна. Ваши ответы сохранены —
                                    попробуйте сгенерировать заключение ещё раз.
                                </Alert>
                                {error ? (
                                    <Alert color="red" title="Ошибка" withCloseButton onClose={() => setError(null)}>
                                        {error}
                                    </Alert>
                                ) : null}
                                <Group>
                                    <Button
                                        onClick={handleRegenerate}
                                        loading={regenerating}
                                        disabled={regenerating}
                                    >
                                        Сгенерировать результат
                                    </Button>
                                </Group>
                            </Stack>
                        )}
                    </Stack>
                </Card>

                <Card shadow="md" p="xl" mb="xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <Group mb="lg">
                        <Text fw={600} size="lg">Ответы</Text>
                        <Badge color="green">{answeredCount} / {sortedQuestions.length}</Badge>
                    </Group>
                    <Stack gap="md">
                        {sortedQuestions.map(question => {
                            const selectedIdx = answersByQuestion.get(question.id);
                            const selectedOption =
                                question.content.type === 'Choice' && selectedIdx != null
                                    ? question.content.options.find(opt => opt.index === selectedIdx)
                                    : null;
                            return (
                                <Card key={question.id} withBorder radius="md">
                                    <Stack gap="xs">
                                        <Text fw={600}>{question.content.text}</Text>
                                        {selectedOption ? (
                                            <Text size="sm">• {selectedOption.text}</Text>
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

