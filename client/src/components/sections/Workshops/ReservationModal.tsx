import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant { firstName: string; lastName: string; phone: string; }

interface ReservationModalProps {
    workshop: any;
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function ReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    const isBusiness = workshop?.isBusiness || false;
    const [step, setStep] = useState(1);
    const [numPeople, setNumPeople] = useState(isBusiness ? 25 : 1);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>(() =>
        Array.from({ length: isBusiness ? 25 : 1 }, () => ({ firstName: '', lastName: '', phone: '' }))
    );
    const [showLevelAlert, setShowLevelAlert] = useState(false);

    const workshopPrice = typeof workshop.price === 'number'
        ? workshop.price
        : parseInt(String(workshop.price || "0").replace(/[^0-9]/g, '')) || 0;

    const isConceptionWorkshop = workshop.level > 0;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handlePeopleChange = (val: number) => {
        const newCount = isBusiness ? Math.max(25, val) : Math.max(1, Math.min(10, val));
        setNumPeople(newCount);
        setParticipants(prev => {
            if (newCount > prev.length) {
                const added = Array.from({ length: newCount - prev.length }, () => ({ firstName: '', lastName: '', phone: '' }));
                return [...prev, ...added];
            }
            return prev.slice(0, newCount);
        });
    };

    /**
     * 🏺 SCELLAGE DES DONNÉES
     * Propagation de l'objet workshop complet (title, level, image)
     */
    const getFinalData = () => ({
        ...workshop,
        price: workshopPrice,
        quantity: Number(numPeople),
        participants,
        workshopId: workshop.id
    });

    const handlePreConfirm = () => {
        if (isConceptionWorkshop && !isBusiness) {
            setShowLevelAlert(true);
        } else {
            onConfirm(getFinalData());
        }
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setParticipants(newParticipants);
    };

    const isStep2Valid = participants.every(p => p.firstName.trim() && p.lastName.trim() && p.phone.trim());

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/98 backdrop-blur-md" onClick={onClose} />

            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="relative bg-[#0a1a14] w-full max-w-xl h-[85vh] flex flex-col border border-white/5 shadow-2xl">

                <div className="flex border-b border-white/5 bg-black/20">
                    <button onClick={() => setStep(1)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}>
                        01. Groupe
                    </button>
                    <button disabled={!hasValidatedStep1} onClick={() => setStep(2)} className={`flex-1 py-5 uppercase text-[10px] tracking-[0.4em] font-black transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10' : ''}`}>
                        02. Coordonnées
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col justify-center text-center">
                                <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mb-4 font-bold">{isBusiness ? 'Taille du groupe (Min. 25)' : 'Nombre de places'}</p>
                                <h5 className="text-3xl md:text-4xl font-serif text-white mb-12 uppercase tracking-tighter">{workshop.title}</h5>

                                <div className="flex items-center justify-center gap-12 mb-16">
                                    <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-5xl hover:scale-110 transition-transform font-light">−</button>
                                    <span className="text-white text-7xl md:text-8xl font-serif w-32">{numPeople}</span>
                                    <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-5xl hover:scale-110 transition-transform font-light">+</button>
                                </div>

                                <div className="space-y-4">
                                    <button onClick={() => { setHasValidatedStep1(true); setStep(2); }} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm hover:bg-white transition-all">Suivant</button>
                                    <button onClick={onClose} className="w-full py-4 text-white/30 uppercase text-[9px] tracking-[0.3em] font-bold hover:text-white transition-colors">Retour</button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="space-y-10 mb-12">
                                    {participants.map((p, i) => (
                                        <div key={i} className="border-l-2 border-rhum-gold/20 pl-6 space-y-5">
                                            <p className="text-rhum-gold text-[9px] uppercase font-black tracking-widest italic opacity-50">Participant n°{i + 1}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input placeholder="Prénom" value={p.firstName} onChange={e => updateParticipant(i, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full italic" />
                                                <input placeholder="Nom" value={p.lastName} onChange={e => updateParticipant(i, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold w-full italic" />
                                            </div>
                                            <input placeholder="Téléphone" value={p.phone} onChange={e => updateParticipant(i, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-white p-2 outline-none text-sm focus:border-rhum-gold italic" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 sticky bottom-0 bg-[#0a1a14] pt-4">
                                    <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white/40 uppercase text-[9px] tracking-widest font-bold">Retour</button>
                                    <button disabled={!isStep2Valid} onClick={handlePreConfirm} className={`flex-[2] py-5 font-black uppercase text-[10px] tracking-[0.3em] transition-all rounded-sm ${isStep2Valid ? 'bg-rhum-gold text-rhum-green shadow-xl hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Sceller la sélection</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {showLevelAlert && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[110] bg-[#0a1a14]/98 backdrop-blur-2xl flex items-center justify-center p-8 text-center">
                            <div className="max-w-sm w-full space-y-10">
                                <div className="w-16 h-16 border border-rhum-gold/30 rounded-full flex items-center justify-center mx-auto"><span className="text-rhum-gold text-2xl font-serif">!</span></div>
                                <p className="text-white font-serif italic text-xl leading-relaxed">"Confirmez-vous que tous les participants ont validé les niveaux précédents ?"</p>
                                <div className="flex flex-col gap-4">
                                    <button onClick={() => onConfirm(getFinalData())} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl">Oui, je confirme</button>
                                    <button onClick={() => setShowLevelAlert(false)} className="text-white/30 uppercase tracking-[0.2em] text-[9px] font-bold hover:text-white transition-colors">Vérifier à nouveau</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>,
        document.body
    );
}