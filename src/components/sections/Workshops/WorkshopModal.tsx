import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
}

export default function WorkshopModal({ detail, onClose }: WorkshopModalProps) {
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay sombre avec fermeture au clic */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95"
            />

            {/* Carte de la Modale */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-[#0a1a14] border border-rhum-gold/30 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row"
            >
                {/* Bouton de fermeture */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-6 text-rhum-gold text-3xl hover:scale-110 transition-transform z-50"
                    aria-label="Fermer la fenêtre"
                >
                    ×
                </button>

                {/* Section Image : h-48 sur mobile, auto sur desktop */}
                <div className="w-full md:w-1/2 h-56 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-rhum-gold/20">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>

                {/* Section Contenu */}
                <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col">
                    <header className="mb-6">
                        <h5 className="text-2xl md:text-5xl font-serif italic text-white mb-4 leading-tight">
                            {detail.title}
                        </h5>
                        <p className="text-rhum-gold text-lg md:text-2xl font-bold tracking-wide">
                            {detail.price} — {detail.duration}
                        </p>
                    </header>

                    <div className="w-12 h-px bg-rhum-gold/30 mb-8" />

                    <blockquote className="text-rhum-cream/90 italic text-base md:text-xl mb-10 leading-relaxed border-l-2 border-rhum-gold/20 pl-6">
                        "{detail.fullDesc}"
                    </blockquote>

                    {/* CTA en majuscules */}
                    <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                        RÉSERVER CETTE ÉTAPE
                    </button>
                </div>
            </motion.div>
        </div>
    );
}