import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Badge,
    Button,
    Card,
    Center,
    Container,
    Group,
    Loader,
    Modal,
    Progress,
    Stack,
    Text,
    Title,
} from '@mantine/core';
import {
    ExistingQuestion,
    FullTestingSession,
    SessionAnswer,
    Test,
} from '@/types';
import { fetchTests } from '@/api/tests';
import { enrichTest } from '@/utils/testAdapters';
import {
    testingSessionsApi,
    isConflictError,
    isInactiveTestError,
    extractApiErrorMessage,
} from '@/api/testingSessions';
import { testingSessionStorage } from '@/utils/testingSessionStorage';
import { notifications } from '@mantine/notifications';

type AnswersMap = Record<string, number | null>;

const buildAnswersMap = (answers: SessionAnswer[]): AnswersMap =>
    answers.reduce<AnswersMap>((acc, item) => {
        acc[item.questionId] = item.selectedIndex ?? null;
        return acc;
    }, {});

const buildAnswersPayload = (
    questions: ExistingQuestion[],
    answersMap: AnswersMap,
): SessionAnswer[] =>
    questions.map(question => ({
        questionId: question.id,
        selectedIndex:
            answersMap[question.id] === undefined ? null : answersMap[question.id],
    }));

const isQuestionAnswered = (question: ExistingQuestion, answersMap: AnswersMap): boolean => {
    const value = answersMap[question.id];
    return value !== undefined && value !== null;
};

const getInitialQuestionIndex = (
    questions: ExistingQuestion[],
    answersMap: AnswersMap,
): number => {
    if (!questions.length) {
        return 0;
    }
    const firstUnanswered = questions.findIndex(q => !isQuestionAnswered(q, answersMap));
    return firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;
};

