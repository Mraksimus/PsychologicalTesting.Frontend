import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.css';

export function Welcome() {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100} style={{ color: 'white' }}>
        Добро пожаловать на сервис психологического тестирования
      </Title>
      <Text ta="center" size="lg" maw={580} mx="auto" mt="xl" style={{ color: 'white' }}>
        Пройдите психологические тесты и получите персонализированные рекомендации от нашего AI-помощника
      </Text>
    </>
  );
}