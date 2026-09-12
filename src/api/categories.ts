import { Category } from '@/types';
import { httpClient } from '@/shared/http/httpClient';

export const fetchCategories = async (): Promise<Category[]> => {
    const { data } = await httpClient.get<Category[]>('/categories');
    return data;
};
