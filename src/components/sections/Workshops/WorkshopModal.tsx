import { createPortal } from 'react-dom'; // Nécessaire pour sortir de la section
import { motion } from 'framer-motion';
import { type WorkshopDetail } from '../../../data/workshops';

interface WorkshopModalProps {
    detail: WorkshopDetail;
    onClose: () => void;
}

export default function WorkshopModal({ detail, onClose }: WorkshopModalProps) {
    // Le Portal téléporte ce contenu à la racine de l'application (document.body)
    return createPortal(
        <div
            /* - fixed inset-0 : Prend tout l'écran, pas juste la section.
               - z-[9999] : Passe par-dessus la Navbar et tout le reste du site.
               - items-start : Colle le contenu en haut (top: 0) sur mobile.
            */
            className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-0 md:p-12 overflow-hidden"
            role="dialog"
            aria-modal="true"
        >
            {/* Overlay sombre total */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/98 backdrop-blur-md"
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                /* - w-screen h-screen : Force la taille de l'écran utilisateur sur mobile.
                   - md:w-full md:h-auto : Restaure le format carte sur desktop.
                   - rounded-none : Aucun arrondi pour coller aux bords de l'écran.
                */
                className="relative bg-[#0a1a14] w-screen h-screen md:w-full md:h-auto md:max-w-6xl md:max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row z-10 rounded-none md:rounded-sm"
            >
                {/* Bouton Fermer : Toujours en haut à droite de l'ÉCRAN */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-rhum-gold p-3 z-50 bg-black/40 backdrop-blur-md rounded-full md:bg-transparent"
                    aria-label="Fermer"
                >
                    <span className="text-4xl font-light">×</span>
                </button>

                {/* Section Visuelle (40% de l'écran sur mobile) */}
                <div className="w-full md:w-[45%] h-[40vh] md:h-auto relative overflow-hidden bg-black flex-shrink-0">
                    <img
                        src={detail.image}
                        alt={detail.title}
                        className="w-full h-full object-cover opacity-50"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-black" />
                </div>

                {/* Section Contenu (60% de l'écran sur mobile) */}
                <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col">
                    <header className="mb-8">
                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">
                            Fiche de l'Atelier
                        </p>
                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                            {detail.title}
                        </h5>

                        <div className="flex items-center gap-4 text-rhum-gold font-bold tracking-widest text-base md:text-lg">
                            <span>{detail.price}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-rhum-gold/30 shrink-0" />
                            <span className="text-white/60 font-normal uppercase text-[11px] md:text-xs tracking-[0.2em]">
                                {detail.duration}
                            </span>
                        </div>
                    </header>

                    <div className="mb-8 p-6 bg-white/[0.03] border-l-2 border-rhum-gold">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-rhum-gold mb-3 font-bold">
                            Inclus dans l'expérience :
                        </p>
                        <p className="text-white text-base md:text-lg font-sans font-medium leading-relaxed">
                            {detail.included}
                        </p>
                    </div>

                    <p className="text-rhum-cream/60 italic text-base md:text-lg leading-relaxed mb-12 flex-grow font-serif">
                        "{detail.fullDesc}"
                    </p>

                    <button className="w-full bg-rhum-gold text-rhum-green py-6 font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                        RÉSERVER DÈS MAINTENANT
                    </button>

                    {/* Safe area pour éviter que le bouton soit caché par la barre iPhone */}
                    <div className="h-10 md:hidden" />
                </div>
            </motion.div>
        </div>,
        document.body // C'est ici que la magie opère : la modale est injectée dans le body
    );
}