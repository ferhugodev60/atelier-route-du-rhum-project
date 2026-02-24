import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../api/axiosInstance.ts";


interface Participant {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    memberCode?: string;
    isValidated?: boolean;
}

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function ReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    const isBusiness = workshop?.type === "ENTREPRISE" || workshop?.isBusiness;
    const [step, setStep] = useState(1);
    const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);

    // 🏺 Initialisation selon la nature de la séance
    const [numPeople, setNumPeople] = useState(isBusiness ? 25 : 1);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>(() =>
        Array.from({ length: isBusiness ? 25 : 1 }, () => ({ firstName: '', lastName: '', phone: '', isValidated: false }))
    );

    const isConceptionCursus = workshop.level > 0;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    /**
     * 🏺 GESTION DU VOLUME
     * Entreprise : Min 25. Particulier : Min 1, Max 10.
     */
    const handlePeopleChange = (val: number) => {
        const newCount = isBusiness ? Math.max(25, val) : Math.max(1, Math.min(10, val));
        setNumPeople(newCount);
        setParticipants(prev => {
            if (newCount > prev.length) {
                const added = Array.from({ length: newCount - prev.length }, () => ({
                    firstName: '', lastName: '', phone: '', isValidated: false
                }));
                return [...prev, ...added];
            }
            return prev.slice(0, newCount);
        });
    };

    /**
     * 🏺 VALIDATION DU PASSEPORT MEMBRE (Uniquement pour Conception)
     * Vérifie l'existence du membre et son palier technique actuel.
     */
    const handleCodeValidation = async (index: number, code: string) => {
        if (code.length < 10) return;
        setVerifyingIndex(index);

        try {
            const { data } = await api.get(`/users/verify/${code.toUpperCase()}`);

            // Règle d'accès : $palier \ge niveau - 1$
            if (data.conceptionLevel < workshop.level - 1) {
                alert(`Le membre ${data.firstName} n'a pas encore validé le palier technique requis.`);
                return;
            }

            const newParticipants = [...participants];
            newParticipants[index] = {
                ...newParticipants[index],
                firstName: data.firstName,
                lastName: data.lastName,
                memberCode: code.toUpperCase(),
                isValidated: true
            };
            setParticipants(newParticipants);
        } catch (err) {
            console.error("Identifiant non reconnu dans le registre.");
        } finally {
            setVerifyingIndex(null);
        }
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setParticipants(newParticipants);
    };

    const isStep2Valid = isConceptionCursus
        ? participants.every(p => p.isValidated)
        : participants.every(p => p.firstName.trim() && p.lastName.trim());

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose} />

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0a1a14] w-full max-w-xl h-[85vh] flex flex-col border border-white/5 shadow-2xl">

                <div className="flex border-b border-white/5 bg-black/20">
                    <button onClick={() => setStep(1)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}>
                        1. Participants
                    </button>
                    <button disabled={!hasValidatedStep1} onClick={() => setStep(2)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10' : ''}`}>
                        2. Coordonnées
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col justify-center text-center">
                                <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-black">
                                    {isBusiness ? 'Taille du groupe (Min. 25)' : 'Nombre de places'}
                                </p>
                                <h5 className="text-3xl md:text-4xl font-serif text-white mb-12 uppercase tracking-tighter">
                                    {workshop.title}
                                </h5>

                                <div className="flex items-center justify-center gap-12 mb-16">
                                    <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-5xl hover:scale-110 transition-transform font-light">−</button>
                                    <span className="text-white text-7xl md:text-8xl font-serif w-32">{numPeople}</span>
                                    <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-5xl hover:scale-110 transition-transform font-light">+</button>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={() => { setHasValidatedStep1(true); setStep(2); }} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm hover:bg-white transition-all shadow-xl">Suivant</button>
                                    <button onClick={onClose} className="w-full py-4 text-white/30 uppercase text-[9px] tracking-[0.3em] font-bold hover:text-white transition-colors">Annuler</button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="space-y-12 mb-12">
                                    {participants.map((p, i) => (
                                        <div key={i} className="border-l-2 border-rhum-gold/20 pl-6 space-y-6">
                                            <p className="text-rhum-gold text-[9px] uppercase font-black tracking-[0.3em] opacity-50">Participant n°{i + 1}</p>

                                            {isConceptionCursus ? (
                                                /* 🏺 CAS CONCEPTION : Identification par Code */
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <input
                                                            placeholder="CODE CLIENT (RR-XX-XXXX)"
                                                            className="w-full bg-white/5 border-b border-white/10 text-white p-3 outline-none text-xs focus:border-rhum-gold font-black tracking-[0.2em] uppercase"
                                                            onChange={(e) => handleCodeValidation(i, e.target.value)}
                                                        />
                                                        {verifyingIndex === i && <span className="absolute right-0 bottom-3 text-[7px] text-rhum-gold animate-pulse uppercase font-black">Vérification...</span>}
                                                    </div>
                                                    {p.isValidated && (
                                                        <p className="text-[10px] text-green-500 font-black uppercase tracking-widest italic">
                                                            ✓ Identité certifiée : {p.firstName} {p.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                /* 🏺 CAS DÉCOUVERTE : Inscription libre */
                                                <>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input placeholder="Prénom" value={p.firstName} onChange={e => updateParticipant(i, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold" />
                                                        <input placeholder="Nom" value={p.lastName} onChange={e => updateParticipant(i, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold" />
                                                    </div>
                                                    <input placeholder="Téléphone (Indispensable pour le suivi)" value={p.phone} onChange={e => updateParticipant(i, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold font-bold" />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 sticky bottom-0 bg-[#0a1a14] pt-4 border-t border-white/5">
                                    <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white/40 uppercase text-[9px] tracking-widest font-bold">Retour</button>
                                    <button
                                        disabled={!isStep2Valid}
                                        onClick={() => onConfirm({ ...workshop, participants, quantity: numPeople })}
                                        className={`flex-[2] py-5 font-black uppercase text-[10px] tracking-[0.3em] transition-all rounded-sm ${isStep2Valid ? 'bg-rhum-gold text-rhum-green shadow-xl hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                    >
                                        Confirmer
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}