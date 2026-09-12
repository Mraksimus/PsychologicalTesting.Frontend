import React, { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    Container,
    Grid,
    Group,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
} from '@mantine/core';
import { Category, Survey } from '@/types';
import { fetchSurveys } from '@/api/surveys';
import { fetchCategories } from '@/api/categories';
import SurveyCard from '@/components/SurveyCard';
import TestCardSkeleton from '@/components/TestCardSkeleton';

const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'new', label: 'Сначала новые' },
    { value: 'time', label: 'По времени' },
];

const SurveyPage: React.FC = () => {
    const navigate = useNavigate();
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);
    const [filtered, setFiltered] = useState<Survey[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState('popular');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [data, cats] = await Promise.all([
                    fetchSurveys({ offset: 0, limit: 50 }),
                    fetchCategories(),
                ]);
                if (!active) return;
                setSurveys(data.items);
                setFiltered(data.items);
                setCategoriesList(cats);
            } catch (err) {
                if (!active) return;
                setError(err instanceof Error ? err.message : 'Не удалось загрузить опросы');
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const categorySelectData = [
        { value: 'all', label: 'Все категории' },
        ...categoriesList.map(c => ({ value: c.id, label: c.name })),
    ];

    useEffect(() => {
        let result = [...surveys];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                s =>
                    s.name.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q),
            );
        }
        if (selectedCategory !== 'all') {
            result = result.filter(s => s.categoryId === selectedCategory);
        }
        switch (sortBy) {
            case 'popular':
                result.sort((a, b) => (a.position || 0) - (b.position || 0));
                break;
            case 'new':
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
                break;
            case 'time':
                result.sort(
                    (a, b) =>
                        Number(a.durationMins || 0) - Number(b.durationMins || 0),
                );
                break;
        }
        setFiltered(result);
    }, [surveys, searchQuery, selectedCategory, sortBy]);

    const handleStartSurvey = (survey: Survey) => {
        navigate(`/survey/${survey.id}`, { state: { survey } });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('popular');
    };

    return (
        <Container size="xl" style={{ minHeight: '100vh', padding: '40px 0', position: 'relative' }}>
            <Stack gap="lg" mb="xl">
                <Title order={1} ta="center" style={{ color: 'white' }}>
                    Все опросы
                </Title>
                <Text ta="center" size="lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
                    Выберите опрос и поделитесь своим мнением — это помогает улучшать сервис
                </Text>
            </Stack>

            <Card shadow="md" p="lg" mb="xl" style={{ background: 'rgba(255,255,255,0.95)' }}>
                <Grid gutter="md">
                    <Grid.Col span={{ xs: 12, md: 4 }}>
                        <TextInput
                            placeholder="Поиск опросов..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            leftSection={<IconSearch size={16} />}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ xs: 6, md: 3 }}>
                        <Select
                            placeholder="Категория"
                            value={selectedCategory}
                            onChange={value => setSelectedCategory(value || 'all')}
                            data={categorySelectData}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ xs: 6, md: 3 }}>
                        <Select
                            placeholder="Сортировка"
                            value={sortBy}
                            onChange={value => setSortBy(value || 'popular')}
                            data={sortOptions}
                        />
                    </Grid.Col>
                    <Grid.Col span={{ xs: 12, md: 2 }}>
                        <Button fullWidth variant="light" onClick={resetFilters}>
                            Сбросить
                        </Button>
                    </Grid.Col>
                </Grid>
            </Card>

            {error && (
                <Alert color="red" mb="xl" withCloseButton onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Group justify="space-between" mb="md">
                <Text size="lg" style={{ color: 'white' }}>
                    {loading ? 'Загрузка опросов...' : `Найдено опросов: ${filtered.length}`}
                </Text>
            </Group>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px',
                    justifyContent: 'center',
                }}
            >
                {loading
                    ? Array.from({ length: 6 }).map((_, i) => <TestCardSkeleton key={i} />)
                    : filtered.map(survey => (
                          <SurveyCard
                              key={survey.id}
                              survey={survey}
                              onStartSurvey={handleStartSurvey}
                          />
                      ))}
            </div>

            {!loading && filtered.length === 0 && (
                <Box ta="center" py="xl">
                    <Text size="xl" style={{ color: 'white' }} mb="md">
                        Опросы не найдены
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)' }} mb="lg">
                        Попробуйте изменить параметры поиска или сбросить фильтры
                    </Text>
                    <Button variant="light" onClick={resetFilters}>
                        Сбросить фильтры
                    </Button>
                </Box>
            )}
        </Container>
    );
};

export default SurveyPage;
