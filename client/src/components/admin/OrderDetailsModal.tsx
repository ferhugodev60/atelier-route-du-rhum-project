import { useState, useEffect } from 'react';
import { X, Calendar, Users, ShoppingBag, Loader2, CheckCircle2, UserCircle } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function OrderDetailsModal({ isOpen, orderId, onClose, onRefresh }: any) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            onRefresh();
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Erreur de mise à jour");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl font-sans">
            <div className="bg-[#050d0a] border border-rhum-gold/10 w-full max-w-5xl h-[90vh] flex flex-col rounded-sm shadow-2xl relative overflow-hidden">

                {/* 🏺 Numéro fantôme décoratif */}
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] text-[200px] font-serif text-white pointer-events-none select-none">
                    {order?.reference?.slice(-2)}
                </div>

                <button onClick={onClose} className="absolute top-8 right-8 text-rhum-gold/30 hover:text-white z-20 transition-colors">
                    <X size={28} strokeWidth={1.5} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-rhum-gold uppercase tracking-[0.5em] text-[10px]">
                        <Loader2 className="animate-spin mb-6 opacity-40" size={24} />
                        Extraction du dossier de vente
                    </div>
                ) : (
                    <>
                        <header className="p-12 border-b border-white/5 relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h2 className="text-4xl font-serif text-white uppercase tracking-tighter leading-none mb-4">
                                        Commande <span className="text-rhum-gold">{order.reference}</span>
                                    </h2>
                                    <div className="flex items-center gap-6 text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
                                        <span className="flex items-center gap-2"><Calendar size={12} className="text-rhum-gold/40" /> {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-rhum-gold/40" /> Retrait au comptoir uniquement</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[8px] text-rhum-gold/40 uppercase font-black tracking-[0.4em] text-right">Suivi de l'accueil</p>
                                    <select
                                        value={order.status}
                                        disabled={isUpdating}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="bg-white/5 border border-rhum-gold/20 text-rhum-gold text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 outline-none cursor-pointer hover:bg-rhum-gold/10 transition-all appearance-none text-center min-w-[220px]"
                                    >
                                        <option value="EN PRÉPARATION">En préparation</option>
                                        <option value="DISPONIBLE">Prêt pour retrait</option>
                                        <option value="CLÔTURÉ">Récupéré / Réalisé</option>
                                    </select>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar grid grid-cols-1 lg:grid-cols-4 gap-16 relative z-10">
                            <div className="lg:col-span-3 space-y-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-10">
                                        <ShoppingBag className="text-rhum-gold/40" size={18} />
                                        <h3 className="text-[10px] text-rhum-gold font-black uppercase tracking-[0.5em]">Composition de la vente</h3>
                                    </div>

                                    <div className="space-y-8">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="group border-b border-white/5 pb-10 last:border-0">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="space-y-2">
                                                        <h4 className="text-2xl font-serif text-white uppercase tracking-wide group-hover:text-rhum-gold transition-colors">
                                                            {item.workshop ? item.workshop.title : item.volume?.product.name}
                                                        </h4>
                                                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">
                                                            {item.workshop ? `Formation Technique • Cursus Conception` : `${item.volume?.size}${item.volume?.unit} • Unité(s) : ${item.quantity}`}
                                                        </p>
                                                    </div>
                                                    <div className="text-right font-serif text-rhum-gold">
                                                        <p className="text-2xl">{(item.price * item.quantity).toFixed(2)}€</p>
                                                    </div>
                                                </div>

                                                {/* 🏺 Registre d'émargement pour les formations */}
                                                {item.workshop && (
                                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm">
                                                        <div className="flex justify-between items-center mb-6">
                                                            <p className="text-[9px] text-rhum-gold font-black uppercase tracking-[0.3em] flex items-center gap-2">
                                                                <Users size={12} /> Contrôle des inscriptions (Présentation du mail)
                                                            </p>
                                                            <span className="text-[8px] text-white/20 uppercase font-black">{item.participants.length} Participant(s)</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {item.participants.map((p: any, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-4 bg-white/5 px-5 py-3 border border-white/5 group/user hover:border-rhum-gold/30 transition-all">
                                                                    <div className="w-1 h-1 rounded-full bg-rhum-gold transition-transform group-hover/user:scale-150" />
                                                                    <span className="text-[10px] text-rhum-cream uppercase font-black tracking-widest opacity-80 group-hover/user:opacity-100">
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

                            <div className="space-y-12">
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 mb-2">
                                        <UserCircle className="text-rhum-gold/40" size={18} />
                                        <h3 className="text-[10px] text-rhum-gold font-black uppercase tracking-[0.4em]">Clientèle</h3>
                                    </div>
                                    <div className="bg-white/[0.03] border border-white/5 p-8 space-y-6">
                                        <div>
                                            <p className="text-sm text-white font-serif uppercase tracking-wider">{order.user.firstName} {order.user.lastName}</p>
                                            <p className="text-[9px] text-rhum-gold/60 uppercase tracking-widest mt-2">{order.user.email}</p>
                                        </div>
                                        <div className="pt-6 border-t border-white/5">
                                            <p className="text-[8px] text-white/20 uppercase font-black mb-1">Contact Direct</p>
                                            <p className="text-[10px] text-white/60 tracking-[0.1em]">{order.user.phone || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-12 border-t border-white/10 text-right">
                                    <p className="text-[10px] text-rhum-gold font-black uppercase tracking-[0.5em] mb-4">Total de la Vente</p>
                                    <p className="text-6xl font-serif text-white tracking-tighter leading-none mb-2">
                                        {order.total.toFixed(2)}€
                                    </p>
                                    <p className="text-[8px] text-white/20 uppercase font-bold tracking-[0.2em]">
                                        TVA Incluse • Transaction Validée
                                    </p>
                                </section>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}