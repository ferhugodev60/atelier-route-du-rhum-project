import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function EditWorkshopModal({ isOpen, onClose, onRefresh, workshop }: any) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);

        try {
            await api.put(`/workshops/${workshop.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Erreur de mise à jour de la formation");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !workshop) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 rounded-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white"><X size={24} /></button>

                <header className="mb-10 text-center">
                    <h2 className="text-2xl font-serif text-white uppercase tracking-widest">Éditer le Niveau {workshop.level}</h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Titre de la séance</label>
                            <input name="title" defaultValue={workshop.title} required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Tarif (€)</label>
                            <input name="price" type="number" defaultValue={workshop.price} required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-gold font-bold outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Format</label>
                            <input name="format" defaultValue={workshop.format} placeholder="ex: 2H00 / 4 Dégustations" className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs text-rhum-cream outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Disponibilité</label>
                            <input name="availability" defaultValue={workshop.availability} placeholder="ex: Samedi 15h" className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs text-rhum-cream outline-none" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Code Couleur</label>
                            <input name="color" defaultValue={workshop.color} placeholder="#D4AF37" className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs text-rhum-cream outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Citation / Accroche</label>
                        <input name="quote" defaultValue={workshop.quote} className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-xs italic text-rhum-cream/70 outline-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Description Pédagogique</label>
                        <textarea name="description" rows={4} defaultValue={workshop.description} className="w-full bg-white/5 border border-rhum-gold/10 p-4 text-xs leading-relaxed text-rhum-cream outline-none focus:border-rhum-gold" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Visuel de couverture</label>
                        <div className="flex items-center gap-6 bg-white/[0.02] p-4 border border-white/5">
                            <img src={workshop.image} className="w-20 h-20 object-cover border border-rhum-gold/20 shadow-xl" alt="Actuel" />
                            <input type="file" name="image" accept="image/*" className="text-[10px] text-rhum-cream/40 file:bg-rhum-gold/10 file:text-rhum-gold file:border-none file:px-4 file:py-2 file:cursor-pointer" />
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdating} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-2xl">
                        {isUpdating ? 'SYNCHRONISATION EN COURS...' : 'ENREGISTRER LES MODIFICATIONS'}
                    </button>
                </form>
            </div>
        </div>
    );
}