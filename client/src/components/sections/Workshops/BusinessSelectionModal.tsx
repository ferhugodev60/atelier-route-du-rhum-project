import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Workshop } from '../../../types/workshop.ts';

interface BusinessSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    workshops: Workshop[]; // 🏺 Reçu depuis Workshops.tsx (déjà filtré en base)
    onSelectionComplete: (data: any) => void;
}

export default function BusinessSelectionModal({ isOpen, onClose, workshops, onSelectionComplete }: BusinessSelectionModalProps) {
    const [step, setStep] = useState<'type' | 'conception'>('type');

    if (!isOpen) return null;

    // 🏺 Extraction des paliers selon la nomenclature institutionnelle
    const discovery = workshops.find(w => w.level === 0);
    const conceptionLevels = workshops.filter(w => w.level > 0).sort((a, b) => a.level - b.level);

    const handleFinalSelect = (ws: Workshop, isBusiness: boolean) => {
        onSelectionComplete({
            ...ws,
            name: `Séminaire : ${ws.title}`,
            price: ws.level === 0 ? 50 : ws.price - 20, // 🏺 Application des tarifs dégressifs
            isBusiness: isBusiness,
            quantity: 25
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-xl" />

            <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-4xl p-12 shadow-2xl rounded-sm overflow-hidden min-h-[500px] flex flex-col">

                <button onClick={onClose} className="absolute top-6 right-8 text-rhum-gold/40 hover:text-white text-4xl font-extralight">&times;</button>

                <AnimatePresence mode="wait">
                    {step === 'type' ? (
                        /* --- ÉTAPE 1 : CHOIX DE L'ORIENTATION --- */
                        <motion.div key="type" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col items-center justify-center">
                            <span className="text-rhum-gold tracking-[0.4em] uppercase text-[10px] font-black mb-4">Étape 1 / 2</span>
                            <h5 className="text-2xl md:text-4xl font-serif text-white mb-12 uppercase tracking-tighter">Nature de l'événement</h5>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                                <button
                                    onClick={() => discovery && handleFinalSelect(discovery, true)}
                                    className="group p-10 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all rounded-sm text-center"
                                >
                                    <span className="text-xl font-serif text-white block mb-2 uppercase italic">L'atelier découverte</span>
                                    <span className="text-[9px] text-rhum-gold/40 uppercase tracking-widest">Séance de découverte</span>
                                </button>

                                <button
                                    onClick={() => setStep('conception')}
                                    className="group p-10 border border-rhum-gold/20 bg-rhum-gold/5 hover:bg-rhum-gold/10 transition-all rounded-sm text-center"
                                >
                                    <span className="text-xl font-serif text-white block mb-2 uppercase italic">Les ateliers Conception</span>
                                    <span className="text-[9px] text-rhum-gold uppercase tracking-widest font-black">4 Niveaux disponibles</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* --- ÉTAPE 2 : CHOIX DU PALIER TECHNIQUE (DEPUIS LA BASE) --- */
                        <motion.div key="conception" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1">
                            <button onClick={() => setStep('type')} className="text-rhum-gold/40 hover:text-rhum-gold text-[9px] uppercase tracking-widest mb-8 flex items-center gap-2 font-black transition-colors">
                                ← Retour à l'orientation
                            </button>

                            <div className="text-center mb-10">
                                <span className="text-rhum-gold tracking-[0.4em] uppercase text-[10px] font-black mb-2 block">Étape 2 / 2</span>
                                <h5 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tighter">Sélection du niveau</h5>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {conceptionLevels.map((ws) => (
                                    <button
                                        key={ws.id}
                                        onClick={() => handleFinalSelect(ws, true)}
                                        className="group p-6 border border-white/5 bg-white/[0.02] hover:border-rhum-gold/50 transition-all rounded-sm text-left flex flex-col justify-between"
                                    >
                                        <div>
                                            <span className="text-rhum-gold text-[8px] uppercase tracking-widest mb-1 block font-black">Niveau {ws.level}</span>
                                            <span className="text-base font-serif text-white block uppercase leading-tight">{ws.title}</span>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-white/5">
                                            <span className="text-rhum-gold font-serif text-lg">{(ws.price)} €</span>
                                            <span className="text-[8px] text-white/20 block uppercase tracking-tighter">Tarif Entreprise</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>,
        document.body
    );
}