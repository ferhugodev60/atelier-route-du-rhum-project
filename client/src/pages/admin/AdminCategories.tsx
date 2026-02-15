// client/src/pages/admin/AdminCategories.tsx
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Trash2, Edit3, X } from 'lucide-react';

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const fetchCats = () => api.get('/categories').then(res => setCategories(res.data));
    useEffect(() => { fetchCats(); }, []);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await api.post('/categories', Object.fromEntries(formData));
        e.currentTarget.reset();
        fetchCats();
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await api.put(`/categories/${selectedCategory.id}`, Object.fromEntries(formData));
        setIsEditModalOpen(false);
        fetchCats();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Supprimer cette catégorie ?")) {
            try { await api.delete(`/categories/${id}`); fetchCats(); }
            catch { alert("Erreur : Des produits y sont rattachés."); }
        }
    };

    return (
        <section className="space-y-10 font-sans">
            <header>
                <h2 className="text-2xl font-serif text-white uppercase">Architecture du Catalogue</h2>
                <p className="text-[10px] text-rhum-gold/50 uppercase tracking-widest mt-1">Gestion des familles et descriptions</p>
            </header>

            {/* Formulaire de création */}
            <form onSubmit={handleCreate} className="bg-white/5 p-8 border border-rhum-gold/10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Nom de la catégorie</label>
                        <input name="name" required placeholder="ex: Rhum arrangé" className="w-full bg-transparent border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold transition-all" />
                    </div>
                    <div className="space-y-2 text-right flex items-end justify-end">
                        <button type="submit" className="bg-rhum-gold text-rhum-green px-10 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Créer la section</button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Description (Optionnelle)</label>
                    <textarea name="description" rows={2} placeholder="Décrivez les produits de cette famille..." className="w-full bg-transparent border border-rhum-gold/10 p-3 text-rhum-cream outline-none focus:border-rhum-gold transition-all" />
                </div>
            </form>

            {/* Liste des catégories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between group hover:bg-white/[0.04] transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-rhum-gold font-bold text-sm uppercase tracking-wider">{cat.name}</h3>
                                <p className="text-[9px] text-rhum-cream/40 uppercase mt-1">{cat._count.products} références actives</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => { setSelectedCategory(cat); setIsEditModalOpen(true); }} className="text-rhum-gold/30 hover:text-white transition-colors"><Edit3 size={16} /></button>
                                <button onClick={() => handleDelete(cat.id)} className="text-red-400/20 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        {cat.description && (
                            <p className="text-[10px] text-rhum-cream/60 leading-relaxed line-clamp-2 italic border-t border-white/5 pt-3">
                                {cat.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Modale de Modification */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                    <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-lg p-8 rounded-sm shadow-2xl relative">
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-rhum-gold/40 hover:text-white"><X size={20} /></button>
                        <h2 className="text-xl font-serif text-white uppercase mb-8">Éditer la catégorie</h2>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Nom</label>
                                <input name="name" defaultValue={selectedCategory.name} required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Description complète</label>
                                <textarea name="description" rows={5} defaultValue={selectedCategory.description} className="w-full bg-white/5 border border-rhum-gold/10 p-3 text-rhum-cream outline-none focus:border-rhum-gold" />
                            </div>
                            <button type="submit" className="w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">Mettre à jour la structure</button>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}