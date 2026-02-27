import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useToastStore } from '../../store/toastStore';

export default function EditProductModal({ isOpen, onClose, onRefresh, product }: any) {
    const [volumes, setVolumes] = useState<any[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {
        if (product && product.volumes) setVolumes(product.volumes);
    }, [product]);

    const addVolumeRow = () => setVolumes([...volumes, { size: 0, unit: 'centilitres', price: 0, stock: 0 }]);
    const removeVolumeRow = (index: number) => {
        if (volumes.length > 1) setVolumes(volumes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUpdating(true);
        const formData = new FormData(e.currentTarget);
        formData.append('volumes', JSON.stringify(volumes));

        try {
            await api.put(`/admin/products/${product.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            addToast("Modifications de la fiche certifiées.");
            onRefresh();
            onClose();
        } catch (error) {
            addToast("Échec de la mise à jour.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md font-sans">
            <div className="bg-white border-4 border-slate-200 w-full max-w-4xl max-h-[92vh] overflow-y-auto p-12 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
                <button onClick={onClose} className="absolute top-8 right-8 text-black hover:text-emerald-600 z-20 transition-colors">
                    <X size={32} strokeWidth={3} />
                </button>

                <header className="mb-12 border-b-4 border-slate-50 pb-8">
                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter">Modifier la bouteille</h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="space-y-10">
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Nom de la bouteille</label>
                            <input name="name" defaultValue={product.name} required className="w-full bg-slate-50 border-2 border-slate-200 p-4 rounded-xl text-black font-black outline-none focus:border-emerald-600 transition-all text-sm uppercase" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1">Description Technique</label>
                            <textarea name="description" rows={3} defaultValue={product.description} className="w-full bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl text-slate-900 font-bold outline-none focus:border-emerald-600 transition-all text-sm" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-widest text-black font-black ml-1 flex items-center gap-2">
                            <ImageIcon size={14} className="text-emerald-600" /> Image
                        </label>
                        <div className="flex items-center gap-8 bg-slate-50 p-6 border-2 border-slate-100 rounded-2xl">
                            <img src={product.image} className="w-24 h-24 object-cover rounded-xl border-4 border-white shadow-xl" alt="Aperçu" />
                            <div className="flex-1">
                                <input type="file" name="image" accept="image/*" className="text-xs text-black file:bg-black file:text-white file:border-none file:px-6 file:py-3 file:rounded-xl file:cursor-pointer file:font-black file:uppercase file:tracking-widest hover:file:bg-emerald-600 transition-all" />
                                <p className="mt-3 text-[10px] text-slate-400 font-bold uppercase italic">Laissez vide pour conserver l'image actuelle.</p>
                            </div>
                        </div>
                    </div>

                    {/* 🏺 FORMATS & STOCKS COMPTOIR */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-l-4 border-emerald-600 pl-6">
                            <h3 className="text-xs text-black font-black uppercase tracking-[0.3em]">Formats & Tarifications</h3>
                            <button type="button" onClick={addVolumeRow} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">
                                <Plus size={14} strokeWidth={3} /> Ajouter un format
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {volumes.map((v, index) => (
                                <div key={index} className="grid grid-cols-4 gap-6 items-end bg-slate-50 border-2 border-slate-200 p-6 rounded-2xl shadow-sm hover:border-emerald-500 transition-all">
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-black font-black uppercase tracking-widest">Valeur</p>
                                        <input type="number" step="0.01" value={v.size} onChange={e => { const newV = [...volumes]; newV[index].size = e.target.value; setVolumes(newV); }} className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-black font-black outline-none focus:border-emerald-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-black font-black uppercase tracking-widest">Unité</p>
                                        <select value={v.unit} onChange={e => { const newV = [...volumes]; newV[index].unit = e.target.value; setVolumes(newV); }} className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-black font-black outline-none cursor-pointer uppercase text-xs">
                                            <option value="centilitres">centilitres</option>
                                            <option value="Litre(s)">Litre(s)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest text-right">Prix (€)</p>
                                        <input type="number" value={v.price} onChange={e => { const newV = [...volumes]; newV[index].price = e.target.value; setVolumes(newV); }} className="w-full bg-emerald-50 border-2 border-emerald-100 p-3 rounded-xl text-emerald-900 font-black outline-none text-right" />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-2 text-right">
                                            <p className="text-[10px] text-black font-black uppercase tracking-widest">Stock</p>
                                            <input type="number" value={v.stock} onChange={e => { const newV = [...volumes]; newV[index].stock = e.target.value; setVolumes(newV); }} className="w-full bg-white border-2 border-slate-100 p-3 rounded-xl text-black font-black outline-none text-right" />
                                        </div>
                                        <button type="button" onClick={() => removeVolumeRow(index)} className="w-10 h-10 bg-white border-2 border-slate-200 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors">
                                            <Trash2 size={18} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={isUpdating} className="w-full bg-emerald-600 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[12px] hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                        {isUpdating ? 'CERTIFICATION EN COURS...' : (
                            <>
                                <CheckCircle size={18} strokeWidth={3} />
                                ENREGISTRER
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}