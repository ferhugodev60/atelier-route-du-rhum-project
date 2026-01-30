import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { IMG_DISCOVERY } from '../../../data/workshops.ts';

interface BusinessSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectionComplete: (workshopData: any) => void;
}

export default function BusinessSelectionModal({ isOpen, onClose, onSelectionComplete }: BusinessSelectionModalProps) {

    if (!isOpen) return null;

    const handleFinalSelect = (title: string, price: string, image: string) => {
        onSelectionComplete({ title, price, image, isBusiness: true });
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/98 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-hidden rounded-sm"
            >
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
                        <button
                            onClick={() => handleFinalSelect("Séminaire : Atelier Découverte", "60€", IMG_DISCOVERY)}
                            className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4 rounded-sm text-center"
                        >
                            <span className="text-xl font-serif text-white">Atelier Découverte</span>
                            <span className="text-[10px] text-rhum-gold/40 uppercase tracking-[0.3em] font-bold">Initiation & Dégustation</span>
                        </button>

                        <button
                            onClick={() => handleFinalSelect("Séminaire : Atelier Conception", "140€", IMG_DISCOVERY)}
                            className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4 rounded-sm text-center"
                        >
                            <span className="text-xl font-serif text-white">Atelier Conception</span>
                            <span className="text-[10px] text-rhum-gold/40 uppercase tracking-[0.3em] font-bold">Cycle Alchimique (4 Niveaux)</span>
                        </button>
                    </div>
                </div>

                {/* NOTE LOGISTIQUE SUR LA CONTINUITÉ DU GROUPE */}
                <footer className="mt-12 pt-8 border-t border-white/5 text-center">
                    <div className="max-w-lg mx-auto space-y-4">
                        <p className="text-[9px] text-rhum-gold uppercase tracking-[0.3em] font-black italic">
                            * Règle de progression impérative
                        </p>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] leading-relaxed">
                            L'Atelier Conception se déroule en 4 niveaux successifs (1 à 4).
                            Pour accéder aux niveaux supérieurs, il est obligatoire que le groupe soit composé du même nombre de participants et des mêmes personnes ayant validé le niveau précédent.
                        </p>
                    </div>
                </footer>
            </motion.div>
        </div>,
        document.body
    );
}