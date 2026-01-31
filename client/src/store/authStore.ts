import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';

interface AuthState {
    user: User | null;
    token: string | null;
    // Action pour enregistrer la session
    setAuth: (user: User, token: string) => void;
    // Action pour vider la session
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'rhum-atlier-auth',
            // On peut ajouter une version pour forcer le vidage du cache si le type change
            version: 1
        }
    )
);