import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops.ts';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
    onReserve: (item: any) => void;
}

export default function WorkshopModal({ detail, onClose, onReserve }: WorkshopModalProps) {

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalStyle; };
    }, []);

    const handleReservation = () => {
        onReserve({
            id: detail.title,
            name: detail.title,
            price: detail.price,
            image: detail.image,
            type: "Atelier",
            quantity: 1
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden" role="dialog" aria-modal="true">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#0a1a14] w-full h-full md:h-auto md:max-h-[92dvh] md:max-w-6xl flex flex-col md:flex-row z-10 overflow-hidden shadow-2xl border-y md:border border-white/5"
            >
                {/* BOUTON FERMER */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 md:top-6 md:right-8 text-rhum-gold/40 hover:text-white transition-colors z-[100] text-4xl font-extralight"
                >
                    &times;
                </button>

                {/* 1. SECTION IMAGE */}
                <div className="w-full h-[200px] md:h-auto md:w-[40%] flex-shrink-0 relative overflow-hidden bg-black border-b md:border-b-0 md:border-r border-white/5">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className="w-full h-full object-cover opacity-60 md:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a1a14] via-transparent to-transparent" />
                </div>

                {/* 2. SECTION CONTENU */}
                <div className="flex-1 flex flex-col min-h-0 bg-[#0a1a14]">

                    <header className="p-6 md:p-8 pb-3 flex-shrink-0">
                        <span className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-bold mb-2 block opacity-50">Fiche de l'Atelier</span>
                        <h5 className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-1 leading-tight uppercase tracking-tight">
                            {detail.title}
                        </h5>
                        <p className="text-rhum-gold italic text-base font-serif">
                            {detail.desc}
                        </p>
                    </header>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-6">
                        <div className="p-4 bg-white/[0.03] border-l-2 border-rhum-gold/40">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold mb-1.5 font-bold opacity-80">Format de l'expérience :</p>
                            <p className="text-white/90 text-sm font-sans leading-relaxed">
                                <span className="font-bold text-white">{detail.duration}</span> avec l'expérience qui inclut <span className="italic">{detail.included.toLowerCase()}</span>.
                            </p>
                        </div>

                        {detail.availability && (
                            <div className="p-4 bg-red-500/5 border-l-2 border-red-500/30">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-red-400 mb-1 font-bold">Disponibilité :</p>
                                <p className="text-white/90 text-sm font-sans">{detail.availability}</p>
                            </div>
                        )}

                        <p className="text-rhum-cream/60 italic text-base leading-relaxed font-serif pb-6">
                            "{detail.fullDesc}"
                        </p>
                    </div>

                    {/* 3. PIED DE PAGE COMPACT */}
                    <footer className="p-5 md:p-7 border-t border-white/5 bg-[#0a1a14]/90 backdrop-blur-sm flex-shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">Investissement</span>
                            <div className="flex flex-col items-end">
                                <span className="text-2xl md:text-3xl font-serif text-rhum-gold leading-none">{detail.price}</span>
                                <span className="text-[8px] uppercase tracking-[0.3em] text-rhum-gold/60 font-bold mt-1">à pré-payer</span>
                            </div>
                        </div>

                        <button
                            onClick={handleReservation}
                            className="w-full bg-rhum-gold text-rhum-green py-3.5 md:py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm active:scale-[0.98]"
                        >
                            RÉSERVER DÈS MAINTENANT
                        </button>
                    </footer>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}