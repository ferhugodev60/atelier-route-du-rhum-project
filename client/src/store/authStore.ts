import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
    user: User | null;
    token: string | null;
    // 🏺 États pour piloter l'affichage des modales
    isLoginOpen: boolean;
    isRegisterOpen: boolean;

    setAuth: (user: User, token: string) => void;
    logout: () => void;

    // 🏺 Actions pour ouvrir/fermer les modales
    setLoginOpen: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoginOpen: false,
            isRegisterOpen: false,

            // La connexion ferme automatiquement les modales
            setAuth: (user, token) => set({
                user,
                token,
                isLoginOpen: false,
                isRegisterOpen: false
            }),

            logout: () => set({ user: null, token: null }),

            setLoginOpen: (open) => set({
                isLoginOpen: open,
                isRegisterOpen: false
            }),

            setRegisterOpen: (open) => set({
                isRegisterOpen: open,
                isLoginOpen: false
            }),
        }),
        {
            name: 'rhum-atlier-auth',
            version: 1
        }
    )
);