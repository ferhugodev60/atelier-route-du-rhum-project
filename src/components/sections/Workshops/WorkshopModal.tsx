import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
}

export default function WorkshopModal({ detail, onClose }: WorkshopModalProps) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-12"
            role="dialog"
            aria-modal="true"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="relative bg-[#0a1a14] border-t md:border border-rhum-gold/20 w-full h-full md:h-auto md:max-w-6xl md:max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row z-10"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-rhum-gold/50 hover:text-rhum-gold transition-colors z-50"
                    aria-label="Fermer"
                >
                    <span className="text-4xl font-light">×</span>
                </button>

                <div className="w-full md:w-[45%] h-[30vh] md:h-auto relative overflow-hidden bg-black">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className="w-full h-full object-cover opacity-50"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-black" />
                </div>

                <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col">
                    <header className="mb-8">
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">
                            Fiche de l'Atelier
                        </p>
                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            {detail.title}
                        </h5>

                        <div className="flex items-center gap-3 md:gap-4 text-rhum-gold font-bold tracking-widest text-base md:text-lg">
                            <span className="leading-none">{detail.price}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rhum-gold/30 shrink-0" aria-hidden="true" />
                            <span className="text-white/60 font-normal uppercase text-[11px] md:text-xs tracking-[0.2em] mt-0.5">
                                {detail.duration}
                            </span>
                        </div>
                    </header>

                    {/* BLOC LIVRABLES : Typographie sans-serif et Blanc pur pour la lisibilité */}
                    <div className="mb-8 p-6 bg-white/[0.03] border-l-2 border-rhum-gold">
                        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-rhum-gold mb-3 font-bold">
                            Inclus dans l'expérience :
                        </p>
                        <p className="text-white text-base md:text-lg font-sans font-medium leading-relaxed">
                            {detail.included}
                        </p>
                    </div>

                    <p className="text-rhum-cream/60 italic text-base md:text-lg leading-relaxed mb-10 flex-grow font-serif">
                        "{detail.fullDesc}"
                    </p>

                    <button className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                        RÉSERVER DÈS MAINTENANT
                    </button>
                </div>
            </motion.div>
        </div>
    );
}