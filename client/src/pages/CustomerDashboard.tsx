import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Import des sous-composants
import Sidebar, { LogoutIcon } from "../components/dashboard/Sidebar.tsx";
import OrderHistory from "../components/dashboard/OrderHistory.tsx";
import SecuritySettings from "../components/dashboard/SecuritySettings.tsx";
import ProfileInfo from "../components/dashboard/ProfileInfo.tsx";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [activeView, setActiveView] = useState<'orders' | 'security' | 'profile'>('orders');

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a1a14] pt-32 pb-20 px-4 md:px-12 flex flex-col selection:bg-rhum-gold/30 font-sans">
            <div className="max-w-7xl mx-auto w-full flex-1">

                <header className="mb-10 lg:mb-16 border-l-4 border-rhum-gold pl-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl lg:text-6xl font-serif text-white uppercase tracking-tight">
                            Votre Espace
                        </h1>
                        <div className="mt-6 flex flex-col gap-2">
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.5em] font-black italic">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-white text-xs uppercase tracking-[0.3em] font-bold flex items-center gap-3">
                                <span className="text-rhum-gold">Membre de Niveau {user.conceptionLevel}</span>
                            </p>
                        </div>
                    </motion.div>
                </header>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        onLogout={handleLogout}
                    />

                    <main className="flex-1 w-full bg-white/[0.02] border border-white/5 p-6 md:p-16 rounded-sm relative min-h-[600px]">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rhum-gold/30 to-transparent" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="relative z-10"
                            >
                                {activeView === 'orders' && <OrderHistory />}
                                {activeView === 'security' && <SecuritySettings />}
                                {activeView === 'profile' && <ProfileInfo />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                <div className="lg:hidden mt-12 pt-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-red-500/40 hover:text-red-500 bg-red-500/5 rounded-sm"
                    >
                        <LogoutIcon className="w-5 h-5 opacity-40" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
}