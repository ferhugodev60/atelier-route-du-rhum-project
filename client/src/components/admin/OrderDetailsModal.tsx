import { useState, useEffect } from 'react';
import { X, Calendar, Users, ShoppingBag, Loader2, CheckCircle2, UserCircle } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function OrderDetailsModal({ isOpen, orderId, onClose }: any) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && orderId) {
            setLoading(true);
            api.get(`/orders/${orderId}`)
                .then(res => {
                    setOrder(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [isOpen, orderId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl font-sans">
            <div className="bg-[#050d0a] border border-rhum-gold/10 w-full max-w-6xl h-[90vh] flex flex-col rounded-sm shadow-2xl relative overflow-hidden">

                <button onClick={onClose} className="absolute top-8 right-8 text-rhum-gold/30 hover:text-white z-20 transition-colors">
                    <X size={24} strokeWidth={1.5} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-rhum-gold uppercase tracking-[0.5em] text-[10px]">
                        <Loader2 className="animate-spin mb-6 opacity-40" size={24} />
                        Extraction du dossier
                    </div>
                ) : (
                    <>
                        <header className="p-8 md:p-12 border-b border-white/5 relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-tighter leading-none mb-4">
                                Commande : <span className="text-rhum-gold">{order.reference}</span>
                            </h2>
                            <div className="flex items-center gap-6 text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
                                <span className="flex items-center gap-2"><Calendar size={12} className="text-rhum-gold/40" /> {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="flex items-center gap-2 text-rhum-gold/60"><CheckCircle2 size={12} /> Transaction Validée</span>
                            </div>
                        </header>

                        {/* --- GRILLE RÉÉQUILIBRÉE (9/12 - 3/12) --- */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 relative z-10">

                            {/* COLONNE GAUCHE : SÉLECTION (9/12) */}
                            <div className="lg:col-span-9 space-y-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <ShoppingBag className="text-rhum-gold/40" size={14} />
                                        <h3 className="text-[9px] text-rhum-gold font-black uppercase tracking-[0.5em]">Composition de la vente</h3>
                                    </div>

                                    <div className="space-y-10">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="group border-b border-white/5 pb-8 last:border-0">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="space-y-2">
                                                        <h4 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
                                                            {item.workshop ? item.workshop.title : item.volume?.product.name}
                                                        </h4>
                                                        <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">
                                                            {item.workshop ? `Les ateliers Conception` : `${item.volume?.size}${item.volume?.unit} • Quantité : ${item.quantity}`}
                                                        </p>
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-serif text-rhum-gold">{(item.price * item.quantity).toFixed(2)}€</p>
                                                </div>

                                                {item.workshop && (
                                                    <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-sm">
                                                        <p className="text-[8px] text-rhum-gold font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                                            <Users size={12} /> Liste des inscrits ({item.participants.length})
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            {item.participants.map((p: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/5">
                                                                    <div className="w-1 h-1 rounded-full bg-rhum-gold" />
                                                                    <span className="text-[9px] text-rhum-cream uppercase font-black tracking-widest opacity-80">
                                                                        {p.lastName} {p.firstName}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* COLONNE DROITE : RÉSUMÉ (3/12) --- ESPACEMENT RÉDUIT */}
                            <div className="lg:col-span-3 flex flex-col justify-between border-l border-white/5 pl-8 md:pl-10">

                                <section className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <UserCircle className="text-rhum-gold/40" size={14} />
                                        <h3 className="text-[9px] text-rhum-gold font-black uppercase tracking-[0.4em]">Clientèle</h3>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                        <div>
                                            <p className="text-xs text-white font-serif uppercase tracking-wider leading-tight">{order.user.firstName} {order.user.lastName}</p>
                                            <p className="text-[8px] text-rhum-gold/60 uppercase tracking-widest mt-2">{order.user.email}</p>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-[10px] text-white/60 tracking-widest">{order.user.phone || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* 🏺 Prix ajusté à 6xl pour éviter l'overflow */}
                                <section className="text-right mt-12 lg:mt-0">
                                    <p className="text-[9px] text-rhum-gold font-black uppercase tracking-[0.5em] mb-4">Total réglé</p>
                                    <p className="text-5xl md:text-6xl font-serif text-white tracking-tighter leading-none mb-4 whitespace-nowrap">
                                        {order.total.toFixed(2)}€
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-[8px] text-white/20 uppercase font-bold tracking-[0.2em]">Maison Route du Rhum</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}