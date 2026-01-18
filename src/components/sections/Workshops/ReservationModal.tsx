import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
    firstName: string;
    lastName: string;
    phone: string;
}

interface ReservationModalProps {
    workshop: { title: string; price: any; image: string };
    onClose: () => void;
    onConfirm: (data: any) => void;
}

export default function ReservationModal({ workshop, onClose, onConfirm }: ReservationModalProps) {
    const [step, setStep] = useState(1);
    const [numPeople, setNumPeople] = useState(1);
    const [hasValidatedStep1, setHasValidatedStep1] = useState(false);
    const [participants, setParticipants] = useState<Participant[]>([{ firstName: '', lastName: '', phone: '' }]);
    const [showLevelAlert, setShowLevelAlert] = useState(false);

    // --- CORRECTION DE L'ERREUR REPLACE ---
    // On convertit le prix en String() avant d'appeler .replace() pour éviter le crash si c'est déjà un nombre
    const workshopTitle = workshop?.title?.toLowerCase() || "";
    const rawPrice = String(workshop?.price || "0");
    const workshopPrice = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 0;

    // Détection de la gamme
    const isConceptionWorkshop =
        workshopTitle.includes('niveau') ||
        workshopTitle.includes('conception') ||
        workshopPrice > 60;

    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalStyle; };
    }, []);

    if (!workshop) return null;

    const handlePeopleChange = (val: number) => {
        const newCount = Math.max(1, Math.min(10, val));
        setNumPeople(newCount);
        setParticipants(prev => {
            const next = [...prev];
            if (newCount > prev.length) {
                for (let i = prev.length; i < newCount; i++) next.push({ firstName: '', lastName: '', phone: '' });
            } else { next.splice(newCount); }
            return next;
        });
    };

    const handlePreConfirm = () => {
        if (isConceptionWorkshop) {
            setShowLevelAlert(true);
        } else {
            // On envoie le prix nettoyé (workshopPrice) pour garantir la fin du NaN dans le panier
            onConfirm({
                ...workshop,
                price: workshopPrice,
                quantity: Number(numPeople),
                participants
            });
        }
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index][field] = value;
        setParticipants(newParticipants);
    };

    const isStep2Valid = participants.every(p => p.firstName.trim() && p.lastName.trim() && p.phone.trim());

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-0 md:p-12 overflow-hidden" role="dialog" aria-modal="true">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/98 backdrop-blur-md" />

            <motion.div
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                className="relative bg-[#0a1a14] w-screen h-screen md:w-full md:h-auto md:max-w-xl md:max-h-[85vh] overflow-hidden shadow-2xl flex flex-col z-10 rounded-none md:rounded-sm border border-white/5"
            >
                <div className="w-full flex flex-col h-full overflow-hidden relative">
                    <div className="flex border-b border-white/5 bg-black/20 flex-shrink-0">
                        <button onClick={() => setStep(1)} className={`flex-1 py-5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 1 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'}`}>01. Participants</button>
                        <button disabled={!hasValidatedStep1} onClick={() => setStep(2)} className={`flex-1 py-5 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${step === 2 ? 'text-rhum-gold border-b border-rhum-gold' : 'text-white/20'} ${!hasValidatedStep1 ? 'opacity-10' : ''}`}>02. Coordonnées</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full flex flex-col justify-center py-4">
                                    <header className="mb-12 text-center">
                                        <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 opacity-70">Nombre de participants ?</p>
                                        <h5 className="text-2xl md:text-4xl font-serif text-white mb-2 leading-tight">{workshop.title}</h5>
                                    </header>
                                    <div className="flex items-center justify-center gap-12 mb-16">
                                        <button onClick={() => handlePeopleChange(numPeople - 1)} className="text-rhum-gold text-5xl font-light">−</button>
                                        <span className="text-white font-serif text-7xl md:text-8xl w-24 text-center">{numPeople}</span>
                                        <button onClick={() => handlePeopleChange(numPeople + 1)} className="text-rhum-gold text-5xl font-light">+</button>
                                    </div>
                                    <div className="space-y-4 max-w-xs mx-auto w-full">
                                        <button onClick={() => { setHasValidatedStep1(true); setStep(2); }} className="w-full bg-rhum-gold text-rhum-green py-6 font-black uppercase tracking-[0.3em] text-[11px] rounded-sm shadow-xl">Continuer</button>
                                        <button onClick={onClose} className="w-full py-4 text-white/30 text-[9px] uppercase tracking-[0.3em]">Fermer</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                    <header className="mb-10 text-center">
                                        <h5 className="text-2xl font-serif text-white mb-2">Informations Participants</h5>
                                        <p className="text-rhum-gold/60 text-[10px] uppercase tracking-widest">Coordonnées requises pour chaque place</p>
                                    </header>
                                    <div className="space-y-10 mb-12">
                                        {participants.map((p, i) => (
                                            <div key={i} className="space-y-5 border-l-2 border-rhum-gold/20 pl-6 text-left">
                                                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold font-black italic">Alchimiste n°{i + 1}</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input placeholder="Prénom" value={p.firstName} onChange={e => updateParticipant(i, 'firstName', e.target.value)} className="bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white w-full" />
                                                    <input placeholder="Nom" value={p.lastName} onChange={e => updateParticipant(i, 'lastName', e.target.value)} className="bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white w-full" />
                                                </div>
                                                <input placeholder="Téléphone" value={p.phone} onChange={e => updateParticipant(i, 'phone', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-sm py-3 focus:border-rhum-gold outline-none text-white" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(1)} className="flex-1 py-5 border border-white/10 text-white/40 font-black uppercase tracking-[0.3em] text-[10px]">Retour</button>
                                        <button disabled={!isStep2Valid} onClick={handlePreConfirm} className={`flex-[2] py-5 font-black uppercase tracking-[0.3em] text-[10px] transition-all shadow-xl ${isStep2Valid ? 'bg-rhum-gold text-rhum-green hover:bg-white' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>
                                            Valider
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {showLevelAlert && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 z-[110] bg-[#0a1a14]/98 backdrop-blur-2xl flex items-center justify-center p-6"
                            >
                                <div className="max-w-sm w-full text-center space-y-8">
                                    <div className="w-16 h-16 border border-rhum-gold/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                        <span className="text-rhum-gold text-2xl font-light">!</span>
                                    </div>
                                    <p className="text-white font-serif italic text-xl md:text-2xl leading-relaxed">
                                        "Êtes-vous sûr que tous les participants ont bien débloqué le niveau en question ?"
                                    </p>
                                    <div className="flex flex-col gap-4">
                                        <button
                                            onClick={() => onConfirm({ ...workshop, price: workshopPrice, quantity: Number(numPeople), participants })}
                                            className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all"
                                        >
                                            Oui, je confirme
                                        </button>
                                        <button onClick={() => setShowLevelAlert(false)} className="text-white/40 uppercase tracking-widest text-[9px] hover:text-white transition-colors">Non, je souhaite vérifier</button>
                                    </div>
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