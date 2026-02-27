import React, { useState } from 'react';
import { X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useToastStore } from '../../store/toastStore';

export default function EditWorkshopModal({ isOpen, onClose, onRefresh, workshop }: any) {
    const [isUpdating, setIsUpdating] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);

        try {
            await api.put(`/workshops/${workshop.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addToast(`Certification Niveau ${workshop.level} scellée au Registre.`);
            onRefresh();
            onClose();
        } catch (error) {
            addToast("Échec de synchronisation technique.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !workshop) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md font-sans">
            <div className="bg-white border-4 border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.3)] relative">
                <button onClick={onClose} className="absolute top-8 right-8 text-black hover:text-emerald-600 transition-colors">
                    <X size={32} strokeWidth={3} />
                </button>

                <header className="mb-12 text-center border-b-2 border-slate-50 pb-8">
                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter">
                        {workshop.title}
                    </h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* 🏺 Identité */}
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Intitulé de l'atelier</label>
                            <input name="title" defaultValue={workshop.title} required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 transition-all text-sm uppercase" />
                        </div>

                        {/* 🏺 Dualité Tarifaire */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-slate-500 font-black ml-1">Prix Public (€)</label>
                                <input name="price" type="number" step="0.01" defaultValue={workshop.price} required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-black outline-none focus:border-black text-base" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-emerald-700 font-black ml-1">Prix Pro / CE (€)</label>
                                <input name="priceInstitutional" type="number" step="0.01" defaultValue={workshop.priceInstitutional} required className="w-full bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl text-emerald-900 font-black outline-none focus:border-emerald-600 text-base" />
                            </div>
                        </div>
                    </div>

                    {/* 🏺 Configuration Technique */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Format</label>
                            <input name="format" defaultValue={workshop.format} placeholder="ex: 2H00 / 4 DÉGUSTATIONS" className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Planification</label>
                            <input name="availability" defaultValue={workshop.availability} placeholder="ex: SAMEDI 15H" className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Couleur atelier</label>
                            <input name="color" defaultValue={workshop.color} className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                        </div>
                    </div>

                    {/* 🏺 Contenu */}
                    <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Programme</label>
                        <textarea name="description" rows={5} defaultValue={workshop.description} className="w-full bg-slate-50 border-2 border-slate-200 p-6 rounded-2xl text-slate-900 font-bold outline-none focus:border-emerald-600 transition-all text-sm leading-relaxed" />
                    </div>

                    {/* 🏺 Visuel */}
                    <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1 flex items-center gap-2">
                            <ImageIcon size={14} className="text-emerald-600" /> Image
                        </label>
                        <div className="flex items-center gap-8 bg-slate-50 p-6 border-2 border-slate-100 rounded-2xl">
                            <img src={workshop.image} className="w-24 h-24 object-cover rounded-xl border-4 border-white shadow-xl" alt="Aperçu" />
                            <div className="flex-1">
                                <input type="file" name="image" accept="image/*" className="text-xs text-slate-500 file:bg-black file:text-white file:border-none file:px-6 file:py-3 file:rounded-xl file:cursor-pointer file:font-black file:uppercase file:tracking-widest hover:file:bg-emerald-600 transition-all" />
                                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase italic">Format recommandé : 1080x1080px certifié.</p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdating} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4">
                        {isUpdating ? 'SYNCHRONISATION DU REGISTRE...' : (
                            <>
                                <CheckCircle size={18} strokeWidth={3} />
                                Enregistrer les modifications
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}