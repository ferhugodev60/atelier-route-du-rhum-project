import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import api from '../api/axiosInstance.ts';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoginOpen: boolean;
    isRegisterOpen: boolean;

    // Actions de gestion de session
    setAuth: (user: User, token: string) => void;
    logout: () => void;

    // Pilotage des accès (Modales)
    setLoginOpen: (open: boolean) => void;
    setRegisterOpen: (open: boolean) => void;

    // Synchronisation institutionnelle
    checkAuth: () => Promise<void>;
}

/**
 * 🏛️ Magasin d'Authentification Centralisé
 * Gère l'identité des membres, qu'ils soient Particuliers ou Professionnels.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoginOpen: false,
            isRegisterOpen: false,

            /**
             * 🏺 Ouverture de Session
             * Enregistre l'identité du membre et son jeton d'accès certifié.
             */
            setAuth: (user, token) => set({
                user,
                token,
                isLoginOpen: false,
                isRegisterOpen: false
            }),

            /**
             * 🏺 Clôture de Session
             * Réinitialise les accès et nettoie le stockage local du navigateur.
             */
            logout: () => {
                localStorage.removeItem('rhum-atlier-auth');
                set({ user: null, token: null });
            },

            // Gestion de la visibilité des interfaces d'accès
            setLoginOpen: (open) => set({ isLoginOpen: open, isRegisterOpen: false }),
            setRegisterOpen: (open) => set({ isRegisterOpen: open, isLoginOpen: false }),

            /**
             * 🏛️ Synchronisation avec le Registre
             * Met à jour les informations du membre en temps réel, incluant :
             * - Son rôle (USER, PRO, ADMIN)
             * - Son palier technique (conceptionLevel)
             * - Ses attributs pro (SIRET, Raison Sociale)
             */
            checkAuth: async () => {
                try {
                    const response = await api.get('/users/me');
                    if (response.data) {
                        set({ user: response.data });

                        // Nomenclature conforme aux directives de l'Établissement [cite: 2026-02-12]
                        const profileType = response.data.role === 'PRO' ? 'Professionnel' : 'Particulier';
                        console.log(`🏛️ Profil ${profileType} synchronisé avec succès.`);
                    }
                } catch (error) {
                    console.error("❌ Échec de la synchronisation avec le Registre central.");
                    // En cas d'erreur critique de session, on déconnecte par sécurité
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: 'rhum-atlier-auth',
            version: 2 // Mise à jour de version pour inclure les nouveaux attributs PRO
        }
    )
);