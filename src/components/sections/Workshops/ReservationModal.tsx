import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
    firstName: string;
    lastName: string;
    phone: string;
}

interface ReservationModalProps {
    workshop: { title: string; price: string; image: string };
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function ReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    // --- ÉTATS ---
    const [step, setStep] = useState(1);
    const [numPeople, setNumPeople] = useState(1);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([{ firstName: '', lastName: '', phone: '' }]);

    // --- LOGIQUE ---
    const handlePeopleChange = (val: number) => {
        const newCount = Math.max(1, Math.min(10, val));
        setNumPeople(newCount);
        setParticipants(prev => {
            const next = [...prev];
            if (newCount > prev.length) {
                for (let i = prev.length; i < newCount; i++) next.push({ firstName: '', lastName: '', phone: '' });
            } else {
                next.splice(newCount);
            }
            return next;
        });
    };

    const handleContinue = () => {
        setHasValidatedStep1(true);
        setStep(2);
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index][field] = value;
        setParticipants(newParticipants);
    };

    const isStep2Valid = participants.every(p => p.firstName.trim() && p.lastName.trim() && p.phone.trim());
    const basePrice = parseInt(workshop.price);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-0 md:p-12 overflow-hidden" role="dialog" aria-modal="true">
            {/* Overlay Sombre */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/98 backdrop-blur-md"
            />

            {/* Conteneur Principal (Full screen mobile / Modal centré desktop) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="relative bg-[#0a1a14] w-screen h-screen md:w-full md:h-auto md:max-w-6xl md:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 rounded-none md:rounded-sm"
            >

                {/* PARTIE GAUCHE : IMAGE (40vh sur mobile, auto sur desktop) */}
                <div className="w-full md:w-[45%] h-[30vh] md:h-auto relative overflow-hidden bg-black flex-shrink-0">
                    <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-transparent to-transparent md:hidden" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent hidden md:block" />
                </div>

                {/* PARTIE DROITE : FORMULAIRE */}
                <div className="w-full md:w-[55%] flex flex-col h-full overflow-hidden">

                    {/* ONGLES DE NAVIGATION SÉCURISÉS */}
                    <div className="flex border-b border-white/5 bg-black/20 flex-shrink-0">
                        <button
                            onClick={() => setStep(1)}
                            className={`flex-1 py-5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}
                        >
                            01. Participants
                        </button>
                        <button
                            disabled={!hasValidatedStep1}
                            onClick={() => hasValidatedStep1 && setStep(2)}
                            className={`flex-1 py-5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10 cursor-not-allowed' : ''}`}
                        >
                            02. Coordonnées
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {/* ÉTAPE 1 : SÉLECTION DU NOMBRE */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="h-full flex flex-col justify-center"
                                >
                                    <header className="mb-12 text-center md:text-left">
                                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">Réservation</p>
                                        <h5 className="text-3xl md:text-5xl font-serif text-white mb-2 leading-tight">{workshop.title}</h5>
                                        <p className="text-white/40 text-xs uppercase tracking-widest mt-4">Combien d'alchimistes participent ?</p>
                                    </header>

                                    <div className="flex items-center justify-center md:justify-start gap-12 mb-16">
                                        <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-5xl font-light">−</button>
                                        <div className="text-center">
                                            <span className="text-white font-serif text-7xl md:text-8xl">{numPeople}</span>
                                        </div>
                                        <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-5xl font-light">+</button>
                                    </div>

                                    <div className="space-y-4">
                                        <button
                                            onClick={handleContinue}
                                            className="w-full bg-rhum-gold text-rhum-green py-6 font-black uppercase tracking-[0.3em] text-[11px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                                        >
                                            Continuer la réservation
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="w-full py-4 text-white/30 hover:text-white text-[9px] uppercase tracking-[0.3em] transition-colors"
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* ÉTAPE 2 : FORMULAIRE COORDONNÉES */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <header className="mb-10">
                                        <h5 className="text-2xl font-serif text-white mb-2">Informations Participants</h5>
                                        <p className="text-rhum-gold/60 text-[10px] uppercase tracking-widest">Veuillez renseigner les détails pour chaque place</p>
                                    </header>

                                    <div className="space-y-10 mb-12">
                                        {participants.map((p, i) => (
                                            <div key={i} className="space-y-5 border-l-2 border-rhum-gold/20 pl-6">
                                                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold font-black">Participant n°{i + 1}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input placeholder="Prénom" value={p.firstName} onChange={e => updateParticipant(i, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white transition-colors" />
                                                    <input placeholder="Nom" value={p.lastName} onChange={e => updateParticipant(i, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white transition-colors" />
                                                </div>
                                                <input placeholder="Téléphone" value={p.phone} onChange={e => updateParticipant(i, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white transition-colors" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-4 mt-auto">
                                        <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white transition-all">
                                            Retour
                                        </button>
                                        <button
                                            disabled={!isStep2Valid}
                                            onClick={() => onConfirm({ ...workshop, quantity: numPeople, participants })}
                                            className={`flex-[2] py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all ${isStep2Valid ? 'bg-rhum-gold text-rhum-green hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                        >
                                            Ajouter au panier — {basePrice * numPeople}€
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}