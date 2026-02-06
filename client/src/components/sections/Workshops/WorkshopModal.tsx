import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {Workshop} from "../../../types/workshop.ts";

interface WorkshopModalProps {
    detail: Workshop;
    onClose: () => void;
    onReserve: (item: Workshop) => void;
}

export default function WorkshopModal({ detail, onClose, onReserve }: WorkshopModalProps) {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0a1a14] w-full h-full md:h-auto md:max-h-[92dvh] md:max-w-6xl flex flex-col md:flex-row z-10 overflow-hidden shadow-2xl border-white/5">
                <button onClick={onClose} className="absolute top-4 right-6 text-rhum-gold/40 hover:text-white transition-colors z-[100] text-4xl">&times;</button>

                <div className="w-full h-[200px] md:h-auto md:w-[40%] relative overflow-hidden bg-black">
                    <img src={detail.image} alt={detail.title} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a1a14] via-transparent to-transparent" />
                </div>

                <div className="flex-1 flex flex-col bg-[#0a1a14]">
                    <header className="p-6 md:p-8">
                        <span className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-bold mb-2 block opacity-50">Niveau {detail.level}</span>
                        <h5 className="text-2xl md:text-4xl font-serif text-white mb-2">{detail.title}</h5>
                        <p className="text-rhum-gold italic text-base font-serif">{detail.description}</p>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                        <div className="p-4 bg-white/[0.03] border-l-2 border-rhum-gold/40">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold mb-1.5 font-bold">Format :</p>
                            <p className="text-white/90 text-sm">{detail.format}</p>
                        </div>
                        {detail.availability && (
                            <div className="p-4 bg-white/[0.03] border-l-2 border-rhum-gold/40">
                                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold mb-1.5 font-bold">Disponibilités :</p>
                                <p className="text-white/90 text-sm font-sans leading-relaxed">{detail.availability}</p>
                            </div>
                        )}
                        <p className="text-rhum-cream/60 italic text-base leading-relaxed font-serif">"{detail.quote}"</p>
                    </div>

                    <footer className="p-5 md:p-7 border-t border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Investissement</span>
                            <span className="text-2xl md:text-3xl font-serif text-rhum-gold">{detail.price}€</span>
                        </div>
                        <button onClick={() => onReserve(detail)} className="w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm">RÉSERVER DÈS MAINTENANT</button>
                    </footer>
                </div>
            </motion.div>
        </div>,
        document.body
    );
}