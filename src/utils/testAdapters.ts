import { Test } from '@/types';

const DEFAULT_CATEGORIES = ['Психология', 'Развитие', 'Профессия', 'Коммуникации'];

const deriveCategory = (test: Test, index: number): string => {
    if (test.category) {
        return test.category;
    }

    const derivedIndex = test.position ?? index;
    return DEFAULT_CATEGORIES[derivedIndex % DEFAULT_CATEGORIES.length];
};

const deriveQuestionsCount = (test: Test): number | undefined => {
    if (typeof test.questionsCount === 'number') {
        return test.questionsCount;
    }

    // Пока на бэкенде нет явного количества вопросов, возвращаем undefined,
    // чтобы UI показал плейсхолдер.
    return undefined;
};

export const enrichTest = (test: Test, index = 0): Test => ({
    ...test,
    category: deriveCategory(test, index),
    questionsCount: deriveQuestionsCount(test),
});

export const enrichTests = (tests: Test[]): Test[] => tests.map((test, index) => enrichTest(test, index));

