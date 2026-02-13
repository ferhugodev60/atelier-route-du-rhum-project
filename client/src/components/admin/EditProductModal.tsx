// client/src/components/admin/EditProductModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function EditProductModal({ isOpen, onClose, onRefresh, product }: any) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData(e.currentTarget);

        try {
            // Appel à la route PUT avec l'ID du produit
            await api.put(`/admin/products/${product.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Erreur lors de la mise à jour");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-xl p-8 rounded-sm shadow-2xl">
                <header className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-serif text-white uppercase tracking-wider">Modifier la référence</h2>
                    <button onClick={onClose} className="text-rhum-gold/40 hover:text-white"><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Nom de la bouteille</label>
                        <input
                            name="name"
                            defaultValue={product.name}
                            required
                            className="w-full bg-white/5 border-b border-rhum-gold/20 py-2 text-rhum-cream outline-none focus:border-rhum-gold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={product.description}
                            className="w-full bg-white/5 border border-rhum-gold/10 p-3 text-rhum-cream outline-none focus:border-rhum-gold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold">Image actuelle</label>
                        <div className="flex items-center gap-4">
                            <img src={product.image} className="w-16 h-16 object-cover border border-rhum-gold/20" alt="Aperçu" />
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                className="text-[10px] text-rhum-cream/40 file:bg-white/5 file:text-rhum-gold file:border-none file:px-3 file:py-1"
                            />
                        </div>
                        <p className="text-[8px] text-rhum-gold/30 italic">Laissez vide pour conserver l'image actuelle.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full bg-rhum-gold text-rhum-green py-4 font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-all"
                    >
                        {isUpdating ? 'Mise à jour du Cloud...' : 'Enregistrer les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
}