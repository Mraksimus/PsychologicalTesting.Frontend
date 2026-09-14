import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
    Textarea,
    Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    ExistingQuestion,
    FullSurveySession,
    SessionAnswer,
    Survey,
} from '@/types';
import { fetchSurveys } from '@/api/surveys';
import {
    extractSurveyApiErrorMessage,
    isInactiveSurveyError,
    isSurveyConflictError,
    surveySessionsApi,
} from '@/api/surveySessions';
import { surveySessionStorage } from '@/utils/surveySessionStorage';

interface AnswerCell {
    selectedIndex: number | null;
    selectedIndices: number[];
    textAnswer: string | null;
}

type AnswersMap = Record<string, AnswerCell>;

const emptyCell = (): AnswerCell => ({
    selectedIndex: null,
    selectedIndices: [],
    textAnswer: null,
});

const buildAnswersMap = (answers: SessionAnswer[]): AnswersMap =>
    answers.reduce<AnswersMap>((acc, item) => {
        acc[item.questionId] = {
            selectedIndex: item.selectedIndex ?? null,
            selectedIndices: item.selectedIndices ?? [],
            textAnswer: item.textAnswer ?? null,
        };
        return acc;
    }, {});

const buildAnswersPayload = (
    questions: ExistingQuestion[],
    answersMap: AnswersMap,
): SessionAnswer[] =>
    questions.map(question => {
        const cell = answersMap[question.id] ?? emptyCell();
        return {
            questionId: question.id,
            selectedIndex: cell.selectedIndex,
            selectedIndices: cell.selectedIndices.length > 0 ? cell.selectedIndices : null,
            textAnswer: cell.textAnswer,
        };
    });

const isQuestionAnswered = (question: ExistingQuestion, answersMap: AnswersMap): boolean => {
    const cell = answersMap[question.id];
    if (!cell) {return false;}
    if (question.content.type === 'Input') {
        return Boolean(cell.textAnswer && cell.textAnswer.trim().length > 0);
    }
    if (question.content.type === 'Choice' && question.content.mod === 'MULTIPLE') {
        return cell.selectedIndices.length > 0;
    }
    return cell.selectedIndex !== null && cell.selectedIndex !== undefined;
};

const getInitialQuestionIndex = (
    questions: ExistingQuestion[],
    answersMap: AnswersMap,
): number => {
    if (!questions.length) {return 0;}
    const firstUnanswered = questions.findIndex(q => !isQuestionAnswered(q, answersMap));
    return firstUnanswered === -1 ? questions.length - 1 : firstUnanswered;
};

