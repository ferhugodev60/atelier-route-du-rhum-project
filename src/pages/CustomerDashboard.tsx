import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderHistory from "../components/dashboard/OrderHistory";
import SecuritySettings from "../components/dashboard/SecuritySettings";
import Sidebar from "../components/dashboard/Sidebar";
import ProfileInfo from "../components/dashboard/ProfileInfo";

export default function CustomerDashboard({ onLogout }: { onLogout: () => void }) {
    const [activeView, setActiveView] = useState<'orders' | 'security' | 'profile'>('orders');

    return (
        <div className="min-h-screen bg-[#0a1a14] pt-32 pb-20 px-4 md:px-12">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 lg:mb-16 border-l-2 lg:border-l-4 border-rhum-gold pl-6 lg:pl-8">
                    <h1 className="text-3xl lg:text-6xl font-serif text-white">
                        Votre Espace
                    </h1>
                    <p className="text-rhum-gold/40 text-[9px] lg:text-xs uppercase tracking-[0.5em] font-bold mt-4">
                        Membre de l'Atelier de la Route du Rhum
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    <Sidebar activeView={activeView} onViewChange={setActiveView} onLogout={onLogout} />
                    <main className="flex-1 w-full bg-white/[0.02] border border-white/5 p-8 md:p-16 rounded-sm relative min-h-[600px]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/20 to-transparent" />
                        <AnimatePresence mode="wait">
                            <motion.div key={activeView} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                                {activeView === 'orders' && <OrderHistory />}
                                {activeView === 'security' && <SecuritySettings />}
                                {activeView === 'profile' && <ProfileInfo />}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );x
}