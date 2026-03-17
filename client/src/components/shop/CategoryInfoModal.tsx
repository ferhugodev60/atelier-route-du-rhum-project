import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CategoryInfoModalProps {
    category: any;
    onClose: () => void;
}

export default function CategoryInfoModal({ category, onClose }: CategoryInfoModalProps) {
    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 font-sans">

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-[#0a1a14] border border-white/10 w-full max-w-4xl max-h-[90vh] md:max-h-none overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] rounded-sm flex flex-col md:flex-row z-[10001]"
            >
                {/* 🏺 LA CROIX : Extraite et placée à la racine du conteneur pour un ancrage parfait */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-white/40 hover:text-rhum-gold transition-colors cursor-pointer p-2 z-[10002] bg-black/20 backdrop-blur-md rounded-full md:bg-transparent md:backdrop-blur-none"
                >
                    <X size={24} strokeWidth={1.5} />
                </button>

                {/* VISUEL : Section Haute (Mobile) / Gauche (Desktop) */}
                <div className="w-full md:w-1/2 h-48 md:h-64 lg:h-auto relative overflow-hidden shrink-0 bg-black">
                    <img
                        src={category.image || '/placeholder-collection.jpg'}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-70 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a1a14]" />
                </div>

                {/* TEXTE : Section Basse (Mobile) / Droite (Desktop) */}
                <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center bg-[#0a1a14] overflow-y-auto">

                    <header className="mb-6 md:mb-10">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <div className="h-px w-6 md:w-8 bg-rhum-gold/40" />
                            <span className="text-rhum-gold text-[8px] md:text-[10px] uppercase tracking-[0.5em] font-black">Collection</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-tighter leading-tight md:leading-[0.8] mb-4">
                            {category.name}
                        </h2>
                    </header>

                    <div className="space-y-6">
                        <div className="border-l-2 border-rhum-gold/30 pl-6 md:pl-8 italic">
                            <p className="text-rhum-cream text-base md:text-xl leading-relaxed font-serif opacity-90">
                                "{category.description || "Description en cours de scellage..."}"
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}