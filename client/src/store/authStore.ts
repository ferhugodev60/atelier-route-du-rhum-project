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
 * Gère l'identité des membres et assure la persistance du sceau numérique.
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
             * Scelle l'identité du membre et son jeton d'accès au sein du magasin.
             */
            setAuth: (user, token) => {
                // On s'assure de réinitialiser les modales lors d'un scellage réussi
                set({
                    user,
                    token,
                    isLoginOpen: false,
                    isRegisterOpen: false
                });
            },

            /**
             * 🏺 Clôture de Session
             * Réinitialise les accès et purge le stockage local du navigateur de manière stricte.
             */
            logout: () => {
                // 🏺 CORRECTION : Suppression de la clé correcte définie dans la config 'persist'
                localStorage.removeItem('rhum-member-session');

                // Réinitialisation de l'état mémoire
                set({ user: null, token: null });

                // Optionnel : Redirection vers l'accueil pour un nettoyage complet du cycle de vie React
                window.location.href = '/';
            },

            // Gestion de la visibilité des interfaces d'accès
            setLoginOpen: (open) => set({ isLoginOpen: open, isRegisterOpen: false }),
            setRegisterOpen: (open) => set({ isRegisterOpen: open, isLoginOpen: false }),

            /**
             * 🏛️ Synchronisation avec le Registre
             * Rafraîchit les attributs du membre (Rôle, SIRET, Qualification)
             * pour garantir que l'interface reflète l'état actuel en base de données.
             */
            checkAuth: async () => {
                try {
                    const response = await api.get('/users/me');
                    if (response.data) {
                        set({ user: response.data });

                        // Identification sémantique du profil
                        let profileType = 'Particulier';
                        if (response.data.role === 'PRO') {
                            profileType = 'Professionnel';
                        } else if (response.data.isEmployee) {
                            profileType = 'Bénéficiaire CE';
                        }

                        console.log(`📡 [REGISTRE] Profil ${profileType} synchronisé.`);
                    }
                } catch (error) {
                    console.error("❌ Échec de la synchronisation. Session révoquée.");
                    // En cas d'échec de synchronisation (Token expiré par ex.), on purge par sécurité.
                    set({ user: null, token: null });
                }
            },
        }),
        {
            name: 'rhum-member-session', // 🏺 Le nom unique de votre sceau local
            version: 4 // 🏺 Passage en V4 : Intégration de la qualification 'isProfileComplete'
        }
    )
);