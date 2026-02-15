// client/src/components/admin/AddProductModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AddProductModal({ isOpen, onClose, onRefresh }: any) {
    const [categories, setCategories] = useState<any[]>([]);
    const [volumes, setVolumes] = useState([{ size: 25, unit: 'cl', price: 0, stock: 0 }]);
    const [isUploading, setIsUploading] = useState(false);

    // 🏺 Chargement des catégories réelles depuis la base de données
    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Erreur lors du chargement des catégories");
        }
    };

    // On recharge les catégories à chaque fois que la modale s'ouvre
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const addVolumeRow = () => setVolumes([...volumes, { size: 0, unit: 'cl', price: 0, stock: 0 }]);

    const removeVolumeRow = (index: number) => {
        if (volumes.length > 1) setVolumes(volumes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('volumes', JSON.stringify(volumes));

        try {
            await api.post('/admin/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Erreur lors de la création");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-sm shadow-2xl">
                <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h2 className="text-xl font-serif text-white uppercase tracking-wider">Nouvelle Référence</h2>
                    <button onClick={onClose} className="text-rhum-gold/40 hover:text-white transition-colors"><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Nom du produit</label>
                            <input name="name" required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold transition-all" />
                        </div>

                        {/* 🏺 Menu déroulant branché sur les catégories réelles */}
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Catégorie</label>
                            <select name="categoryId" required className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold transition-all cursor-pointer">
                                <option value="" className="bg-[#0a1a14]">Sélectionner une famille...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-[#0a1a14]">
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Description commerciale</label>
                        <textarea name="description" rows={3} className="w-full bg-white/5 border border-rhum-gold/10 p-3 text-rhum-cream outline-none focus:border-rhum-gold transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Photographie du flacon (Cloudinary)</label>
                        <input type="file" name="image" accept="image/*" required className="text-[10px] text-rhum-cream/60 file:bg-rhum-gold/10 file:text-rhum-gold file:border-none file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-rhum-gold hover:file:text-[#0a1a14] transition-all" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Formats & Tarifications</label>
                            <button type="button" onClick={addVolumeRow} className="text-[9px] text-rhum-gold flex items-center gap-1 hover:text-white transition-colors">
                                <Plus size={12} /> AJOUTER UN FORMAT
                            </button>
                        </div>

                        {volumes.map((v, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 items-end bg-white/[0.02] p-4 border border-white/5 rounded-sm">
                                <div className="space-y-1">
                                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Taille</p>
                                    <input type="number" step="0.01" value={v.size} onChange={e => {
                                        const newV = [...volumes]; newV[index].size = parseFloat(e.target.value); setVolumes(newV);
                                    }} className="w-full bg-transparent border-b border-white/10 text-xs text-white outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Unité</p>
                                    <select value={v.unit} onChange={e => {
                                        const newV = [...volumes]; newV[index].unit = e.target.value; setVolumes(newV);
                                    }} className="w-full bg-transparent border-b border-white/10 text-[10px] text-white outline-none">
                                        <option value="cl">cl</option><option value="L">L</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Prix (€)</p>
                                    <input type="number" value={v.price} onChange={e => {
                                        const newV = [...volumes]; newV[index].price = parseFloat(e.target.value); setVolumes(newV);
                                    }} className="w-full bg-transparent border-b border-white/10 text-xs text-rhum-gold outline-none font-bold" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Stock</p>
                                        <input type="number" value={v.stock} onChange={e => {
                                            const newV = [...volumes]; newV[index].stock = parseInt(e.target.value); setVolumes(newV);
                                        }} className="w-full bg-transparent border-b border-white/10 text-xs text-white outline-none" />
                                    </div>
                                    <button type="button" onClick={() => removeVolumeRow(index)} className="text-red-400/40 hover:text-red-400 pb-1 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={isUploading} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm">
                        {isUploading ? 'SYNCHRONISATION EN COURS...' : 'VALIDER LA RÉFÉRENCE'}
                    </button>
                </form>
            </div>
        </div>
    );
}