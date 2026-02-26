import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function BusinessReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    // 🏺 Configuration : Base de 25 places, incrémentation par 10
    const [numPeople, setNumPeople] = useState(25);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handlePeopleChange = (increment: boolean) => {
        setNumPeople(prev => {
            if (increment) return prev + 10; // 🏺 Ajout 10 par 10
            return Math.max(25, prev - 10); // 🏺 Minimum 25 places
        });
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/98 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-[#0a1a14] w-full max-w-xl border border-white/5 shadow-2xl flex flex-col"
            >
                {/* Header Institutionnel */}
                <div className="p-8 border-b border-white/5 bg-black/20 text-center">
                    <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-black">
                        Offre entreprise
                    </p>
                    <h5 className="text-3xl font-serif text-white uppercase tracking-tighter">
                        {workshop.title}
                    </h5>
                </div>

                <div className="p-12 space-y-12">
                    {/* Sélecteur de Volume par paliers de 10 */}
                    <div className="text-center">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8 font-bold">
                            Nombre de participants (Minimum 25)
                        </p>

                        <div className="flex items-center justify-center gap-12">
                            <button
                                onClick={() => handlePeopleChange(false)}
                                className={`text-rhum-gold text-5xl font-light transition-opacity ${numPeople <= 25 ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110'}`}
                            >
                                −
                            </button>

                            <div className="flex flex-col items-center">
                                <span className="text-white text-8xl font-serif leading-none">
                                    {numPeople}
                                </span>
                            </div>

                            <button
                                onClick={() => handlePeopleChange(true)}
                                className="text-rhum-gold text-5xl font-light hover:scale-110 transition-transform"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Note d'identification manuelle */}
                    <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                        <p className="text-[10px] text-rhum-gold uppercase tracking-widest font-black mb-2">
                            Protocole :
                        </p>
                        <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                            Après avoir effectué l'achat, il est impératif de contacter <span className="text-white font-bold">l'Atelier de la Route du Rhum</span> pour réserver les dates des ateliers, car la capacité d'accueil est limitée à 15 places maximum par atelier.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button
                            onClick={() => onConfirm({
                                ...workshop,
                                quantity: numPeople,
                                isBusiness: true,
                                // 🏺 Pas de saisie de coordonnées
                                participants: []
                            })}
                            className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm hover:bg-white transition-all shadow-xl"
                        >
                            Confirmer
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-4 text-white/20 uppercase text-[9px] tracking-[0.3em] font-bold hover:text-white transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}