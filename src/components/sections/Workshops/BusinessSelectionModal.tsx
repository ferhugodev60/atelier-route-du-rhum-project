import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { IMG_DISCOVERY } from '../../../data/workshops';

interface BusinessSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectionComplete: (workshopData: any) => void;
}

export default function BusinessSelectionModal({ isOpen, onClose, onSelectionComplete }: BusinessSelectionModalProps) {
    // Suppression de l'état 'view' et des options de conception pour un flux direct

    if (!isOpen) return null;

    /**
     * Envoie directement les données à la modale de groupe
     */
    const handleFinalSelect = (title: string, price: string, image: string) => {
        onSelectionComplete({ title, price, image, isBusiness: true });
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* OVERLAY SOMBRE */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            />

            {/* CONTENU DE LA MODALE */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-hidden rounded-sm"
            >
                {/* Liseré décoratif */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white transition-colors text-3xl font-extralight"
                >
                    &times;
                </button>

                <div className="text-center">
                    <span className="text-rhum-gold font-sans tracking-[0.4em] uppercase text-[10px] font-black mb-4 block">
                        Sélection Entreprise
                    </span>
                    <h5 className="text-2xl md:text-4xl font-serif text-white mb-10 leading-tight italic">
                        Quel atelier pour votre équipe ?
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ATELIER DÉCOUVERTE : SÉLECTION DIRECTE */}
                        <button
                            onClick={() => handleFinalSelect("Atelier Découverte", "60€", IMG_DISCOVERY)}
                            className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4 rounded-sm"
                        >
                            <span className="text-xl font-serif text-white">Atelier Découverte</span>
                            <span className="text-[10px] text-rhum-gold/40 uppercase tracking-[0.3em] font-bold">Format Initiation</span>
                        </button>

                        {/* ATELIER CONCEPTION : DÉSORMAIS EN SÉLECTION DIRECTE */}
                        <button
                            onClick={() => handleFinalSelect("Atelier Conception", "140€", IMG_DISCOVERY)}
                            className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4 rounded-sm"
                        >
                            <span className="text-xl font-serif text-white">Atelier Conception</span>
                            <span className="text-[10px] text-rhum-gold/40 uppercase tracking-[0.3em] font-bold">Format Création</span>
                        </button>
                    </div>
                </div>

                <footer className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] italic">
                        * Le choix des thématiques (Fruits, Épices, etc.) se fera lors de la validation du devis.
                    </p>
                </footer>
            </motion.div>
        </div>,
        document.body
    );
}