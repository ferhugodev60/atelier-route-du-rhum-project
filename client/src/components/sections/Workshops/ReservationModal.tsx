import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../api/axiosInstance.ts";
import { useAuthStore } from '../../../store/authStore';

/**
 * 🏺 INTERFACE DE RÉSERVATION TRANSVERSALE
 * Autorise la collaboration libre entre Particuliers, CSE et Professionnels.
 */

interface Participant {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    memberCode?: string;
    isValidated?: boolean;
}

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function ReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    const { user } = useAuthStore();

    // 🏺 Détermination du niveau cible pour le Cursus [cite: 2026-02-12]
    const isConceptionCursus = workshop.level > 0;

    const [step, setStep] = useState(1);
    const [verifyingIndex, setVerifyingIndex] = useState<number | null>(null);
    const [numPeople, setNumPeople] = useState(1);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);

    const [participants, setParticipants] = useState<Participant[]>(() => {
        const initialArr: Participant[] = [{ firstName: '', lastName: '', phone: '', email: '', isValidated: false }];
        if (user) {
            initialArr[0] = {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone || '',
                email: user.email || '',
                memberCode: user.memberCode,
                isValidated: true // L'organisateur est scellé par sa session
            };
        }
        return initialArr;
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handlePeopleChange = (val: number) => {
        const newCount = Math.max(1, Math.min(10, val));
        setNumPeople(newCount);
        setParticipants(prev => {
            if (newCount > prev.length) {
                const added: Participant[] = Array.from({ length: newCount - prev.length }, () => ({
                    firstName: '', lastName: '', phone: '', email: '', isValidated: false
                }));
                return [...prev, ...added];
            }
            return prev.slice(0, newCount);
        });
    };

    /**
     * 🏺 SÉCURISATION DU PASSEPORT
     * Le verrou d'homogénéité a été supprimé pour autoriser la collaboration.
     */
    const handlePassportInput = (index: number, val: string) => {
        const code = val.toUpperCase();
        const newParticipants = [...participants];
        newParticipants[index] = { ...newParticipants[index], memberCode: code, isValidated: false };
        setParticipants(newParticipants);

        if (code.length === 10) {
            triggerValidation(index, code);
        }
    };

    const triggerValidation = async (index: number, code: string) => {
        setVerifyingIndex(index);
        try {
            const { data } = await api.get(`/users/verify/${code}`);

            // 1️⃣ Validation du Palier Technique uniquement
            if (isConceptionCursus && data.conceptionLevel < workshop.level - 1) {
                alert(`Le membre ${data.firstName} n'a pas encore validé le palier technique précédent au Registre.`);
                return;
            }

            const newParticipants = [...participants];
            newParticipants[index] = { ...newParticipants[index], ...data, memberCode: code, isValidated: true };
            setParticipants(newParticipants);
        } catch {
            console.error("Identifiant inconnu au Registre.");
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
        : participants.every(p => p.firstName.trim() && p.lastName.trim() && p.email?.trim() && p.phone?.trim());

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0a1a14] w-full max-w-xl h-[85vh] flex flex-col border border-white/5 shadow-2xl">

                <div className="flex border-b border-white/5 bg-black/20 font-black uppercase tracking-[0.4em] text-[10px]">
                    <button onClick={() => setStep(1)} className={`flex-1 py-5 transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}>1. Participant(s)</button>
                    <button disabled={!hasValidatedStep1} onClick={() => setStep(2)} className={`flex-1 py-5 transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10' : ''}`}>2. Identification</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col justify-center text-center">
                                <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-black">Volume de places</p>
                                <h5 className="text-3xl md:text-4xl font-serif text-white mb-12 uppercase tracking-tighter">{workshop.title}</h5>
                                <div className="flex items-center justify-center gap-12 mb-16">
                                    <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-5xl font-light">−</button>
                                    <span className="text-white text-7xl md:text-8xl font-serif w-32">{numPeople}</span>
                                    <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-5xl font-light">+</button>
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
                                            <div className="flex justify-between items-center">
                                                <p className="text-rhum-gold text-[9px] uppercase font-black tracking-[0.3em] opacity-50">Participant n°{i + 1}</p>
                                                {isConceptionCursus && (
                                                    <span className="text-[7px] bg-rhum-gold/10 text-rhum-gold px-2 py-1 rounded-full font-black uppercase tracking-widest italic">Passeport Obligatoire</span>
                                                )}
                                            </div>

                                            {isConceptionCursus ? (
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <input
                                                            placeholder="CODE CLIENT (RR-26-XXXX)"
                                                            value={p.memberCode || ""}
                                                            className="w-full bg-white/5 border-b border-white/10 text-white p-3 outline-none text-xs focus:border-rhum-gold font-black tracking-[0.2em] uppercase"
                                                            onChange={(e) => handlePassportInput(i, e.target.value)}
                                                            readOnly={i === 0 && !!user}
                                                        />
                                                        {verifyingIndex === i && <span className="absolute right-0 bottom-3 text-[7px] text-rhum-gold animate-pulse uppercase font-black">Certification...</span>}
                                                    </div>
                                                    {p.isValidated && (
                                                        <p className="text-[10px] text-green-500 font-black uppercase tracking-widest italic">
                                                            ✓ Identité scellée : {p.firstName} {p.lastName}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input placeholder="PRÉNOM" value={p.firstName} readOnly={i === 0 && !!user} onChange={e => updateParticipant(i, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold uppercase placeholder:text-white/20" />
                                                        <input placeholder="NOM" value={p.lastName} readOnly={i === 0 && !!user} onChange={e => updateParticipant(i, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold uppercase placeholder:text-white/20" />
                                                    </div>
                                                    <input placeholder="EMAIL" type="email" value={p.email} readOnly={i === 0 && !!user} onChange={e => updateParticipant(i, 'email', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold font-bold uppercase placeholder:text-white/20" />
                                                    <input placeholder="TÉLÉPHONE" type="tel" value={p.phone} readOnly={i === 0 && !!user} onChange={e => updateParticipant(i, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold font-bold uppercase placeholder:text-white/20" />
                                                </div>
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
                                        Confirmer le Dossier
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