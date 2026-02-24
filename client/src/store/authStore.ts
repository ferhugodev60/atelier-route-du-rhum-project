import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user'; // 🏺 Important : l'interface User doit inclure 'memberCode'
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

            /**
             * 🏛️ Synchronisation avec le Registre
             * Met à jour les informations du membre, incluant son palier technique et son Code Passeport.
             */
            checkAuth: async () => {
                try {
                    const response = await api.get('/users/me');
                    if (response.data) {
                        set({ user: response.data });
                        // Nomenclature conforme aux directives de l'Établissement [cite: 2026-02-12]
                        console.log("🏛️ Profil du membre synchronisé avec l'Établissement.");
                    }
                } catch (error) {
                    console.error("❌ Échec de la synchronisation avec le Registre central.");
                    set({ user: null, token: null });
                }
            },
        }),
        { name: 'rhum-atlier-auth', version: 1 }
    )
);