const SurveyingPage: React.FC = () => {
    const { surveyId: surveyIdParam } = useParams<{ surveyId: string }>();
    const surveyId = surveyIdParam ?? '';
    const navigate = useNavigate();
    const location = useLocation();
    const locationState =
        (location.state as { survey?: Survey; continueFromProfile?: boolean } | undefined) ??
        {};

    const [surveyDetails, setSurveyDetails] = useState<Survey | null>(
        locationState.survey ?? null,
    );
    const [session, setSession] = useState<FullSurveySession | null>(null);
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
    const [isSurveyInactive, setIsSurveyInactive] = useState(false);
    const isNewlyCreatedRef = useRef(false);
    const isInitializingRef = useRef(false);
    const createNewSessionRef = useRef(false);

    const currentQuestion = useMemo(
        () => questions[currentQuestionIndex],
        [questions, currentQuestionIndex],
    );
    const totalQuestions = questions.length;
    const progress = totalQuestions
        ? ((currentQuestionIndex + 1) / totalQuestions) * 100
        : 0;

    const loadSurveyDetails = useCallback(async () => {
        if (surveyDetails || !surveyId) {return;}
        try {
            const data = await fetchSurveys({ offset: 0, limit: 50 });
            const match = data.items.find(item => item.id === surveyId);
            if (match) {setSurveyDetails(match);}
        } catch {
            // необязательно
        }
    }, [surveyDetails, surveyId]);

    useEffect(() => {
        loadSurveyDetails();
    }, [loadSurveyDetails]);

    const findRemoteActiveSession = useCallback(async (): Promise<FullSurveySession | null> => {
        const sessions = await surveySessionsApi.list({ offset: 0, limit: 50 });
        const match = sessions.items.find(
            item => item.surveyId === surveyId && item.status === 'IN_PROGRESS',
        );
        if (!match) {return null;}
        return surveySessionsApi.get(match.id);
    }, [surveyId]);

    const createNewSession = useCallback(async () => {
        if (createNewSessionRef.current) {return;}
        createNewSessionRef.current = true;
        try {
            const newSession = await surveySessionsApi.create(surveyId);
            surveySessionStorage.saveSessionId(surveyId, newSession.id);
            setSession(newSession);
        } finally {
            setTimeout(() => {
                createNewSessionRef.current = false;
            }, 1000);
        }
    }, [surveyId]);

    const initializeSession = useCallback(async () => {
        if (!surveyId) {return;}
        if (isInitializingRef.current) {return;}

        isInitializingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const savedSessionId = surveySessionStorage.getSessionId(surveyId);
            if (savedSessionId) {
                const existing = await surveySessionsApi.get(savedSessionId);
                if (existing.status === 'COMPLETED' || existing.status === 'CLOSED') {
                    surveySessionStorage.clearSessionId(surveyId);
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
                surveySessionStorage.saveSessionId(surveyId, remote.id);
                isNewlyCreatedRef.current = false;
                setSession(remote);
                setLoading(false);
                isInitializingRef.current = false;
                return;
            }

            isNewlyCreatedRef.current = true;
            await createNewSession();
        } catch (err) {
            if (isSurveyConflictError(err)) {
                const remote = await findRemoteActiveSession();
                if (remote) {
                    surveySessionStorage.saveSessionId(surveyId, remote.id);
                    isNewlyCreatedRef.current = false;
                    setSession(remote);
                    setLoading(false);
                    isInitializingRef.current = false;
                    return;
                }
            }
            if (isInactiveSurveyError(err)) {
                setIsSurveyInactive(true);
                surveySessionStorage.clearSessionId(surveyId);
                setError(null);
                return;
            }
            setError(extractSurveyApiErrorMessage(err, 'Не удалось загрузить сессию'));
        } finally {
            setLoading(false);
            isInitializingRef.current = false;
        }
    }, [createNewSession, findRemoteActiveSession, surveyId]);

    useEffect(() => {
        isInitializingRef.current = false;
        initializeSession();
        return () => {
            isInitializingRef.current = false;
        };
    }, [initializeSession]);

    useEffect(() => {
        if (!session) {return;}
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
        if (!currentQuestion) {return;}
        if (currentQuestion.content.type !== 'Choice') {return;}
        setAnswersMap(prev => ({
            ...prev,
            [currentQuestion.id]: {
                selectedIndex: optionIndex,
                selectedIndices: [],
                textAnswer: null,
            },
        }));
    };

    const handleToggleMulti = (optionIndex: number) => {
        if (!currentQuestion) {return;}
        if (currentQuestion.content.type !== 'Choice') {return;}
        setAnswersMap(prev => {
            const cell = prev[currentQuestion.id] ?? emptyCell();
            const has = cell.selectedIndices.includes(optionIndex);
            const nextIndices = has
                ? cell.selectedIndices.filter(i => i !== optionIndex)
                : [...cell.selectedIndices, optionIndex].sort((a, b) => a - b);
            return {
                ...prev,
                [currentQuestion.id]: {
                    selectedIndex: null,
                    selectedIndices: nextIndices,
                    textAnswer: null,
                },
            };
        });
    };

    const handleTextAnswer = (text: string) => {
        if (!currentQuestion) {return;}
        if (currentQuestion.content.type !== 'Input') {return;}
        setAnswersMap(prev => ({
            ...prev,
            [currentQuestion.id]: {
                selectedIndex: null,
                selectedIndices: [],
                textAnswer: text,
            },
        }));
    };

    const persistAnswers = useCallback(async () => {
        if (!session) {return;}
        const payload = buildAnswersPayload(questions, answersMap);
        await surveySessionsApi.updateAnswers(session.id, payload);
    }, [answersMap, questions, session]);

    const completeSurvey = async () => {
        if (!session) {return;}
        setIsCompleting(true);
        try {
            await persistAnswers();
            const completedSession = await surveySessionsApi.complete(session.id);
            surveySessionStorage.clearSessionId(surveyId);
            navigate(`/survey/${surveyId}/done`, {
                state: { session: completedSession, survey: surveyDetails },
                replace: true,
            });
        } catch (err) {
            notifications.show({
                title: 'Не удалось завершить опрос',
                message: extractSurveyApiErrorMessage(err, 'Попробуйте ещё раз'),
                color: 'red',
            });
        } finally {
            setIsCompleting(false);
        }
    };

    const handleNextQuestion = async () => {
        if (!session || !currentQuestion) {return;}
        if (!isQuestionAnswered(currentQuestion, answersMap)) {
            notifications.show({
                title: 'Ответ не выбран',
                message: 'Пожалуйста, отметьте хотя бы один вариант перед продолжением.',
                color: 'yellow',
            });
            return;
        }

        const isLast = currentQuestionIndex === totalQuestions - 1;
        if (isLast) {
            await completeSurvey();
            return;
        }

        setIsSaving(true);
        try {
            await persistAnswers();
            setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions - 1));
        } catch (err) {
            notifications.show({
                title: 'Не удалось сохранить ответ',
                message: extractSurveyApiErrorMessage(err, 'Попробуйте ещё раз'),
                color: 'red',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex === 0) {return;}
        setCurrentQuestionIndex(prev => Math.max(prev - 1, 0));
    };

    const handleRestartConfirm = async () => {
        if (!session || isRestarting) {return;}
        setIsRestarting(true);
        try {
            await surveySessionsApi.close(session.id);
            surveySessionStorage.clearSessionId(surveyId);
            isInitializingRef.current = false;
            isNewlyCreatedRef.current = true;
            await createNewSession();
            setIsRestartModalOpen(false);
            setShowContinueModal(false);
        } catch (err) {
            notifications.show({
                title: 'Не удалось перезапустить опрос',
                message: extractSurveyApiErrorMessage(err, 'Попробуйте ещё раз'),
                color: 'red',
            });
        } finally {
            setIsRestarting(false);
        }
    };

    const disabledControls = isSaving || isCompleting || loading;

    if (isSurveyInactive) {
        return (
            <Container size="sm" py="xl">
                <Alert color="yellow" mb="lg" title="Опрос недоступен">
                    Этот опрос сейчас не опубликован, пройти его нельзя.
                </Alert>
                <Button variant="light" onClick={() => navigate('/surveys')}>
                    К списку опросов
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Center style={{ minHeight: '60vh' }}>
                <Loader />
            </Center>
        );
    }

    if (error) {
        return (
            <Container size="sm" py="xl">
                <Alert color="red" mb="lg" title="Ошибка">
                    {error}
                </Alert>
                <Button variant="light" onClick={initializeSession}>
                    Попробовать снова
                </Button>
            </Container>
        );
    }

    if (!session || !totalQuestions) {
        return (
            <Container size="sm" py="xl">
                <Text>Вопросы для этого опроса отсутствуют.</Text>
            </Container>
        );
    }

    const questionContent = currentQuestion?.content ?? null;
    const currentCell: AnswerCell =
        (currentQuestion && answersMap[currentQuestion.id]) || emptyCell();
    const selectedIndex = currentCell.selectedIndex;
    const selectedIndices = currentCell.selectedIndices;
    const textAnswer = currentCell.textAnswer ?? '';

    return (
        <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
            <Modal
                opened={showContinueModal}
                onClose={() => setShowContinueModal(false)}
                title="Продолжить опрос?"
                centered
            >
                <Stack>
                    <Text>
                        Мы нашли незавершённую попытку. Хотите продолжить с вопроса{' '}
                        {currentQuestionIndex + 1}?
                    </Text>
                    <Group justify="center">
                        <Button onClick={() => setShowContinueModal(false)}>Продолжить</Button>
                        <Button variant="outline" onClick={() => setIsRestartModalOpen(true)}>
                            Начать заново
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Modal
                opened={isRestartModalOpen}
                onClose={() => setIsRestartModalOpen(false)}
                title="Начать опрос заново?"
                centered
            >
                <Stack>
                    <Text>Текущий прогресс будет потерян. Продолжить?</Text>
                    <Group justify="center">
                        <Button
                            onClick={handleRestartConfirm}
                            color="red"
                            loading={isRestarting}
                        >
                            Начать заново
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsRestartModalOpen(false)}
                            disabled={isRestarting}
                        >
                            Отмена
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <div style={{ textAlign: 'center', color: 'white', marginBottom: '40px' }}>
                <Title order={1}>{surveyDetails?.name ?? 'Опрос'}</Title>
                <Text size="lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {surveyDetails?.description ?? 'Пройдите опрос и поделитесь своим мнением'}
                </Text>
            </div>

            <Card
                shadow="md"
                p="xl"
                style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px' }}
            >
                <Stack gap="md" mb="xl">
                    <Group justify="space-between">
                        <Text fw={500}>
                            Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                        </Text>
                        <Text fw={500} c="dimmed">
                            {Math.round(progress)}%
                        </Text>
                    </Group>
                    <Progress value={progress} size="lg" radius="md" color="teal" />
                </Stack>

                <Stack gap="lg" mb="xl">
                    <div>
                        <Badge size="lg" mb="md" color="teal">
                            Вопрос {currentQuestionIndex + 1}
                        </Badge>
                        <Title
                            order={2}
                            size="h3"
                            style={{ marginBottom: '30px', color: '#2c3e50' }}
                        >
                            {currentQuestion?.content.text}
                        </Title>
                    </div>

                    {questionContent?.type === 'Choice' && questionContent.mod === 'SCALE' ? (
                        <div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}>
                                {questionContent.options.map(option => {
                                    const selected = selectedIndex === option.index;
                                    return (
                                        <button
                                            key={option.index}
                                            type="button"
                                            disabled={disabledControls}
                                            onClick={() => handleSelectAnswer(option.index)}
                                            title={option.text}
                                            style={{
                                                flex: 1,
                                                minWidth: '48px',
                                                padding: '14px 8px',
                                                borderRadius: '8px',
                                                border: selected ? '2px solid #43cea2' : '2px solid #e0e0e0',
                                                background: selected
                                                    ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
                                                    : 'white',
                                                color: selected ? 'white' : '#333',
                                                cursor: disabledControls ? 'not-allowed' : 'pointer',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {option.index + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            {questionContent.options.length > 0 && (
                                <Group justify="space-between" mt="sm">
                                    <Text size="sm" c="dimmed">
                                        {questionContent.options[0]?.text}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {questionContent.options[questionContent.options.length - 1]?.text}
                                    </Text>
                                </Group>
                            )}
                        </div>
                    ) : questionContent?.type === 'Choice' && questionContent.mod === 'MULTIPLE' ? (
                        <Stack gap="md">
                            {questionContent.options.map(option => {
                                const selected = selectedIndices.includes(option.index);
                                return (
                                    <Card
                                        key={option.index}
                                        p="md"
                                        radius="md"
                                        style={{
                                            border: selected ? '2px solid #43cea2' : '2px solid #e0e0e0',
                                            background: selected
                                                ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
                                                : 'white',
                                            cursor: disabledControls ? 'not-allowed' : 'pointer',
                                            opacity: disabledControls ? 0.7 : 1,
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() =>
                                            !disabledControls && handleToggleMulti(option.index)
                                        }
                                        withBorder
                                    >
                                        <Group>
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '4px',
                                                    border: `2px solid ${selected ? 'white' : '#ccc'}`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: selected ? 'white' : 'transparent',
                                                }}
                                            >
                                                {selected && (
                                                    <div style={{
                                                        fontSize: '14px',
                                                        color: '#185a9d',
                                                        fontWeight: 700,
                                                        lineHeight: 1,
                                                    }}>
                                                        ✓
                                                    </div>
                                                )}
                                            </div>
                                            <Text
                                                fw={500}
                                                style={{ color: selected ? 'white' : '#333' }}
                                            >
                                                {option.text}
                                            </Text>
                                        </Group>
                                    </Card>
                                );
                            })}
                        </Stack>
                    ) : questionContent?.type === 'Choice' ? (
                        <Stack gap="md">
                            {questionContent.options.map(option => {
                                const selected = selectedIndex === option.index;
                                return (
                                    <Card
                                        key={option.index}
                                        p="md"
                                        radius="md"
                                        style={{
                                            border: selected
                                                ? '2px solid #43cea2'
                                                : '2px solid #e0e0e0',
                                            background: selected
                                                ? 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)'
                                                : 'white',
                                            cursor: disabledControls ? 'not-allowed' : 'pointer',
                                            opacity: disabledControls ? 0.7 : 1,
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() =>
                                            !disabledControls && handleSelectAnswer(option.index)
                                        }
                                        withBorder
                                    >
                                        <Group>
                                            <div
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    border: `2px solid ${
                                                        selected ? 'white' : '#ccc'
                                                    }`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: selected
                                                        ? 'white'
                                                        : 'transparent',
                                                }}
                                            >
                                                {selected && (
                                                    <div
                                                        style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            backgroundColor: '#185a9d',
                                                            borderRadius: '50%',
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <Text
                                                fw={500}
                                                style={{ color: selected ? 'white' : '#333' }}
                                            >
                                                {option.text}
                                            </Text>
                                        </Group>
                                    </Card>
                                );
                            })}
                        </Stack>
                    ) : questionContent?.type === 'Input' ? (
                        <Textarea
                            placeholder="Введите ваш ответ"
                            minRows={3}
                            autosize
                            value={textAnswer}
                            onChange={e => handleTextAnswer(e.currentTarget.value)}
                            disabled={disabledControls}
                        />
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
                        gradient={{ from: 'teal', to: 'cyan' }}
                        variant="gradient"
                        onClick={handleNextQuestion}
                        disabled={disabledControls}
                        loading={isSaving || isCompleting}
                    >
                        {currentQuestionIndex === totalQuestions - 1
                            ? 'Завершить →'
                            : 'Далее →'}
                    </Button>
                </Group>
            </Card>
        </Container>
    );
};

export default SurveyingPage;
