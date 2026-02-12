import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import api from '../api/axiosInstance.ts';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoginOpen: boolean;
    isRegisterOpen: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    setLoginOpen: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;
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

            setLoginOpen: (open) => set({ isLoginOpen: open, isRegisterOpen: false }),
            setRegisterOpen: (open) => set({ isRegisterOpen: open, isLoginOpen: false }),

            checkAuth: async () => {
                try {
                    const response = await api.get('/users/me');
                    if (response.data) {
                        set({ user: response.data });
                        console.log("🏺 Profil de l'alchimiste synchronisé.");
                    }
                } catch (error) {
                    console.error("❌ Échec de la synchronisation.");
                    set({ user: null, token: null });
                }
            },
        }),
        { name: 'rhum-atlier-auth', version: 1 }
    )
);