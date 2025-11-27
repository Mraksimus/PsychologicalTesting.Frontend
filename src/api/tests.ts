import { getToken } from './auth';
import {PaginatedResponse, Test} from "@/types";

const API_BASE_URL = 'https://psychological-testing.mraksimus.ru';

export const fetchTests = async (offset: number = 0, limit: number = 10): Promise<PaginatedResponse<Test>> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
    });

    try {
        const response = await fetch(`${API_BASE_URL}/testing/tests?${params}`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('📨 Fetch tests response status:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Unauthorized');
            }
            throw new Error(`Failed to fetch tests: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Tests fetched:', data);

        return data;
    } catch (error) {
        console.error('❌ Error fetching tests:', error);
        throw error;
    }
};

export const fetchTestById = async (testId: number): Promise<Test> => {
    const token = getToken();

    if (!token) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch test: ${response.status}`);
    }

    return await response.json();
};
