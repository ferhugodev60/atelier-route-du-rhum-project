import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Trash2, Edit3, X, Layers } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const addToast = useToastStore(state => state.addToast);

    const fetchCats = () => api.get('/categories').then(res => setCategories(res.data));

    useEffect(() => { fetchCats(); }, []);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await api.post('/categories', Object.fromEntries(formData));
            addToast("Nouvelle collection enregistrée au Registre.");
            form.reset();
            fetchCats();
        } catch (error) {
            addToast("Erreur lors de la création de la collection.", "error");
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            await api.put(`/categories/${selectedCategory.id}`, Object.fromEntries(formData));
            addToast("Mise à jour de la collection certifiée.");
            setIsEditModalOpen(false);
            fetchCats();
        } catch (error) {
            addToast("Échec de la modification technique.", "error");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Confirmer la suppression de la collection "${name}" ?`)) {
            try {
                await api.delete(`/categories/${id}`);
                addToast(`Collection "${name}" retirée.`);
                fetchCats();
            } catch {
                addToast("Impossible de supprimer : des références y sont rattachées.", "error");
            }
        }
    };

    return (
        <section className="space-y-10 font-sans selection:bg-emerald-100">
            {/* --- EN-TÊTE LOGICIEL HAUT CONTRASTE --- */}
            <header className="flex justify-between items-end border-b-2 border-slate-200 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Gestion des Collections</h2>
                    <p className="text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">Architecture du Catalogue Officiel</p>
                </div>
            </header>

            {/* --- FORMULAIRE DE CRÉATION RENFORCÉ --- */}
            <div className="bg-white border-2 border-slate-200 p-8 rounded-2xl shadow-md">
                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1 flex items-center gap-2">
                                Nom de la nouvelle collection
                            </label>
                            <input
                                name="name"
                                required
                                placeholder="ex: LES NECTARS SIGNATURE"
                                className="w-full bg-slate-50 border-2 border-slate-200 py-3.5 px-4 rounded-xl text-black font-bold outline-none focus:border-emerald-600 transition-all text-sm uppercase tracking-wider placeholder:text-slate-400"
                            />
                        </div>
                        <button type="submit" className="bg-emerald-600 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black shadow-lg shadow-emerald-900/10 transition-all">
                            Enregistrer
                        </button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Notes & Spécificités Techniques</label>
                        <textarea
                            name="description"
                            rows={2}
                            placeholder="Définissez les caractéristiques de cette collection..."
                            className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black text-xs outline-none focus:border-emerald-600 transition-all font-bold placeholder:text-slate-400"
                        />
                    </div>
                </form>
            </div>

            {/* --- GRILLE DES COLLECTIONS (Visibilité Maximale) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white border-2 border-slate-200 p-7 rounded-2xl shadow-sm flex flex-col justify-between group hover:border-emerald-500 hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-2">
                                <h3 className="text-black font-black text-lg uppercase tracking-tight group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full w-fit border border-emerald-100">
                                    <Layers size={12} className="text-emerald-700 stroke-[3px]" />
                                    <p className="text-[10px] text-emerald-800 uppercase font-black tracking-widest">
                                        {cat._count?.products || 0} Référence(s)
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { setSelectedCategory(cat); setIsEditModalOpen(true); }} className="text-slate-800 hover:text-emerald-600 transition-colors p-1">
                                    <Edit3 size={18} strokeWidth={2.5} />
                                </button>
                                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-slate-800 hover:text-red-600 transition-colors p-1">
                                    <Trash2 size={18} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                        {cat.description && (
                            <div className="border-t-2 border-slate-50 pt-5">
                                <p className="text-[11px] text-slate-900 leading-relaxed line-clamp-2 font-bold italic">
                                    {cat.description}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- MODALE DE MODIFICATION (Noir profond) --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md">
                    <div className="bg-white border-4 border-slate-200 w-full max-w-lg p-12 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] relative animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 text-black hover:text-emerald-600 transition-colors">
                            <X size={28} strokeWidth={3} />
                        </button>

                        <h2 className="text-3xl font-black text-black tracking-tighter mb-10 border-b-4 border-emerald-50 pb-6">Éditer la collection</h2>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Nom de la collection</label>
                                <input
                                    name="name"
                                    defaultValue={selectedCategory.name}
                                    required
                                    className="w-full bg-slate-50 border-2 border-slate-200 py-4 px-5 rounded-2xl text-black outline-none focus:border-emerald-600 transition-all uppercase tracking-wider font-black text-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    defaultValue={selectedCategory.description}
                                    className="w-full bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl text-black outline-none focus:border-emerald-600 transition-all font-bold text-sm"
                                />
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-black shadow-xl shadow-emerald-900/20 transition-all">
                                Modifier
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}