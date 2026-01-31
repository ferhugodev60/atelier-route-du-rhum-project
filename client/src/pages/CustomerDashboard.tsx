import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Import des sous-composants
import Sidebar, { LogoutIcon } from "../components/dashboard/Sidebar.tsx";
import OrderHistory from "../components/dashboard/OrderHistory.tsx";
import SecuritySettings from "../components/dashboard/SecuritySettings.tsx";
import ProfileInfo from "../components/dashboard/ProfileInfo.tsx";

/**
 * CustomerDashboard - Vue principale de l'espace membre.
 * Gère la navigation interne entre les commandes, la sécurité et le profil.
 */
export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [activeView, setActiveView] = useState<'orders' | 'security' | 'profile'>('orders');

    // Sécurité : Redirection si l'utilisateur accède à la page sans être authentifié
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    /**
     * Gère la déconnexion propre de l'utilisateur.
     * Vide le Store Zustand et redirige vers l'accueil.
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Empêcher le rendu si l'utilisateur n'est pas encore chargé
    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a1a14] pt-32 pb-20 px-4 md:px-12 flex flex-col selection:bg-rhum-gold/30">
            <div className="max-w-7xl mx-auto w-full flex-1">

                {/* --- EN-TÊTE --- */}
                <header className="mb-10 lg:mb-16 border-l-2 lg:border-l-4 border-rhum-gold pl-6 lg:pl-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl lg:text-6xl font-serif text-white uppercase tracking-tight">
                            Votre Espace
                        </h1>
                        <p className="text-rhum-gold/40 text-[9px] lg:text-xs uppercase tracking-[0.5em] font-bold mt-6">
                            Bienvenue dans l'Antre, <span className="text-rhum-gold">{user.firstName}</span>
                        </p>
                    </motion.div>
                </header>

                {/* --- CONTENU PRINCIPAL --- */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

                    {/* Navigation latérale (Desktop) / Tabs (Mobile) */}
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        onLogout={handleLogout}
                    />

                    {/* Zone d'affichage dynamique */}
                    <main className="flex-1 w-full bg-white/[0.02] border border-white/5 p-6 md:p-16 rounded-sm relative min-h-[600px] overflow-hidden">

                        {/* Liseré décoratif supérieur (Effet Alambic) */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rhum-gold/30 to-transparent" />

                        {/* Motif de fond subtil */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/assets/textures/paper-grain.png')] bg-repeat" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="relative z-10"
                            >
                                {activeView === 'orders' && <OrderHistory />}
                                {activeView === 'security' && <SecuritySettings />}
                                {activeView === 'profile' && <ProfileInfo />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {/* --- FOOTER MOBILE : DÉCONNEXION --- */}
                <div className="lg:hidden mt-12 pt-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-red-500/40 hover:text-red-500 transition-all group bg-red-500/5 rounded-sm"
                    >
                        <LogoutIcon className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span>Fermer la session</span>
                    </button>
                </div>
            </div>
        </div>
    );
}