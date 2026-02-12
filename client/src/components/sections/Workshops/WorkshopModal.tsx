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

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const isAlreadyDone = detail.level > 0 && currentLevel >= detail.level;
    const isLocked = detail.level > 0 && detail.level > currentLevel + 1;

    /**
     * 🏺 Déclenche l'authentification sans changer d'URL
     */
    const handleLoginTrigger = () => {
        onClose(); // Ferme la modale de l'atelier
        setLoginOpen(true); // Ouvre la modale de connexion via le store
    };

    const handleReservation = () => {
        onReserve({
            ...detail,
            cartId: `${detail.id}-${Date.now()}`,
            name: detail.title,
            level: detail.level,
            quantity: 1
        });
        onClose();
    };

    const renderFooterButton = () => {
        // CAS 1 : Non connecté - Utilisation de l'action Store
        if (!user) {
            return (
                <button
                    onClick={handleLoginTrigger}
                    className="w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm flex items-center justify-center"
                >
                    Se connecter pour réserver
                </button>
            );
        }

        if (isAlreadyDone) {
            return (
                <button disabled className="w-full border border-rhum-gold/20 text-rhum-gold/40 py-4 font-black uppercase tracking-[0.3em] text-[10px] rounded-sm cursor-not-allowed">
                    Niveau déjà validé par votre expérience
                </button>
            );
        }

        if (isLocked) {
            return (
                <button disabled className="w-full bg-black/40 text-white/20 py-4 font-black uppercase tracking-[0.3em] text-[10px] rounded-sm cursor-not-allowed">
                    Validez le niveau {currentLevel + 1} pour débloquer
                </button>
            );
        }

        return (
            <button
                onClick={handleReservation}
                className="w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm"
            >
                Réserver dès maintenant
            </button>
        );
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a1a14] w-full h-full md:h-auto md:max-h-[92dvh] md:max-w-6xl flex flex-col md:flex-row z-10 overflow-hidden shadow-2xl border-white/5">
                <button onClick={onClose} className="absolute top-4 right-6 text-rhum-gold/40 hover:text-white transition-colors z-[100] text-4xl">&times;</button>

                <div className="w-full h-[200px] md:h-auto md:w-[40%] relative overflow-hidden bg-black border-r border-white/5">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className={`w-full h-full object-cover opacity-60 transition-all duration-700 ${isLocked ? 'grayscale scale-105' : 'group-hover:scale-110'}`}
                    />
                </div>

                <div className="flex-1 flex flex-col bg-[#0a1a14]">
                    <header className="p-6 md:p-8">
                        <span className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-bold mb-2 block opacity-50">
                            {isAlreadyDone ? 'Maîtrise Acquise' : `Niveau ${detail.level}`}
                        </span>
                        <h5 className="text-2xl md:text-4xl font-serif text-white mb-2 uppercase tracking-tighter">{detail.title}</h5>
                        <p className="text-rhum-gold italic text-base font-serif">{detail.description}</p>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                        <div className="p-4 bg-white/[0.03] border-l-2 border-rhum-gold/40">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold mb-1.5 font-bold">Format :</p>
                            <p className="text-white/90 text-sm">{detail.format}</p>
                        </div>
                        {detail.availability && (
                            <div className="p-4 bg-white/[0.03] border-l-2 border-rhum-gold/40">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold mb-1.5 font-bold">Disponibilités :</p>
                                <p className="text-white/90 text-sm font-sans leading-relaxed">{detail.availability}</p>
                            </div>
                        )}
                        <p className="text-rhum-cream/60 italic text-base leading-relaxed font-serif">"{detail.quote}"</p>
                    </div>

                    <footer className="p-5 md:p-7 border-t border-white/5 bg-black/20">
                        {!isAlreadyDone && !isLocked && (
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Investissement</span>
                                <span className="text-2xl md:text-3xl font-serif text-rhum-gold">{detail.price}€</span>
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