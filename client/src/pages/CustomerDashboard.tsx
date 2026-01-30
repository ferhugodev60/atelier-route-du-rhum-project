import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, {LogoutIcon} from "../components/dashboard/Sidebar.tsx";
import OrderHistory from "../components/dashboard/OrderHistory.tsx";
import SecuritySettings from "../components/dashboard/SecuritySettings.tsx";
import ProfileInfo from "../components/dashboard/ProfileInfo.tsx";

export default function CustomerDashboard({ onLogout }: { onLogout: () => void }) {
    const [activeView, setActiveView] = useState<'orders' | 'security' | 'profile'>('orders');

    return (
        <div className="min-h-screen bg-[#0a1a14] pt-32 pb-20 px-4 md:px-12 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1">

                {/* EN-TÊTE : Espacement élégant et bordure dorée */}
                <header className="mb-10 lg:mb-16 border-l-2 lg:border-l-4 border-rhum-gold pl-6 lg:pl-8">
                    <h1 className="text-4xl lg:text-6xl font-serif text-white uppercase">
                        Votre Espace
                    </h1>
                    {/* mt-6 pour laisser respirer le titre */}
                    <p className="text-rhum-gold/40 text-[9px] lg:text-xs uppercase tracking-[0.5em] font-bold mt-6">
                        Membre de l'Atelier de la Route du Rhum
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                    {/* NAVIGATION : Tabs sur mobile, Sidebar sur desktop */}
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        onLogout={onLogout}
                    />

                    {/* ZONE DE CONTENU PRINCIPALE */}
                    <main className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 md:p-16 rounded-sm relative min-h-[500px]">
                        {/* Liseré décoratif supérieur */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rhum-gold/30 to-transparent" />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeView}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeView === 'orders' && <OrderHistory />}
                                {activeView === 'security' && <SecuritySettings />}
                                {activeView === 'profile' && <ProfileInfo />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>

                {/* DÉCONNEXION MOBILE : Reléguée en bas pour une meilleure UX */}
                <div className="lg:hidden mt-12 pt-8 border-t border-white/5">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-4 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-red-500/40 hover:text-red-500 transition-colors group"
                    >
                        <LogoutIcon className="w-5 h-5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    );
}