import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Edit3, ShieldCheck, Banknote, Plus, Trash2, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import EditWorkshopModal from "../../components/admin/EditWorkshopModal.tsx";
import { useToastStore } from '../../store/toastStore';

export default function AdminWorkshops() {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    const fetchWorkshops = async () => {
        try {
            const res = await api.get('/workshops');
            setWorkshops(res.data);
        } catch (error) {
            console.error("Erreur de synchronisation du registre technique.");
        }
    };

    const handleDelete = async (ws: any) => {
        if (!confirm(`Supprimer l'atelier "${ws.title}" ? Cette action est irréversible.`)) return;
        try {
            await api.delete(`/workshops/${ws.id}`);
            addToast(`Atelier "${ws.title}" retiré du catalogue.`);
            fetchWorkshops();
        } catch (error: any) {
            addToast(error.response?.data?.error || "Suppression impossible.", "error");
        }
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreating(true);
        const formData = new FormData(e.currentTarget);
        try {
            await api.post('/workshops', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            addToast("Nouvel atelier scellé au Registre.");
            setIsCreateOpen(false);
            fetchWorkshops();
        } catch (error: any) {
            addToast(error.response?.data?.error || "Erreur lors de la création.", "error");
        } finally {
            setIsCreating(false);
        }
    };

    useEffect(() => { fetchWorkshops(); }, []);

    const sortedWorkshops = useMemo(() => {
        return [...workshops].sort((a, b) => a.level - b.level);
    }, [workshops]);

    const WorkshopEntry = ({ ws }: { ws: any }) => (
        /* 🏺 Carte Blanche Haute Visibilité */
        <div className="bg-white border-2 border-slate-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between group hover:border-emerald-500 hover:shadow-xl transition-all duration-300 rounded-3xl">
            <div className="flex items-center gap-10 flex-1">
                {/* 🏺 Indicateur de Palier Emerald & Black */}
                <div className="flex flex-col items-center min-w-[100px] bg-emerald-50 py-4 rounded-2xl border border-emerald-100">
                    <span className="text-emerald-700 font-black text-xs uppercase tracking-tighter">Niveau</span>
                    <span className="text-slate-950 font-black text-6xl leading-none mt-1">{ws.level}</span>
                </div>

                <div className="h-20 w-1 bg-slate-100 hidden md:block rounded-full" />

                <div className="space-y-3 flex-1 max-w-xl">
                    <h4 className="text-3xl font-black text-black uppercase tracking-tighter group-hover:text-emerald-700 transition-colors">
                        {ws.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-lg">
                            <ShieldCheck size={12} />
                            <p className="text-[10px] uppercase font-black tracking-widest">{ws.format}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-xl">
                            <Banknote size={14} className="text-emerald-600" />
                            <p className="text-[11px] uppercase tracking-tighter font-black">
                                <span className="text-slate-500">Public :</span> <span className="text-black">{ws.price}€</span>
                                <span className="mx-3 text-slate-300">|</span>
                                <span className="text-emerald-700">Offre Pro :</span> <span className="text-emerald-800">{ws.priceInstitutional}€</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 md:mt-0 flex items-center gap-4 border-t md:border-t-0 md:border-l-2 border-slate-100 pt-6 md:pt-0 md:pl-10">
                <button
                    onClick={() => { setSelectedWorkshop(ws); setIsEditOpen(true); }}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white text-[11px] uppercase tracking-widest font-black shadow-lg shadow-emerald-900/20 hover:bg-black transition-all rounded-2xl"
                >
                    <Edit3 size={16} strokeWidth={3} />
                    Modifier
                </button>
                <button
                    onClick={() => handleDelete(ws)}
                    className="flex items-center gap-3 px-5 py-4 bg-red-50 border-2 border-red-100 text-red-600 text-[11px] uppercase tracking-widest font-black hover:bg-red-600 hover:text-white hover:border-red-600 transition-all rounded-2xl"
                >
                    <Trash2 size={16} strokeWidth={3} />
                </button>
            </div>
        </div>
    );

    return (
        <section className="space-y-12 font-sans pb-20 selection:bg-emerald-100">
            {/* --- EN-TÊTE DE DIRECTION --- */}
            <header className="border-b-4 border-slate-100 pb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Architecture des ateliers</h2>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-black text-white text-[11px] uppercase tracking-widest font-black hover:bg-emerald-600 transition-all rounded-2xl shadow-lg"
                >
                    <Plus size={16} strokeWidth={3} />
                    Nouvel Atelier
                </button>
            </header>

            <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    {sortedWorkshops.map(ws => (
                        <WorkshopEntry key={ws.id} ws={ws} />
                    ))}
                </div>
            </div>

            <EditWorkshopModal
                isOpen={isEditOpen}
                workshop={selectedWorkshop}
                onClose={() => setIsEditOpen(false)}
                onRefresh={fetchWorkshops}
            />

            {/* --- MODALE DE CRÉATION --- */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md font-sans">
                    <div className="bg-white border-4 border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-12 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.3)] relative">
                        <button onClick={() => setIsCreateOpen(false)} className="absolute top-8 right-8 text-black hover:text-emerald-600 transition-colors">
                            <X size={32} strokeWidth={3} />
                        </button>
                        <header className="mb-12 text-center border-b-2 border-slate-50 pb-8">
                            <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Nouvel Atelier</h2>
                        </header>
                        <form onSubmit={handleCreate} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Intitulé de l'atelier</label>
                                    <input name="title" required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 transition-all text-sm uppercase" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Niveau (0 = Découverte)</label>
                                    <input name="level" type="number" min="0" max="4" required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-black outline-none focus:border-emerald-600 text-base" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-slate-500 font-black ml-1">Prix Public (€)</label>
                                    <input name="price" type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-black outline-none focus:border-black text-base" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-emerald-700 font-black ml-1">Prix Pro / CE (€)</label>
                                    <input name="priceInstitutional" type="number" step="0.01" className="w-full bg-emerald-50 border-2 border-emerald-200 p-4 rounded-xl text-emerald-900 font-black outline-none focus:border-emerald-600 text-base" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Format</label>
                                    <input name="format" placeholder="ex: 2H00 / 4 DÉGUSTATIONS" className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Planification</label>
                                    <input name="availability" placeholder="ex: SAMEDI 15H" className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Couleur atelier</label>
                                    <input name="color" placeholder="ex: #C59E5F" className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-xs" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Citation</label>
                                <input name="quote" placeholder="ex: L'art de l'assemblage..." className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 text-sm italic" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Programme (courte description)</label>
                                <textarea name="description" rows={3} className="w-full bg-slate-50 border-2 border-slate-200 p-6 rounded-2xl text-slate-900 font-bold outline-none focus:border-emerald-600 text-sm leading-relaxed" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Note de l'Atelier (description complète)</label>
                                <textarea name="fullDescription" rows={5} placeholder="Description détaillée..." className="w-full bg-slate-50 border-2 border-slate-200 p-6 rounded-2xl text-slate-900 font-bold outline-none focus:border-emerald-600 text-sm leading-relaxed" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1 flex items-center gap-2">
                                    <ImageIcon size={14} className="text-emerald-600" /> Image
                                </label>
                                <input type="file" name="image" accept="image/*" required className="text-xs text-slate-500 file:bg-black file:text-white file:border-none file:px-6 file:py-3 file:rounded-xl file:cursor-pointer file:font-black file:uppercase file:tracking-widest hover:file:bg-emerald-600 transition-all" />
                            </div>
                            <button type="submit" disabled={isCreating} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4">
                                {isCreating ? 'CRÉATION EN COURS...' : (
                                    <>
                                        <CheckCircle size={18} strokeWidth={3} />
                                        Sceller au Registre
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}