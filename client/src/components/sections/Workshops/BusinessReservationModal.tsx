import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import api from "../../../api/axiosInstance.ts";

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function BusinessReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    // 🏺 Configuration adaptative selon l'historique du palier technique
    const [numPeople, setNumPeople] = useState(25);
    const [isFirstTimeForLevel, setIsFirstTimeForLevel] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * 🏺 SÉCURISATION DU QUOTA PAR NIVEAU
     * Interroge le Registre pour déterminer s'il s'agit d'un pack initial (25)
     * ou d'une recharge institutionnelle (10 par 10).
     */
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const checkLevelHistory = async () => {
            try {
                const { data } = await api.get(`/orders/check-level/${workshop.level}`);
                const firstTime = data.count === 0;
                setIsFirstTimeForLevel(firstTime);

                // 🏺 Scellage du volume initial : 25 pour le pack, 10 pour la recharge
                setNumPeople(firstTime ? 25 : 10);
            } catch (error) {
                // Par défaut, le système sécurise sur le pack initial de 25
                setIsFirstTimeForLevel(true);
                setNumPeople(25);
            } finally {
                setIsLoading(false);
            }
        };

        checkLevelHistory();
        return () => { document.body.style.overflow = 'unset'; };
    }, [workshop.level]);

    const handlePeopleChange = (increment: boolean) => {
        // 🏺 Si c'est la première fois, le volume est scellé à 25
        if (isFirstTimeForLevel) return;

        setNumPeople(prev => {
            if (increment) return prev + 10; // 🏺 Recharge par 10
            return Math.max(10, prev - 10); // Minimum 10 pour une recharge
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
                        {isLoading ? "Consultation du Registre..." : "Offre entreprise"}
                    </p>
                    <h5 className="text-3xl font-serif text-white uppercase tracking-tighter">
                        {workshop.title}
                    </h5>
                </div>

                <div className="p-12 space-y-12">
                    {/* Sélecteur de Volume Adaptatif */}
                    <div className="text-center">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-8 font-bold">
                            Nombre de participants
                        </p>

                        <div className="flex items-center justify-center gap-12">
                            <button
                                onClick={() => handlePeopleChange(false)}
                                disabled={isFirstTimeForLevel || numPeople <= 10}
                                className={`text-rhum-gold text-5xl font-light transition-opacity ${(isFirstTimeForLevel || numPeople <= 10) ? 'opacity-10 cursor-not-allowed' : 'hover:scale-110'}`}
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
                                disabled={isFirstTimeForLevel}
                                className={`text-rhum-gold text-5xl font-light transition-opacity ${isFirstTimeForLevel ? 'opacity-10 cursor-not-allowed' : 'hover:scale-110'}`}
                            >
                                +
                            </button>
                        </div>

                        {isFirstTimeForLevel && !isLoading && (
                            <p className="mt-8 text-[9px] text-rhum-gold/60 uppercase tracking-widest font-black">
                                La première réservation requiert exactement 25 participants
                            </p>
                        )}
                    </div>

                    {/* Protocole d'organisation */}
                    <div className="bg-white/5 p-6 rounded-sm border border-white/5">
                        <p className="text-[10px] text-rhum-gold uppercase tracking-widest font-black mb-2">
                            Protocole :
                        </p>
                        <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                            Après confirmation du dossier de vente, veuillez contacter <span className="text-white font-bold">l'Établissement de la Route du Rhum</span> pour sceller les dates de vos séances de Cursus, la capacité d'accueil étant limitée à 15 places par session.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4">
                        <button
                            disabled={isLoading}
                            onClick={() => onConfirm({
                                ...workshop,
                                quantity: numPeople,
                                isBusiness: true,
                                participants: []
                            })}
                            className={`w-full py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm transition-all shadow-xl ${isLoading ? 'bg-white/5 text-white/20' : 'bg-rhum-gold text-rhum-green hover:bg-white'}`}
                        >
                            {isLoading ? "Vérification..." : "Confirmer le Dossier"}
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