import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
    onReserve: (item: any) => void;
}

export default function WorkshopModal({ detail, onClose, onReserve }: WorkshopModalProps) {

    // Bloque le scroll du site en arrière-plan
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handleReservation = () => {
        onReserve({
            id: detail.title,
            name: detail.title,
            price: parseInt(detail.price),
            image: detail.image,
            type: "Atelier",
            quantity: 1
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-0 md:p-12 overflow-hidden" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-md" />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative bg-[#0a1a14] w-screen h-screen md:w-full md:max-w-6xl md:h-[85vh] flex flex-col md:flex-row z-10 rounded-none md:rounded-sm overflow-hidden"
            >
                {/* BOUTON FERMER ULTRA-SIMPLE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 md:top-8 md:right-10 text-rhum-gold/40 hover:text-white transition-colors z-50 text-4xl font-extralight"
                    aria-label="Fermer"
                >
                    &times;
                </button>

                {/* GAUCHE : IMAGE FIXE (Desktop) */}
                <div className="hidden md:block w-full md:w-[45%] h-full relative overflow-hidden bg-black flex-shrink-0 border-r border-white/5">
                    <img src={detail.image} alt={detail.title} className="w-full h-full object-cover opacity-60" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
                </div>

                {/* DROITE : STRUCTURE ERGONOMIQUE FIXE/SCROLL */}
                <div className="w-full md:w-[55%] flex flex-col h-full bg-[#0a1a14] min-h-0">

                    {/* 1. EN-TÊTE FIXE : TITRE ET DESCRIPTION COURTE */}
                    <header className="p-8 md:p-12 pb-6 border-b border-white/5 flex-shrink-0">
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">Fiche de l'Atelier</p>
                        {/* Titre en premier */}
                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-3 leading-tight">
                            {detail.title}
                        </h5>
                        {/* Description accrocheuse juste après le titre */}
                        <p className="text-rhum-gold italic text-lg md:text-xl font-serif opacity-90 leading-relaxed">
                            {detail.desc}
                        </p>
                    </header>

                    {/* 2. CORPS SCROLLABLE : DURÉE, INCLUSIONS ET FULL DESC */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-8">
                        {/* Durée et Expérience Inclus */}
                        <div className="p-6 bg-white/[0.02] border-l-2 border-rhum-gold/40">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-rhum-gold mb-3 font-bold opacity-80">Format de l'expérience :</p>
                            <p className="text-white/90 text-base font-sans leading-relaxed">
                                <span className="font-bold text-white">{detail.duration}</span> avec l'expérience qui inclut <span className="italic">{detail.included.toLowerCase()}</span>.
                            </p>
                        </div>

                        {detail.availability && (
                            <div className="p-6 bg-red-500/5 border-l-2 border-red-500/30">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-red-400 mb-2 font-bold opacity-80">Disponibilité :</p>
                                <p className="text-white/90 text-base font-sans leading-relaxed">{detail.availability}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <p className="text-rhum-cream/60 italic text-base md:text-lg leading-relaxed font-serif">
                                "{detail.fullDesc}"
                            </p>
                        </div>
                    </div>

                    {/* 3. PIED DE PAGE FIXE : PRIX ET ACTION */}
                    <footer className="p-8 md:p-12 pt-6 border-t border-white/5 bg-[#0a1a14] flex-shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                        {/* Prix et Mention à pré-payer */}
                        <div className="flex justify-between items-start mb-6 px-1">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mt-2">
                                Prix de l'atelier
                            </span>

                            <div className="flex flex-col items-end">
                                {/* Prix : Ajout d'un drop-shadow pour le relief */}
                                <span className="text-3xl md:text-5xl font-serif text-rhum-gold drop-shadow-md leading-none">
                                    {detail.price}
                                </span>
                                {/* Mention : Opacité 100%, gras, et tracking plus large */}
                                <span className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-rhum-gold font-bold mt-2">
                                    à pré-payer
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleReservation}
                            className="w-full bg-rhum-gold text-rhum-green py-5 md:py-6 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-2xl rounded-sm"
                        >
                            RÉSERVER DÈS MAINTENANT
                        </button>

                        <div className="flex flex-col items-center gap-3 mt-6">
                            <div className="flex items-center gap-2 text-white/20">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                </svg>
                                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium opacity-50">Sécurisé via Stripe</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}