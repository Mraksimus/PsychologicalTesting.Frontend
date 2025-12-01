import { Test, TestCategory } from '@/types';

// Категории теперь приходят с бэкенда, адаптер просто возвращает тест как есть
export const enrichTest = (test: Test): Test => test;

export const enrichTests = (tests: Test[]): Test[] => tests.map(enrichTest);

// Маппинг категорий для отображения в UI
export const getCategoryLabel = (category: TestCategory): string => {
    const labels: Record<TestCategory, string> = {
        PERSONALITY: 'Личность',
        EMOTIONS: 'Эмоции',
        INTELLECT: 'Интеллект',
        CAREER: 'Карьера',
        RELATIONSHIPS: 'Отношения',
        DEVELOPMENT: 'Развитие',
        OTHER: 'Другое',
    };
    return labels[category];
};

// Маппинг категорий на цвета для Badge
export const getCategoryColor = (category: TestCategory): string => {
    const colors: Record<TestCategory, string> = {
        PERSONALITY: 'blue',
        EMOTIONS: 'pink',
        INTELLECT: 'violet',
        CAREER: 'orange',
        RELATIONSHIPS: 'green',
        DEVELOPMENT: 'cyan',
        OTHER: 'gray',
    };
    return colors[category];
};

// Маппинг категорий на градиенты
export const getCategoryGradient = (category: TestCategory): string => {
    const gradients: Record<TestCategory, string> = {
        PERSONALITY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        EMOTIONS: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        INTELLECT: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        CAREER: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        RELATIONSHIPS: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        DEVELOPMENT: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        OTHER: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    };
    return gradients[category];
};

// Маппинг категорий на иконки
export const getCategoryIcon = (category: TestCategory): string => {
    const icons: Record<TestCategory, string> = {
        PERSONALITY: '🧠',
        EMOTIONS: '❤️',
        INTELLECT: '💡',
        CAREER: '💼',
        RELATIONSHIPS: '💑',
        DEVELOPMENT: '📈',
        OTHER: '📊',
    };
    return icons[category];
};

