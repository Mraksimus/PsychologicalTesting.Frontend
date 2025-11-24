import React, { useState, useEffect } from 'react';
import { IconSearch, IconClock, IconQuestionMark } from '@tabler/icons-react';
import { Test } from '../types';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Title,
    Text,
    Grid,
    Card,
    Group,
    Badge,
    Button,
    Stack,
    TextInput,
    Select,
    LoadingOverlay,
    Box,
    Alert
} from '@mantine/core';
import Header from '../components/Header';
import { testsApi } from '../api/testsApi';

const TestsPage: React.FC = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState<Test[]>([]);
    const [filteredTests, setFilteredTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('popular');

    useEffect(() => {
        loadTests();
    }, []);

    useEffect(() => {
        filterAndSortTests();
    }, [tests, searchQuery, selectedCategory, sortBy]);

    const loadTests = async () => {
        try {
            setLoading(true);
            setError(null);
            const testsData = await testsApi.getAllTests();
            setTests(testsData);
            setFilteredTests(testsData);
        } catch (err: any) {
            console.error('Error loading tests:', err);
            setError(err.message || 'Ошибка загрузки тестов');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortTests = () => {
        let result = [...tests];

        // Фильтрация по поисковому запросу
        if (searchQuery) {
            result = result.filter(test =>
                test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                test.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Фильтрация по категории
        if (selectedCategory !== 'all') {
            result = result.filter(test => test.category === selectedCategory);
        }

        // Сортировка
        switch (sortBy) {
            case 'popular':
                result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'new':
                result.sort((a, b) => {
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return 0;
                });
                break;
            case 'time':
                result.sort((a, b) => a.time - b.time);
                break;
            case 'questions':
                result.sort((a, b) => a.questionsCount - b.questionsCount);
                break;
            default:
                result.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        }

        setFilteredTests(result);
    };

    const handleStartTest = async (testId: number) => {
        try {
            // Проверяем доступность теста
            await testsApi.getTestById(testId);
            navigate(`/test/${testId}`);
        } catch (err: any) {
            console.error('Error starting test:', err);
            setError('Ошибка при запуске теста: ' + err.message);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Психология': return 'blue';
            case 'Развитие': return 'green';
            case 'Профессия': return 'orange';
            default: return 'gray';
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (value: string | null) => {
        setSelectedCategory(value || 'all');
    };

    const handleSortChange = (value: string | null) => {
        setSortBy(value || 'popular');
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('popular');
    };

    const categories = [
        { value: 'all', label: 'Все категории' },
        { value: 'Психология', label: 'Психология' },
        { value: 'Развитие', label: 'Развитие' },
        { value: 'Профессия', label: 'Профессия' },
    ];

    const sortOptions = [
        { value: 'popular', label: 'По популярности' },
        { value: 'new', label: 'Сначала новые' },
        { value: 'time', label: 'По времени' },
        { value: 'questions', label: 'По количеству вопросов' },
    ];

    if (loading) {
        return (
            <>
                <Header />
                <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
                    <LoadingOverlay visible={loading} />
                </Container>
            </>
        );
    }

    return (
        <>
            <Header />
            <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0' }}>
                {/* Заголовок и описание */}
                <Stack gap="lg" mb="xl">
                    <Title order={1} ta="center" style={{ color: 'white' }}>
                        Все психологические тесты
                    </Title>
                    <Text ta="center" size="lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        Выберите тест, который вам интересен, и получите детальный анализ от нашего ИИ
                    </Text>
                </Stack>

                {/* Сообщение об ошибке */}
                {error && (
                    <Alert color="red" mb="xl" withCloseButton onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Фильтры и поиск */}
                <Card shadow="md" p="lg" mb="xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                    <Grid gutter="md">
                        <Grid.Col span={{ xs: 12, md: 4 }}>
                            <TextInput
                                placeholder="Поиск тестов..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                leftSection={<IconSearch size={16} />}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 6, md: 3 }}>
                            <Select
                                placeholder="Категория"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                data={categories}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 6, md: 3 }}>
                            <Select
                                placeholder="Сортировка"
                                value={sortBy}
                                onChange={handleSortChange}
                                data={sortOptions}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ xs: 12, md: 2 }}>
                            <Button
                                fullWidth
                                variant="light"
                                onClick={resetFilters}
                            >
                                Сбросить
                            </Button>
                        </Grid.Col>
                    </Grid>
                </Card>

                {/* Результаты поиска */}
                <Group justify="space-between" mb="md">
                    <Text size="lg" style={{ color: 'white' }}>
                        Найдено тестов: {filteredTests.length}
                    </Text>
                    <Button
                        variant="light"
                        onClick={loadTests}
                        loading={loading}
                    >
                        Обновить
                    </Button>
                </Group>

                {/* Сетка тестов */}
                <Grid>
                    {filteredTests.map((test) => (
                        <Grid.Col key={test.id} span={{ xs: 12, sm: 6, lg: 4 }}>
                            <Card
                                shadow="sm"
                                p="lg"
                                radius="md"
                                withBorder
                                style={{
                                    height: '100%',
                                    background: 'rgba(255,255,255,0.95)',
                                    transition: 'transform 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Stack gap="sm" style={{ height: '100%', flex: 1 }}>
                                    {/* Заголовок и бейджи */}
                                    <Group justify="space-between" align="flex-start" style={{ flexShrink: 0 }}>
                                        <Text size="lg" fw={600} style={{ flex: 1 }}>
                                            {test.title}
                                        </Text>
                                        {test.isNew && (
                                            <Badge color="red" variant="filled">
                                                Новый
                                            </Badge>
                                        )}
                                    </Group>

                                    {/* Категория и популярность */}
                                    <Group gap="xs" style={{ flexShrink: 0 }}>
                                        <Badge color={getCategoryColor(test.category)} variant="light">
                                            {test.category}
                                        </Badge>
                                        {test.popularity && (
                                            <Badge color="gray" variant="outline">
                                                {test.popularity}%
                                            </Badge>
                                        )}
                                    </Group>

                                    {/* Описание */}
                                    <Text size="sm" c="dimmed" style={{ flex: 1, minHeight: '60px' }}>
                                        {test.description}
                                    </Text>

                                    {/* Статистика */}
                                    <Group gap="lg" style={{ flexShrink: 0 }}>
                                        <Group gap="xs">
                                            <IconQuestionMark size={16} />
                                            <Text size="sm">{test.questionsCount} вопросов</Text>
                                        </Group>
                                        <Group gap="xs">
                                            <IconClock size={16} />
                                            <Text size="sm">{test.time} мин</Text>
                                        </Group>
                                    </Group>

                                                                        {/* Кнопка начала */}
                                    <Button
                                        fullWidth
                                        variant="gradient"
                                        gradient={{ from: 'blue', to: 'cyan' }}
                                        onClick={() => handleStartTest(test.id)}
                                        style={{ flexShrink: 0 }}
                                        loading={loading}
                                    >
                                        Начать тест
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>

                {/* Сообщение если ничего не найдено */}
                {filteredTests.length === 0 && (
                    <Box ta="center" py="xl">
                        <Text size="xl" style={{ color: 'white' }} mb="md">
                            Тесты не найдены
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.7)' }} mb="lg">
                            Попробуйте изменить параметры поиска или сбросить фильтры
                        </Text>
                        <Button
                            variant="light"
                            onClick={resetFilters}
                        >
                            Сбросить фильтры
                        </Button>
                    </Box>
                )}
            </Container>
        </>
    );
};

export default TestsPage;