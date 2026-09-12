import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Group, Stack, Text, Title } from '@mantine/core';
import { FullSurveySession, Survey } from '@/types';

interface LocationState {
    session?: FullSurveySession;
    survey?: Survey;
}

const SurveyDonePage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = (location.state as LocationState | undefined) ?? {};

    const surveyName = state.survey?.name ?? 'Опрос';

    return (
        <Container size="sm" style={{ minHeight: '100vh', padding: '60px 0' }}>
            <Card
                shadow="lg"
                p="xl"
                radius="lg"
                style={{
                    background: 'rgba(255,255,255,0.97)',
                    textAlign: 'center',
                }}
            >
                <Stack gap="lg" align="center">
                    <div
                        style={{
                            width: 96,
                            height: 96,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 48,
                        }}
                    >
                        ✓
                    </div>

                    <Title order={2} style={{ color: '#2c3e50' }}>
                        Опрос пройден
                    </Title>

                    <Text size="lg" c="dimmed">
                        Спасибо, что уделили время! Ваши ответы записаны.
                    </Text>

                    <Text size="sm" c="dimmed">
                        «{surveyName}»
                    </Text>

                    <Group justify="center" mt="md">
                        <Button variant="light" onClick={() => navigate('/surveys')}>
                            К списку опросов
                        </Button>
                        <Button onClick={() => navigate('/home')}>На главную</Button>
                    </Group>
                </Stack>
            </Card>
        </Container>
    );
};

export default SurveyDonePage;
