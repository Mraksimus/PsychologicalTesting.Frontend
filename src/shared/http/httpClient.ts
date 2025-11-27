import axios from 'axios';
import { API_BASE_URL } from '@/shared/config/apiConfig';
import { readToken, hasValidToken, clearToken } from '@/shared/storage/tokenStorage';

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

httpClient.interceptors.request.use(
    config => {
        if (hasValidToken()) {
            const token = readToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    error => Promise.reject(error),
);

httpClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            clearToken();
        }
        return Promise.reject(error);
    },
);

