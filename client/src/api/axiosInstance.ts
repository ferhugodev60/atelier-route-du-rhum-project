import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

api.interceptors.request.use((config) => {
    console.log(`📡 [AXIOS] Requête sortante : ${config.method?.toUpperCase()} ${config.url}`);
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log(`📡 [AXIOS] Réponse reçue de ${response.config.url} :`, response.status);
        return response;
    },
    (error) => {
        console.error(`❌ [AXIOS ERROR] Sur ${error.config?.url} :`, {
            status: error.response?.status,
            data: error.response?.data
        });
        if (error.response?.status === 401) useAuthStore.getState().logout?.();
        return Promise.reject(error);
    }
);

export default api;