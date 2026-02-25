import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function BusinessReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    const [step, setStep] = useState(1);
    const [numPeople, setNumPeople] = useState(50);
    const [activePacket, setActivePacket] = useState(0);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);

    // 🏺 Registre global des participants
    const [participants, setParticipants] = useState<Participant[]>(() =>
        Array.from({ length: 50 }, () => ({ firstName: '', lastName: '', phone: '', email: '' }))
    );

    // 🏺 Registre des noms de groupes (un nom par paquet de 25)
    const [groupNames, setGroupNames] = useState<string[]>(() => ["Groupe A", "Groupe B"]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handlePeopleChange = (val: number) => {
        const newCount = Math.max(50, val);
        setNumPeople(newCount);

        setParticipants(prev => {
            if (newCount > prev.length) {
                const added = Array.from({ length: newCount - prev.length }, () => ({
                    firstName: '', lastName: '', phone: '', email: ''
                }));
                return [...prev, ...added];
            }
            return prev.slice(0, newCount);
        });

        const requiredNamesCount = Math.ceil(newCount / 25);
        setGroupNames(prev => {
            if (requiredNamesCount > prev.length) {
                const newNames = Array.from({ length: requiredNamesCount - prev.length }, (_, i) =>
                    `Groupe ${String.fromCharCode(65 + prev.length + i)}`
                );
                return [...prev, ...newNames];
            }
            return prev.slice(0, requiredNamesCount);
        });
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setParticipants(newParticipants);
    };

    const updateGroupName = (index: number, name: string) => {
        const newNames = [...groupNames];
        newNames[index] = name;
        setGroupNames(newNames);
    };

    const packets = useMemo(() => {
        const result = [];
        for (let i = 0; i < participants.length; i += 25) {
            result.push(participants.slice(i, i + 25));
        }
        return result;
    }, [participants]);

    const isStep2Valid = participants.every(p => p.firstName.trim() && p.lastName.trim() && p.email.trim())
        && groupNames.every(name => name.trim() !== "");

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden font-sans">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose} />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0a1a14] w-full max-w-2xl h-[85vh] flex flex-col border border-white/5 shadow-2xl">

                <div className="flex border-b border-white/5 bg-black/20">
                    <button onClick={() => setStep(1)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}>1. Effectif Global</button>
                    <button disabled={!hasValidatedStep1} onClick={() => setStep(2)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10' : ''}`}>2. Coordonnées</button>
                </div>

                {step === 2 && packets.length > 1 && (
                    <div className="flex bg-black/40 border-b border-white/5 overflow-x-auto custom-scrollbar">
                        {packets.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActivePacket(idx)}
                                className={`px-6 py-3 text-[8px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors ${activePacket === idx ? 'text-rhum-gold bg-white/5 border-b border-rhum-gold' : 'text-white/30'}`}
                            >
                                {groupNames[idx] || `Groupe ${idx + 1}`}
                            </button>
                        ))}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col justify-center text-center">
                                <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-black">Configuration Grand Compte (Min. 50)</p>
                                <h5 className="text-3xl md:text-4xl font-serif text-white mb-8 uppercase tracking-tighter">{workshop.title}</h5>

                                <div className="flex items-center justify-center gap-8 mb-12">
                                    <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-4xl font-light hover:scale-110 transition-transform">−</button>
                                    <div className="flex flex-col items-center">
                                        <span className="text-white text-7xl md:text-8xl font-serif leading-none">{numPeople}</span>
                                        <span className="text-[9px] text-rhum-gold/40 uppercase tracking-[0.3em] font-bold mt-2">Participants</span>
                                    </div>
                                    <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-4xl font-light hover:scale-110 transition-transform">+</button>
                                </div>

                                <div className="bg-white/5 p-4 rounded-sm border border-white/5 mb-12 inline-block mx-auto">
                                    <p className="text-[10px] text-rhum-gold uppercase tracking-widest font-black">
                                        Logistique : {packets.length} Paquet(s) de 25
                                    </p>
                                </div>

                                <div className="space-y-4 max-w-sm mx-auto w-full">
                                    <button onClick={() => { setHasValidatedStep1(true); setStep(2); }} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm hover:bg-white transition-all shadow-xl">Suivant</button>
                                    <button onClick={onClose} className="w-full py-4 text-white/30 uppercase text-[9px] tracking-[0.3em] font-bold hover:text-white transition-colors">Annuler</button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>

                                <div className="mb-12 p-6 bg-white/[0.02] border border-rhum-gold/20 rounded-sm">
                                    <label className="block text-[8px] uppercase tracking-[0.4em] text-rhum-gold/50 font-black mb-3">Identification du Groupe {activePacket + 1}</label>
                                    <input
                                        placeholder="EX: ÉQUIPE LOGISTIQUE / DIRECTION..."
                                        value={groupNames[activePacket]}
                                        onChange={(e) => updateGroupName(activePacket, e.target.value)}
                                        className="w-full bg-transparent border-b border-rhum-gold text-white font-serif text-xl md:text-2xl outline-none py-2 placeholder:opacity-10"
                                    />
                                </div>

                                <div className="space-y-12 mb-12">
                                    {packets[activePacket].map((p, i) => {
                                        const globalIndex = activePacket * 25 + i;
                                        return (
                                            <div key={globalIndex} className="border-l-2 border-rhum-gold/20 pl-6 space-y-6">
                                                <p className="text-rhum-gold text-[9px] uppercase font-black tracking-[0.3em] opacity-50">Membre n°{globalIndex + 1}</p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input placeholder="Prénom" value={p.firstName} onChange={e => updateParticipant(globalIndex, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold" />
                                                    <input placeholder="Nom" value={p.lastName} onChange={e => updateParticipant(globalIndex, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full font-bold" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input placeholder="Téléphone" value={p.phone} onChange={e => updateParticipant(globalIndex, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold font-bold" />
                                                    <input placeholder="Email" value={p.email} onChange={e => updateParticipant(globalIndex, 'email', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold font-bold" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex gap-4 sticky bottom-0 bg-[#0a1a14] pt-4 border-t border-white/5">
                                    <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white/40 uppercase text-[9px] tracking-widest font-bold">Retour</button>
                                    <button
                                        disabled={!isStep2Valid}
                                        onClick={() => onConfirm({
                                            ...workshop,
                                            participants,
                                            groupNames,
                                            quantity: numPeople,
                                            isBusiness: true
                                        })}
                                        className={`flex-[2] py-5 font-black uppercase text-[10px] tracking-[0.3em] transition-all rounded-sm ${isStep2Valid ? 'bg-rhum-gold text-rhum-green shadow-xl hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}
                                    >
                                        Confirmer le Registre ({numPeople} pers.)
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