import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * 🏛️ Instance de communication avec le Registre central
 * Configure le point d'accès certifié vers les services de l'Établissement.
 */
const api = axios.create({
    baseURL: 'http://localhost:5001/api',
});

/**
 * 🏛️ Intercepteur de sécurité
 * Incorpore systématiquement le jeton d'authentification (Token) au sein de chaque
 * requête pour certifier l'identité du membre auprès de l'infrastructure.
 */
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;