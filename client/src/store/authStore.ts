import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import api from '../api/axiosInstance.ts'; // 🏺 Import indispensable pour l'appel API

interface AuthState {
    user: User | null;
    token: string | null;
    isLoginOpen: boolean;
    isRegisterOpen: boolean;

    // Actions existantes
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoginOpen: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;

    // 🏺 Nouvelle action : Synchronisation de l'alchimiste
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoginOpen: false,
            isRegisterOpen: false,

            setAuth: (user, token) => set({
                user,
                token,
                isLoginOpen: false,
                isRegisterOpen: false
            }),

            logout: () => {
                localStorage.removeItem('rhum-atlier-auth');
                set({ user: null, token: null });
            },

            setLoginOpen: (open) => set({
                isLoginOpen: open,
                isRegisterOpen: false
            }),

            setRegisterOpen: (open) => set({
                isRegisterOpen: open,
                isLoginOpen: false
            }),

            /**
             * 🏺 SYNCHRONISATION
             * Récupère les données fraîches de l'utilisateur (niveau, profil, etc.)
             */
            checkAuth: async () => {
                try {
                    // On utilise le préfixe défini dans votre index.ts : /api/users/me
                    const response = await api.get('/users/me');
                    if (response.data) {
                        set({
                            user: response.data,
                            isAuthenticated: true // Si vous avez ce flag, sinon retirez
                        } as any);
                        console.log("🏺 Profil de l'alchimiste synchronisé.");
                    }
                } catch (error) {
                    console.error("❌ Échec de la synchronisation de l'identité.");
                    // En cas d'erreur 401, on déconnecte proprement
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: 'rhum-atlier-auth',
            version: 1
        }
    )
);