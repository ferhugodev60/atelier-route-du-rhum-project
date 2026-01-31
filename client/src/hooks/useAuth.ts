import { useActionState } from 'react';
import api from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

// La fonction d'action qui sera exécutée à la soumission
async function loginAction(_prevState: any, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');
    const setAuth = useAuthStore.getState().setAuth; // Accès direct au store Zustand

    try {
        // Appel réel à ton API Express
        const response = await api.post('/auth/login', { email, password });

        // On enregistre dans Zustand
        const { user, token } = response.data;
        setAuth(user, token);

        return { success: true, user };
    } catch (err: any) {
        // On récupère l'erreur précise renvoyée par ton middleware Zod ou Express
        return {
            success: false,
            error: err.response?.data?.error || "L'Antre reste scellée. Vérifiez vos accès."
        };
    }
}

export function useLogin() {
    // Initialisation de useActionState (React 19)
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return { state, formAction, isPending };
}