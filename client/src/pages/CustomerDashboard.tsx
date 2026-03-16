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

    const isPro = user.role === 'PRO';

    return (
        <div className="min-h-screen bg-[#0a1a14] flex flex-col selection:bg-rhum-gold/30 font-sans overflow-x-hidden">

            {/* --- 🏺 SECTION PASSEPORT HERO --- */}
            <div className="relative w-full pt-32 pb-16 md:pt-40 md:pb-24 px-4 md:px-12 border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Background Passport"
                        className="w-full h-full object-cover opacity-40 md:opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1a14]/60 to-[#0a1a14] z-20" />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-30">
                    <header className="border-l-4 border-rhum-gold pl-6 md:pl-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white uppercase tracking-tighter leading-none">
                                Votre Passeport
                            </h1>

                            <div className="mt-6 md:mt-10 flex flex-col gap-8">
                                <p className="text-rhum-gold text-[10px] md:text-xs uppercase tracking-[0.4em] font-black">
                                    {isPro ? (user.companyName || "ÉTABLISSEMENT") : `${user.firstName} ${user.lastName}`}
                                </p>

                                {/* 🏺 LOGIQUE DE GRILLE RÉPARÉE : Colonne sur mobile, Ligne sur Desktop */}
                                <div className="flex flex-col md:flex-row md:items-start gap-8 md:gap-12">

                                    {/* 1. CODE CLIENT (Base) */}
                                    <div className="flex flex-col gap-2 md:shrink-0">
                                        <span className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.3em] font-bold">Code client</span>
                                        <div className="inline-flex">
                                            <span className="bg-rhum-gold text-rhum-green px-4 py-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] rounded-sm shadow-2xl">
                                                {user.memberCode || "GÉNÉRATION EN COURS"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 2. ATELIER CONCEPTION (Divider md: seulement) */}
                                    {!isPro && (
                                        <div className="flex flex-col gap-2 md:border-l md:border-white/10 md:pl-10">
                                            <span className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.3em] font-bold">Atelier Conception</span>
                                            <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-none">
                                                Niveau {user.conceptionLevel}
                                            </span>
                                        </div>
                                    )}

                                    {/* 3. AFFILIATION ENTREPRISE (Divider md: seulement) */}
                                    {!isPro && user.companyName && (
                                        <div className="flex flex-col gap-2 md:border-l md:border-white/10 md:pl-10">
                                            <span className="text-[8px] md:text-[9px] text-white/80 uppercase tracking-[0.3em] font-bold">
                                                Bénéficiaire Entreprise
                                            </span>
                                            <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] leading-none truncate max-w-[250px]">
                                                {user.companyName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </header>
                </div>
            </div>

            {/* --- 🏺 CORPS DU DASHBOARD --- */}
            <div className="max-w-7xl mx-auto w-full flex-1 px-4 md:px-12 py-12 md:py-20">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        onLogout={handleLogout}
                    />

                    <main className="flex-1 w-full bg-white/[0.02] border border-white/5 p-6 md:p-16 rounded-sm relative min-h-[600px] shadow-2xl backdrop-blur-sm">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rhum-gold/30 to-transparent" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
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
                        className="w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-red-500 bg-red-500/5 border border-red-500/10 rounded-sm active:bg-red-500/10 transition-colors shadow-lg"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
}