import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Trash2, Edit3, X, Plus } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const addToast = useToastStore(state => state.addToast); // 🏺 Hook de notification

    const fetchCats = () => api.get('/categories').then(res => setCategories(res.data));

    useEffect(() => { fetchCats(); }, []);

    /**
     * CRÉATION D'UNE NOUVELLE FAMILLE
     */
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        try {
            await api.post('/categories', Object.fromEntries(formData));
            addToast("Nouvelle collection ajoutée à l'architecture.");
            form.reset();
            fetchCats();
        } catch (error) {
            addToast("Erreur lors de la création de la collection.", "error");
        }
    };

    /**
     * MISE À JOUR D'UNE STRUCTURE EXISTANTE
     */
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            await api.put(`/categories/${selectedCategory.id}`, Object.fromEntries(formData));
            addToast("Structure de la collection mise à jour.");
            setIsEditModalOpen(false);
            fetchCats();
        } catch (error) {
            addToast("Échec de la modification technique.", "error");
        }
    };

    /**
     * SUPPRESSION DÉFINITIVE
     */
    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Confirmer la suppression de la collection "${name}" ?`)) {
            try {
                await api.delete(`/categories/${id}`);
                addToast(`Collection "${name}" supprimée du catalogue.`); // 🏺 Toast Succès
                fetchCats();
            } catch {
                addToast("Impossible de supprimer : des références y sont rattachées.", "error"); // 🏺 Toast Erreur spécifique
            }
        }
    };

    return (
        <section className="space-y-12 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Architecture de la Boutique</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Gestion des collections</p>
                </div>
            </header>

            {/* --- FORMULAIRE DE CRÉATION INSTITUTIONNEL --- */}
            <div className="bg-[#0a1a14] border border-rhum-gold/10 p-10 rounded-sm shadow-2xl relative overflow-hidden">
                <form onSubmit={handleCreate} className="relative z-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                        <div className="space-y-3">
                            <label className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold font-black ml-1 flex items-center gap-2">
                                <Plus size={10} /> Nom de la nouvelle collection
                            </label>
                            <input
                                name="name"
                                required
                                placeholder="ex: RHUMS DE PRESTIGE"
                                className="w-full bg-white/5 border-b border-rhum-gold/20 py-3 px-2 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm uppercase tracking-widest placeholder:text-white/10"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-rhum-gold text-rhum-green px-12 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl">
                                Valider
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-black ml-1">Notes & Descriptions (Optionnel)</label>
                        <textarea
                            name="description"
                            rows={2}
                            placeholder="Définissez les caractéristiques de cette collection de bouteilles..."
                            className="w-full bg-white/[0.02] border border-white/5 p-4 text-rhum-cream text-xs outline-none focus:border-rhum-gold/40 transition-all italic font-serif"
                        />
                    </div>
                </form>
            </div>

            {/* --- GRILLE DES FAMILLES ACTIVES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between group hover:bg-[#0a1a14] hover:border-rhum-gold/30 transition-all relative rounded-sm shadow-lg">
                        <div className="flex justify-between items-start mb-6">
                            <div className="space-y-1">
                                <h3 className="text-white font-serif text-xl uppercase tracking-wide group-hover:text-rhum-gold transition-colors">{cat.name}</h3>
                                <p className="text-[8px] text-rhum-gold/40 uppercase font-black tracking-[0.2em]">
                                    {cat._count?.products || 0} Référence(s) rattachée(s)
                                </p>
                            </div>
                            <div className="flex gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setSelectedCategory(cat); setIsEditModalOpen(true); }} className="text-rhum-gold hover:text-white transition-colors">
                                    <Edit3 size={16} />
                                </button>
                                <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-400/60 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        {cat.description && (
                            <div className="border-t border-white/5 pt-4">
                                <p className="text-[10px] text-rhum-cream/40 leading-relaxed line-clamp-2 italic font-serif">
                                    {cat.description}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* --- MODALE DE MODIFICATION STRUCTURELLE --- */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
                    <div className="bg-[#050d0a] border border-rhum-gold/20 w-full max-w-xl p-12 rounded-sm shadow-2xl relative overflow-hidden">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-8 right-8 text-rhum-gold/30 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-serif text-white uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Éditer la Collection</h2>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold font-black ml-1">Dénomination</label>
                                <input
                                    name="name"
                                    defaultValue={selectedCategory.name}
                                    required
                                    className="w-full bg-white/5 border-b border-rhum-gold/20 py-3 text-rhum-cream outline-none focus:border-rhum-gold transition-all uppercase tracking-widest text-sm"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-black ml-1">Notes de structure</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    defaultValue={selectedCategory.description}
                                    className="w-full bg-white/5 border border-white/10 p-4 text-rhum-cream outline-none focus:border-rhum-gold/40 transition-all italic font-serif text-sm"
                                />
                            </div>
                            <button type="submit" className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl">
                                Mettre à jour
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}