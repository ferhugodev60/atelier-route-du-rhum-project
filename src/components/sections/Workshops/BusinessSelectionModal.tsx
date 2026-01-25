import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { IMG_DISCOVERY } from '../../../data/workshops';

interface BusinessSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectionComplete: (workshopData: any) => void;
}

export default function BusinessSelectionModal({ isOpen, onClose, onSelectionComplete }: BusinessSelectionModalProps) {
    const [view, setView] = useState<'category' | 'conception-choice'>('category');
    const conceptionOptions = [
        { id: 'fruits', label: '1. Fruits', image: IMG_DISCOVERY },
        { id: 'epices', label: '2. Épices', image: IMG_DISCOVERY },
        { id: 'plantes', label: '3. Plantes', image: IMG_DISCOVERY },
        { id: 'mixologie', label: '4. Mixologie', image: IMG_DISCOVERY }
    ];

    if (!isOpen) return null;

    const handleFinalSelect = (title: string, price: string, image: string) => {
        onSelectionComplete({ title, price, image, isBusiness: true });
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-2xl p-8 md:p-12 shadow-2xl overflow-hidden rounded-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />
                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white transition-colors text-3xl font-extralight">&times;</button>

                <AnimatePresence mode="wait">
                    {view === 'category' ? (
                        <motion.div key="v1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="text-center">
                            <span className="text-rhum-gold font-sans tracking-[0.4em] uppercase text-[10px] font-black mb-4 block">Sélection Entreprise</span>
                            <h5 className="text-2xl md:text-4xl font-serif text-white mb-10 leading-tight">Quel atelier pour votre équipe ?</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button onClick={() => handleFinalSelect("Séminaire : Atelier Découverte", "60€", IMG_DISCOVERY)} className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4">
                                    <span className="text-xl font-serif text-white">Atelier Découverte</span>
                                </button>
                                <button onClick={() => setView('conception-choice')} className="group p-8 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all flex flex-col items-center gap-4">
                                    <span className="text-xl font-serif text-white">Atelier Conception</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="v2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                            <button onClick={() => setView('category')} className="text-rhum-gold/40 hover:text-rhum-gold text-[10px] uppercase tracking-widest mb-8 flex items-center justify-center gap-2 mx-auto">← Retour</button>
                            <h5 className="text-2xl md:text-3xl font-serif text-white mb-8">Choisissez votre niveau</h5>
                            <div className="grid grid-cols-2 gap-4">
                                {conceptionOptions.map(opt => (
                                    <button key={opt.id} onClick={() => handleFinalSelect(`Séminaire : Conception ${opt.label}`, "140€", opt.image)} className="py-6 border border-white/5 bg-white/[0.01] hover:bg-rhum-gold hover:text-rhum-green transition-all text-white font-serif text-sm tracking-wide">
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>, document.body
    );
}