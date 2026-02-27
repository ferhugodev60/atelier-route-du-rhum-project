import { useState, useEffect } from 'react';
import { X, Calendar, Users, ShoppingBag, Loader2, CheckCircle2, UserCircle, Phone, Mail, Receipt } from 'lucide-react';
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
        /* 🏺 Fond arrière neutralisé en Noir profond pour supprimer le violet */
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md font-sans">
            <div className="bg-white border-4 border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">

                <button onClick={onClose} className="absolute top-8 right-8 text-black hover:text-emerald-600 z-20 transition-colors">
                    <X size={32} strokeWidth={3} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-600 mb-6" size={48} strokeWidth={3} />
                        <p className="text-black font-black uppercase tracking-widest text-xs">Extraction du dossier certifié</p>
                    </div>
                ) : (
                    <>
                        <header className="p-10 md:p-14 border-b-4 border-slate-50 relative z-10 bg-white">
                            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none mb-6">
                                Dossier : <span className="text-emerald-600">{order.reference}</span>
                            </h2>
                            <div className="flex flex-wrap items-center gap-8">
                                <span className="flex items-center gap-3 text-xs text-slate-900 font-black uppercase tracking-wider bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                    <Calendar size={16} className="text-emerald-600" strokeWidth={2.5} />
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-3 text-xs text-emerald-700 font-black uppercase tracking-wider bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                                    <CheckCircle2 size={16} strokeWidth={2.5} /> Transaction Validée
                                </span>
                            </div>
                        </header>

                        {/* 🏺 Grille rééquilibrée en 8/12 - 4/12 pour laisser respirer la colonne client */}
                        <div className="flex-1 overflow-y-auto p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10 bg-white">

                            {/* COMPOSITION (8/12) */}
                            <div className="lg:col-span-8 space-y-12">
                                <section>
                                    <div className="flex items-center gap-4 mb-10 border-l-4 border-emerald-600 pl-6">
                                        <ShoppingBag className="text-black" size={20} strokeWidth={3} />
                                        <h3 className="text-xs text-black font-black uppercase tracking-[0.3em]">Composition de la vente</h3>
                                    </div>

                                    <div className="space-y-12">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="group border-b-2 border-slate-50 pb-10 last:border-0">
                                                <div className="flex justify-between items-start mb-8 gap-10">
                                                    <div className="space-y-3">
                                                        <h4 className="text-3xl font-black text-black uppercase tracking-tighter">
                                                            {item.workshop ? item.workshop.title : item.volume?.product.name}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-[11px] text-emerald-700 font-black uppercase tracking-widest bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-100 w-fit">
                                                            {/* nomenclature pro : Séance [cite: 2026-02-12] */}
                                                            {item.workshop ? `ATELIER` : `${item.volume?.size}${item.volume?.unit} • QUANTITÉ : ${item.quantity}`}
                                                        </div>
                                                    </div>
                                                    <p className="text-3xl font-black text-black tracking-tighter whitespace-nowrap">{(item.price * item.quantity).toFixed(2)}€</p>
                                                </div>

                                                {item.workshop && (
                                                    <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-3xl shadow-inner">
                                                        <p className="text-[10px] text-black font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                                                            <Users size={16} className="text-emerald-600" strokeWidth={3} />
                                                            Inscrits Certifiés ({item.participants.length})
                                                        </p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {item.participants.map((p: any, idx: number) => (
                                                                <div key={idx} className="flex flex-col gap-1 bg-white px-5 py-3 border-2 border-slate-200 rounded-2xl shadow-sm">
                                                                    <span className="text-[11px] text-black font-black uppercase tracking-wider">
                                                                        {p.lastName} {p.firstName}
                                                                    </span>
                                                                    {p.memberCode && (
                                                                        <span className="text-[9px] text-emerald-700 font-black uppercase">Passeport : {p.memberCode}</span>
                                                                    )}
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

                            {/* RÉSUMÉ CLIENT ÉLARGI (4/12) */}
                            <div className="lg:col-span-4 flex flex-col justify-between border-l-4 border-slate-50 pl-12 space-y-12">
                                <section className="space-y-10">
                                    <div className="flex items-center gap-4 border-l-4 border-black pl-4">
                                        <UserCircle className="text-black" size={24} strokeWidth={3} />
                                        <h3 className="text-xs text-black font-black uppercase tracking-widest">Dossier Client</h3>
                                    </div>

                                    <div className="bg-slate-50 border-2 border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm">
                                        <div className="pb-6 border-b border-slate-200">
                                            <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-2">Identité Certifiée</p>
                                            <p className="text-xl text-black font-black uppercase tracking-tighter leading-tight">{order.user.firstName} {order.user.lastName}</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 text-black">
                                                <Mail size={16} className="text-emerald-600 flex-shrink-0 mt-1" strokeWidth={3} />
                                                <p className="text-[11px] font-black uppercase tracking-widest break-all">
                                                    {order.user.email}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-900">
                                                <Phone size={16} className="text-emerald-600 flex-shrink-0" strokeWidth={3} />
                                                <p className="text-[11px] font-black uppercase tracking-widest">
                                                    {order.user.phone || 'Non renseigné'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* TOTAL RÉGLÉ */}
                                <section className="text-right pt-10 border-t-4 border-slate-50">
                                    <div className="flex items-center justify-end gap-3 mb-4">
                                        <Receipt size={18} className="text-emerald-600" strokeWidth={3} />
                                        <p className="text-xs text-black font-black uppercase tracking-[0.2em]">Total</p>
                                    </div>
                                    <p className="text-6xl font-black text-black tracking-tighter leading-none mb-6">
                                        {order.total.toFixed(2)}€
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