import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

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

                {/* --- EN-TÊTE INSTITUTIONNEL --- */}
                <header className="mb-12 lg:mb-20 border-l-4 border-rhum-gold pl-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-5xl lg:text-7xl font-serif text-white uppercase tracking-tighter leading-none">
                            Votre Passeport
                        </h1>

                        <div className="mt-8 flex flex-col gap-6">
                            <p className="text-rhum-gold text-xs uppercase tracking-[0.4em] font-black">
                                {user.firstName} {user.lastName}
                            </p>

                            <div className="flex flex-wrap items-center gap-8">
                                {/* 🏺 AFFICHAGE DU CODE UNIQUE */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold">Identifiant Membre</span>
                                    <span className="bg-rhum-gold text-rhum-green px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] rounded-sm shadow-xl">
                                        {user.memberCode || "GÉNÉRATION EN COURS"}
                                    </span>
                                </div>

                                {/* 🏺 VALIDATION DU CURSUS */}
                                <div className="flex flex-col gap-2 border-l border-white/10 pl-8">
                                    <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] font-bold">Palier technique</span>
                                    <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                                        Niveau {user.conceptionLevel} certifié
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        onLogout={handleLogout}
                    />

                    <main className="flex-1 w-full bg-white/[0.03] border border-white/10 p-8 md:p-16 rounded-sm relative min-h-[650px] shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="relative z-10"
                            >
                                {activeView === 'orders' && <OrderHistory />}
                                {activeView === 'security' && <SecuritySettings />}
                                {activeView === 'profile' && <ProfileInfo />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                <div className="lg:hidden mt-16 pt-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-red-500 bg-red-500/5 border border-red-500/10 rounded-sm hover:bg-red-500/10 transition-colors"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span>Déconnexion de la session</span>
                    </button>
                </div>
            </div>
        </div>
    );
}