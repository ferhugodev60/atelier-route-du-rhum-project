import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * 🏛️ Instance de communication avec le Registre central
 * Configure le point d'accès certifié vers les services de l'Établissement.
 * Utilise la variable d'environnement pour une flexibilité totale entre le local et la production.
 */
const api = axios.create({
    // Utilisation de la variable d'environnement avec fallback sur le port local scellé
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

/**
 * 🏛️ Intercepteur de sécurité (Requêtes)
 * Incorpore systématiquement le jeton d'authentification (Token) au sein de chaque
 * requête pour certifier l'identité du membre auprès de l'infrastructure.
 */
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 🏛️ Intercepteur de réponse
 * Gère les ruptures de protocole (erreurs 401) pour assurer l'intégrité de la session.
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Si le jeton est expiré ou invalide, on peut déclencher une déconnexion automatique
        if (error.response?.status === 401) {
            useAuthStore.getState().logout?.();
        }
        return Promise.reject(error);
    }
);

export default api;