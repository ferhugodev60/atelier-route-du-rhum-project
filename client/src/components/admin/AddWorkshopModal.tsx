import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axiosInstance';

interface AddWorkshopModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRefresh: () => void;
}

export default function AddWorkshopModal({ isOpen, onClose, onRefresh }: AddWorkshopModalProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData(e.currentTarget);

        try {
            await api.post('/workshops', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
            onClose();
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Erreur lors de la création de la formation");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 rounded-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                <header className="mb-10 text-center">
                    <h2 className="text-2xl font-serif text-white uppercase tracking-widest">Nouveau Niveau d'Expertise</h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Niveau (1-4)</label>
                            <input name="level" type="number" min="1" max="4" required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Titre de la séance</label>
                            <input name="title" required placeholder="ex: Initiation à la Dégustation" className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Tarif (€)</label>
                            <input name="price" type="number" step="0.01" required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-gold font-bold outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Format</label>
                            <input name="format" required placeholder="ex: 2H00 / 4 Dégustations" className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs text-rhum-cream outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Citation / Accroche</label>
                        <input name="quote" required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs italic text-rhum-cream/70 outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Description Détaillée</label>
                        <textarea name="description" rows={4} required className="w-full bg-white/5 border border-rhum-gold/10 p-4 text-xs leading-relaxed text-rhum-cream outline-none focus:border-rhum-gold" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Visuel de Couverture (Cloudinary)</label>
                        <input type="file" name="image" accept="image/*" required className="w-full text-[10px] text-rhum-cream/40 file:bg-rhum-gold/10 file:text-rhum-gold file:border-none file:px-4 file:py-2 file:mr-4 file:cursor-pointer" />
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-2xl">
                        {isUploading ? 'CRÉATION EN COURS...' : 'PUBLIER LA FORMATION'}
                    </button>
                </form>
            </div>
        </div>
    );
}