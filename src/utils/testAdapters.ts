import { Category, Test } from '@/types';

export const enrichTest = (test: Test): Test => test;

export const enrichTests = (tests: Test[]): Test[] => tests;

const DEFAULT_CATEGORY: Pick<Category, 'name' | 'color' | 'icon'> = {
    name: 'Другое',
    color: '#d299c2',
    icon: '📊',
};

export const getCategoryLabel = (category: Category | null | undefined): string =>
    category?.name ?? DEFAULT_CATEGORY.name;

export const getCategoryColor = (category: Category | null | undefined): string =>
    category?.color ?? DEFAULT_CATEGORY.color;

export const getCategoryIcon = (category: Category | null | undefined): string =>
    category?.icon ?? DEFAULT_CATEGORY.icon;

const hexToRgba = (hex: string, alpha: number): string => {
    const clean = hex.replace('#', '');
    const value = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    const r = parseInt(value.slice(0, 2), 16) || 0;
    const g = parseInt(value.slice(2, 4), 16) || 0;
    const b = parseInt(value.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getCategoryGradient = (category: Category | null | undefined): string => {
    const color = getCategoryColor(category);
    return `linear-gradient(135deg, ${color} 0%, ${hexToRgba(color, 0.6)} 100%)`;
};
