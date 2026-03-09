import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Workshop } from "../../../types/workshop.ts";
import { useAuthStore } from "../../../store/authStore";

interface WorkshopModalProps {
    detail: Workshop;
    onClose: () => void;
    onReserve: (item: any) => void;
}

export default function WorkshopModal({ detail, onClose, onReserve }: WorkshopModalProps) {
    const { user, setLoginOpen } = useAuthStore();
    const currentLevel = user?.conceptionLevel ?? 0;

    const hasAdvantage = user?.isEmployee || user?.role === 'PRO';
    const displayPrice = hasAdvantage ? detail.priceInstitutional : detail.price;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const isMastered = detail.level > 0 && currentLevel >= detail.level;
    const isLocked = detail.level > 0 && detail.level > currentLevel + 1;

    const handleLoginTrigger = () => {
        onClose();
        setLoginOpen(true);
    };

    const handleReservation = () => {
        onReserve({
            ...detail,
            cartId: `${detail.id}-${Date.now()}`,
            name: detail.title,
            level: detail.level,
            quantity: 1,
            price: displayPrice
        });
        onClose();
    };

    const renderFooterButton = () => {
        if (!user) {
            return (
                <button
                    onClick={handleLoginTrigger}
                    className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-2xl rounded-sm flex items-center justify-center"
                >
                    Se connecter pour réserver
                </button>
            );
        }

        if (isLocked) {
            return (
                <button disabled className="w-full bg-black/40 text-white/20 py-4 md:py-5 font-black uppercase tracking-[0.4em] text-[10px] rounded-sm cursor-not-allowed border border-white/5">
                    Certification de niveau {currentLevel + 1} requise
                </button>
            );
        }

        return (
            <button
                onClick={handleReservation}
                className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all shadow-2xl rounded-sm"
            >
                {isMastered ? 'Renouveler' : 'Réserver dès maintenant'}
            </button>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans p-2 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                        className="relative bg-[#0a1a14] w-full h-full md:h-[90vh] md:max-h-[850px] md:max-w-6xl flex flex-col md:flex-row z-10 overflow-hidden shadow-2xl border border-white/5"
            >
                <button onClick={onClose} className="absolute top-4 right-6 text-rhum-gold/40 hover:text-white transition-colors z-[100] text-4xl font-extralight">&times;</button>

                <div className="w-full h-[200px] md:h-auto md:w-[40%] relative overflow-hidden bg-black border-r border-white/5">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className={`w-full h-full object-cover opacity-60 transition-all duration-1000 ${isLocked ? 'grayscale scale-110' : 'scale-100 hover:scale-105'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-transparent to-transparent opacity-60" />
                </div>

                <div className="flex-1 flex flex-col bg-[#0a1a14] h-full overflow-hidden">
                    <header className="p-6 md:p-10 md:pb-4">
                        <span className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-black mb-2 block opacity-60">
                            {isMastered ? 'Maîtrise Certifiée' : `Niveau ${detail.level}`}
                        </span>
                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-4 uppercase tracking-tighter leading-tight">{detail.title}</h5>
                        <p className="text-rhum-gold text-base italic opacity-90 leading-relaxed font-serif">"{detail.quote}"</p>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 pt-0 space-y-6 custom-scrollbar">
                        <div className="space-y-3">
                            <h6 className="text-white text-[9px] uppercase tracking-[0.3em] font-black opacity-40">Descriptif Technique</h6>
                            <p className="text-rhum-cream/80 text-sm md:text-base leading-relaxed font-light">{detail.description}</p>
                        </div>

                        {/* 🏺 Section Technique Étendue (Pleine largeur) */}
                        <div className="flex flex-col gap-4">
                            <div className="p-4 bg-white/[0.02] border-l border-rhum-gold/30 w-full">
                                <p className="text-[8px] uppercase tracking-[0.2em] text-rhum-gold mb-1 font-black">Format de séance :</p>
                                <p className="text-white/90 text-xs md:text-sm font-light">{detail.format}</p>
                            </div>

                            {/* 🏺 Section Availability (Container Rouge scellé) */}
                            {detail.availability && (
                                <div className="p-4 bg-red-500/5 border-l border-red-500/50 w-full">
                                    <p className="text-[8px] uppercase tracking-[0.2em] text-red-500 mb-1 font-black">Disponibilités :</p>
                                    <p className="text-white/90 text-xs md:text-sm font-light leading-relaxed">{detail.availability}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="p-6 md:p-8 border-t border-white/5 bg-black/40 backdrop-blur-sm">
                        {!isLocked && (
                            <div className="flex justify-between items-end mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-black">Investissement</span>
                                    <span className="text-white/40 text-[8px] uppercase tracking-widest mt-0.5">Taxes et fournitures incluses</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-5xl font-serif text-rhum-gold leading-none">
                                        {displayPrice.toFixed(0)}€
                                    </span>
                                    <span className="text-[9px] text-rhum-gold/60 uppercase tracking-[0.2em] font-black">
                                        / pers.
                                    </span>
                                </div>
                            </div>
                        )}
                        {renderFooterButton()}
                    </footer>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}