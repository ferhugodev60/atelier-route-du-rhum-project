import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
}

export default function WorkshopModal({ detail, onClose }: WorkshopModalProps) {
    return (
        /* - fixed inset-0 : Bloque la modale sur l'écran (viewport) et non dans la section.
           - items-center : Centre verticalement sur l'écran de l'utilisateur.
           - justify-center : Centre horizontalement.
           - p-4 : Gutter de sécurité pour que la carte ne touche pas les bords du téléphone.
        */
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden"
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay : Flou et sombre pour isoler la carte du reste du site */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            <motion.div
                /* Animation d'apparition depuis le centre */
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                /* - h-auto : La carte s'adapte à la taille du texte (pas de vide inutile).
                   - max-h-[90dvh] : Sécurité pour que la carte ne dépasse jamais de l'écran.
                   - rounded-2xl : Look moderne et premium sur mobile.
                */
                className="relative bg-[#0a1a14] w-full h-auto max-h-[90dvh] md:max-w-6xl md:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 rounded-sm md:rounded-sm border border-rhum-gold/20"
            >
                {/* Bouton Fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-rhum-gold/50 hover:text-rhum-gold transition-colors z-50 bg-black/40 backdrop-blur-md p-2 rounded-full"
                    aria-label="Fermer"
                >
                    <span className="text-2xl font-light">×</span>
                </button>

                {/* Visuel adaptable */}
                <div className="w-full md:w-[45%] h-[25vh] sm:h-[30vh] md:h-auto relative overflow-hidden bg-black flex-shrink-0">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className="w-full h-full object-cover opacity-50"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-black" />
                </div>

                {/* Contenu avec scroll interne si le texte est trop long pour le téléphone */}
                <div className="w-full md:w-[55%] p-6 md:p-16 flex flex-col overflow-y-auto">
                    <header className="mb-6">
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-3 opacity-70">
                            Fiche de l'Atelier
                        </p>
                        <h5 className="text-2xl md:text-5xl font-serif text-white mb-4 leading-tight">
                            {detail.title}
                        </h5>

                        <div className="flex items-center gap-3 text-rhum-gold font-bold tracking-widest text-sm">
                            <span className="leading-none">{detail.price}</span>
                            <span className="w-1 h-1 rounded-full bg-rhum-gold/30 shrink-0" />
                            <span className="text-white/60 font-normal uppercase text-[10px] tracking-[0.2em]">
                                {detail.duration}
                            </span>
                        </div>
                    </header>

                    <div className="mb-6 p-4 bg-white/[0.03] border-l-2 border-rhum-gold">
                        <p className="text-[10px] uppercase tracking-widest text-rhum-gold mb-2 font-bold">
                            Inclus :
                        </p>
                        <p className="text-white text-sm md:text-base font-sans font-medium leading-relaxed">
                            {detail.included}
                        </p>
                    </div>

                    <p className="text-rhum-cream/60 italic text-sm md:text-lg leading-relaxed mb-8 font-serif">
                        "{detail.fullDesc}"
                    </p>

                    <button className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                        RÉSERVER DÈS MAINTENANT
                    </button>
                </div>
            </motion.div>
        </div>
    );
}