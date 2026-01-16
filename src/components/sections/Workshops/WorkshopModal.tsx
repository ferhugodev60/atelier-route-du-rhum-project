import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
    onReserve: (item: any) => void; // Prop ajoutée pour le panier
}

export default function WorkshopModal({ detail, onClose, onReserve }: WorkshopModalProps) {
    const handleReservation = () => {
        // On formate l'objet pour qu'il soit compatible avec le panier
        onReserve({
            id: detail.title, // Utilisation du titre comme ID unique
            name: detail.title,
            price: parseInt(detail.price), // Conversion "60€" -> 60
            image: detail.image,
            type: "Atelier", // Label pour le panier
            quantity: 1
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-0 md:p-12 overflow-hidden" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-md" />

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.4, ease: "easeOut" }} className="relative bg-[#0a1a14] w-screen h-screen md:w-full md:h-auto md:max-w-6xl md:max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row z-10 rounded-none md:rounded-sm">

                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold p-3 z-50 bg-black/40 backdrop-blur-md rounded-full md:bg-transparent" aria-label="Fermer">
                    <span className="text-4xl font-light">×</span>
                </button>

                <div className="w-full md:w-[45%] h-[40vh] md:h-auto relative overflow-hidden bg-black flex-shrink-0">
                    <img src={detail.image} alt={detail.title} className="w-full h-full object-cover opacity-50" loading="eager" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-transparent to-transparent md:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent hidden md:block" />
                </div>

                <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col">
                    <header className="mb-8">
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">Fiche de l'Atelier</p>
                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">{detail.title}</h5>

                        <div className="flex items-center gap-4 md:gap-5">
                            <span className="text-2xl md:text-3xl font-serif text-rhum-gold leading-none">{detail.price}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rhum-gold/30 shrink-0" aria-hidden="true" />
                            <span className="text-white/60 font-sans font-normal uppercase text-[14px] md:text-base tracking-[0.2em] leading-none">{detail.duration}</span>
                        </div>
                    </header>

                    <div className="mb-4 p-6 bg-white/[0.03] border-l-2 border-rhum-gold">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-rhum-gold mb-3 font-bold">Inclus dans l'expérience :</p>
                        <p className="text-white text-base md:text-lg font-sans font-medium leading-relaxed">{detail.included}</p>
                    </div>

                    {detail.availability && (
                        <div className="mb-8 p-6 bg-red-500/5 border-l-2 border-red-500/50">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-red-400 mb-3 font-bold">Attention — Disponibilité limitée :</p>
                            <p className="text-white text-base md:text-lg font-sans font-medium leading-relaxed">{detail.availability}</p>
                        </div>
                    )}

                    <p className="text-rhum-cream/60 italic text-base md:text-lg leading-relaxed mb-12 flex-grow font-serif">"{detail.fullDesc}"</p>

                    <div className="mt-auto space-y-6">
                        {/* Action : Ajout au panier */}
                        <button
                            onClick={handleReservation}
                            className="w-full bg-rhum-gold text-rhum-green py-6 font-black uppercase tracking-[0.3em] text-[11px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                        >
                            RÉSERVER DÈS MAINTENANT
                        </button>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-white/40">
                                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                </svg>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-medium">Paiement 100% sécurisé via Stripe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}