const TestingPage: React.FC = () => {
    const { testId: testIdParam } = useParams<{ testId: string }>();
    const testId = testIdParam ?? '';
    const navigate = useNavigate();
    const location = useLocation();
    const locationState = (location.state as { test?: Test; continueFromProfile?: boolean } | undefined) ?? {};

    const [testDetails, setTestDetails] = useState<Test | null>(locationState.test ?? null);
    const [session, setSession] = useState<FullTestingSession | null>(null);
    const [questions, setQuestions] = useState<ExistingQuestion[]>([]);
    const [answersMap, setAnswersMap] = useState<AnswersMap>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isRestarting, setIsRestarting] = useState(false);
    const [isTestInactive, setIsTestInactive] = useState(false);
    const isNewlyCreatedRef = useRef(false);
    const isInitializingRef = useRef(false);

    const currentQuestion = useMemo(
        () => questions[currentQuestionIndex],
        [questions, currentQuestionIndex],
    );
    const totalQuestions = questions.length;
    const progress = totalQuestions ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

    const loadTestDetails = useCallback(async () => {
        if (testDetails || !testId) {
            return;
        }

        try {
            const data = await fetchTests({ offset: 0, limit: 50 });
            const match = data.items.find(item => item.id === testId);
            if (match) {
                setTestDetails(enrichTest(match));
            }
        } catch {
            // описание не обязательно
        }
    }, [testDetails, testId]);

    useEffect(() => {
        loadTestDetails();
    }, [loadTestDetails]);

    const findRemoteActiveSession = useCallback(async (): Promise<FullTestingSession | null> => {
        const sessions = await testingSessionsApi.list({ offset: 0, limit: 50 });
        const match = sessions.items.find(
            item => item.testId === testId && item.status === 'IN_PROGRESS',
        );
        if (!match) {
            return null;
        }
        // В list нет questions, поэтому грузим полную сессию.
        return testingSessionsApi.get(match.id);
    }, [testId]);

    const createNewSessionRef = useRef(false);

    const createNewSession = useCallback(async () => {
        if (createNewSessionRef.current) {
            return;
        }
        createNewSessionRef.current = true;
        try {
            const newSession = await testingSessionsApi.create(testId);
            testingSessionStorage.saveSessionId(testId, newSession.id);
            setSession(newSession);
        } finally {
            setTimeout(() => {
                createNewSessionRef.current = false;
            }, 1000);
        }
    }, [testId]);

    const initializeSession = useCallback(async () => {
        if (!testId) {
            return;
        }

        if (isInitializingRef.current) {
            return;
        }

        isInitializingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const savedSessionId = testingSessionStorage.getSessionId(testId);

            if (savedSessionId) {
                const existing = await testingSessionsApi.get(savedSessionId);
                if (existing.status === 'COMPLETED' || existing.status === 'CLOSED') {
                    testingSessionStorage.clearSessionId(testId);
                } else {
                    isNewlyCreatedRef.current = false;
                    setSession(existing);
                    setLoading(false);
                    isInitializingRef.current = false;
                    return;
                }
            }

            const remote = await findRemoteActiveSession();
            if (remote) {
                testingSessionStorage.saveSessionId(testId, remote.id);
                isNewlyCreatedRef.current = false;
                setSession(remote);
                setLoading(false);
                isInitializingRef.current = false;
                return;
            }

            isNewlyCreatedRef.current = true;
            await createNewSession();
        } catch (err) {
            if (isConflictError(err)) {
                const remote = await findRemoteActiveSession();
                if (remote) {
                    testingSessionStorage.saveSessionId(testId, remote.id);
                    isNewlyCreatedRef.current = false;
                    setSession(remote);
                    setLoading(false);
                    isInitializingRef.current = false;
                    return;
                }
            }
            if (isInactiveTestError(err)) {
                setIsTestInactive(true);
                testingSessionStorage.clearSessionId(testId);
                setError(null);
                return;
            }
            setError(extractApiErrorMessage(err, 'Не удалось загрузить сессию'));
        } finally {
            setLoading(false);
            isInitializingRef.current = false;
        }
    }, [createNewSession, findRemoteActiveSession, testId]);

    useEffect(() => {
        isInitializingRef.current = false;
        initializeSession();

        return () => {
            isInitializingRef.current = false;
        };
    }, [initializeSession]);

    useEffect(() => {
        if (!session) {
            return;
        }

        const sortedQuestions = [...session.questions].sort((a, b) => a.position - b.position);
        const map = buildAnswersMap(session.answers);

        setQuestions(sortedQuestions);
        setAnswersMap(map);
        setCurrentQuestionIndex(getInitialQuestionIndex(sortedQuestions, map));

        if (
            !locationState.continueFromProfile &&
            session.status === 'IN_PROGRESS' &&
            !isNewlyCreatedRef.current
        ) {
            setShowContinueModal(true);
        }
        isNewlyCreatedRef.current = false;
    }, [session, locationState.continueFromProfile]);

    const handleSelectAnswer = (optionIndex: number) => {
        if (!currentQuestion) {
            return;
        }
        if (currentQuestion.content.type !== 'Choice') {
            // Бек поддерживает Input, но UI пока работает только с Choice.
            return;
        }
        setAnswersMap(prev => ({ ...prev, [currentQuestion.id]: optionIndex }));
    };

    const persistAnswers = useCallback(async () => {
        if (!session) {
            return;
        }
        const payload = buildAnswersPayload(questions, answersMap);
        await testingSessionsApi.updateAnswers(session.id, payload);
    }, [answersMap, questions, session]);

    const completeTest = async () => {
        if (!session) {
            return;
        }
        setIsCompleting(true);
        try {
            await persistAnswers();
            const completedSession = await testingSessionsApi.complete(session.id);
            testingSessionStorage.clearSessionId(testId);
            navigate(`/test/${testId}/results?sessionId=${completedSession.id}`, {
                state: { session: completedSession, test: testDetails },
                replace: true,
            });
        } catch (err) {
            notifications.show({
                title: 'Не удалось завершить тест',
                message: extractApiErrorMessage(err, 'Попробуйте еще раз'),
                color: 'red',
            });
        } finally {
            setIsCompleting(false);
        }
    };

    const handleNextQuestion = async () => {
        if (!session || !currentQuestion) {
            return;
        }

        if (!isQuestionAnswered(currentQuestion, answersMap)) {
            notifications.show({
                title: 'Ответ не выбран',
                message: 'Пожалуйста, отметьте хотя бы один вариант перед продолжением.',
                color: 'yellow',
            });
            return;
        }

        const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

        if (isLastQuestion) {
            await completeTest();
            return;
        }

        setIsSaving(true);
        try {
            await persistAnswers();
            setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions - 1));
        } catch (err) {
            notifications.show({
                title: 'Не удалось сохранить ответ',
                message: extractApiErrorMessage(err, 'Попробуйте еще раз'),
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex === 0) {
            return;
        }
        setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
    };

    const handleContinueSession = () => {
        setShowContinueModal(false);
    };

    const handleRestartRequest = () => {
        setIsRestartModalOpen(true);
    };

    const handleRestartCancel = () => {
        setIsRestartModalOpen(false);
    };

    const handleRestartConfirm = async () => {
        if (!session || isRestarting) {
            return;
        }
        setIsRestarting(true);
        try {
            await testingSessionsApi.close(session.id);
            testingSessionStorage.clearSessionId(testId);
            isInitializingRef.current = false;
            isNewlyCreatedRef.current = true;
            await createNewSession();
            setIsRestartModalOpen(false);
            setShowContinueModal(false);
        } catch (err) {
            notifications.show({
                title: 'Не удалось перезапустить тест',
                message: extractApiErrorMessage(err, 'Попробуйте еще раз'),
                color: 'red',
            });
        } finally {
            setIsRestarting(false);
        }
    };

    const disabledControls = isSaving || isCompleting || loading;

    if (isTestInactive) {
        return (
            <>
                <Container size="sm" py="xl">
                    <Alert color="yellow" mb="lg" title="Тест недоступен">
                        Этот тест сейчас не опубликован, пройти его нельзя.
                        Попробуйте выбрать другой тест из каталога.
                    </Alert>
                    <Button variant="light" onClick={() => navigate('/tests')}>
                        К списку тестов
                    </Button>
                </Container>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Center style={{ minHeight: '60vh' }}>
                    <Loader />
                </Center>
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
                    <Button variant="light" onClick={initializeSession}>
                        Попробовать снова
                    </Button>
                </Container>
            </>
        );
    }

    if (!session || !totalQuestions) {
        return (
            <>
                <Container size="sm" py="xl">
                    <Text>Вопросы для этого теста отсутствуют.</Text>
                </Container>
            </>
        );
    }

    const choiceContent =
        currentQuestion?.content.type === 'Choice' ? currentQuestion.content : null;
    const selectedIndex =
        currentQuestion ? answersMap[currentQuestion.id] ?? null : null;

    return (
        <>
            <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
                <Modal
                    opened={showContinueModal}
                    onClose={() => setShowContinueModal(false)}
                    title="Продолжить тест?"
                    centered
                >
                    <Stack>
                        <Text>
                            Мы нашли незавершенную попытку. Хотите продолжить с вопроса {currentQuestionIndex + 1}?
                        </Text>
                        <Group justify="center">
                            <Button onClick={handleContinueSession}>Продолжить</Button>
                            <Button variant="outline" onClick={handleRestartRequest}>
                                Начать заново
                            </Button>
                        </Group>
                    </Stack>
                </Modal>

                <Modal
                    opened={isRestartModalOpen}
                    onClose={handleRestartCancel}
                    title="Начать тест заново?"
                    centered
                >
                    <Stack>
                        <Text>Текущий прогресс будет потерян. Продолжить?</Text>
                        <Group justify="center">
                            <Button onClick={handleRestartConfirm} color="red" loading={isRestarting}>
                                Начать заново
                            </Button>
                            <Button variant="outline" onClick={handleRestartCancel} disabled={isRestarting}>
                                Отмена
                            </Button>
                        </Group>
                    </Stack>
                </Modal>

                <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
                    <Title order={1}>{testDetails?.name ?? 'Психологический тест'}</Title>
                    <Text size="lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {testDetails?.transcript ?? 'Ответьте на вопросы, чтобы получить персонализированный результат'}
                    </Text>
                </div>

                <Card shadow="md" p="xl" style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}>
                    <Stack gap="md" mb="xl">
                        <Group justify="space-between">
                            <Text fw={500}>
                                Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                            </Text>
                            <Text fw={500} c="dimmed">
                                {Math.round(progress)}%
                            </Text>
                        </Group>
                        <Progress value={progress} size="lg" radius="md" />
                    </Stack>

                    <Stack gap="lg" mb="xl">
                        <div>
                            <Badge size="lg" mb="md" color="violet">
                                Вопрос {currentQuestionIndex + 1}
                            </Badge>
                            <Title order={2} size="h3" style={{ marginBottom: '30px', color: '#2c3e50' }}>
                                {currentQuestion?.content.text}
                            </Title>
                        </div>

                        {choiceContent ? (
                            <Stack gap="md">
                                {choiceContent.options.map(option => {
                                    const selected = selectedIndex === option.index;
                                    return (
                                        <Card
                                            key={option.index}
                                            p="md"
                                            radius="md"
                                            style={{
                                                border: selected ? '2px solid #667eea' : '2px solid #e0e0e0',
                                                background: selected
                                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                    : 'white',
                                                cursor: disabledControls ? 'not-allowed' : 'pointer',
                                                opacity: disabledControls ? 0.7 : 1,
                                                transition: 'all 0.2s ease',
                                            }}
                                            onClick={() => !disabledControls && handleSelectAnswer(option.index)}
                                            withBorder
                                        >
                                            <Group>
                                                <div
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '50%',
                                                        border: `2px solid ${selected ? 'white' : '#ccc'}`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: selected ? 'white' : 'transparent',
                                                    }}
                                                >
                                                    {selected && (
                                                        <div
                                                            style={{
                                                                width: '8px',
                                                                height: '8px',
                                                                backgroundColor: '#667eea',
                                                                borderRadius: '50%',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <Text
                                                    fw={500}
                                                    style={{
                                                        color: selected ? 'white' : '#333',
                                                    }}
                                                >
                                                    {option.text}
                                                </Text>
                                            </Group>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Alert color="yellow">
                                Этот тип вопроса пока не поддерживается в интерфейсе.
                            </Alert>
                        )}
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Button
                            variant="light"
                            disabled={currentQuestionIndex === 0 || disabledControls}
                            onClick={handlePreviousQuestion}
                        >
                            ← Назад
                        </Button>

                        <Button
                            gradient={{ from: 'blue', to: 'cyan' }}
                            onClick={handleNextQuestion}
                            disabled={disabledControls}
                            loading={isSaving || isCompleting}
                        >
                            {currentQuestionIndex === totalQuestions - 1 ? 'Завершить →' : 'Далее →'}
                        </Button>
                    </Group>
                </Card>
            </Container>
        </>
    );
};

export default TestingPage;
