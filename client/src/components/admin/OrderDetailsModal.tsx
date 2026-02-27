import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, Calendar, Loader2, CheckCircle2,
    UserCircle, Phone, Mail, UserCheck,
    Save, Check, PlusCircle, AlertCircle, Clock
} from 'lucide-react';
import api from '../../api/axiosInstance';

/**
 * 🏺 DOSSIER DE VENTE ET CERTIFICATION
 * Version Scellée : Correction des contrastes (Texte Noir) et visibilité des logos.
 */
export default function OrderDetailsModal({ isOpen, orderId, onClose, onRefresh }: any) {
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrderDetails = () => {
        if (!orderId) return;
        setLoading(true);
        api.get(`/orders/${orderId}`)
            .then(res => {
                setOrder(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        if (isOpen && orderId) fetchOrderDetails();
    }, [isOpen, orderId]);

    const handleAddParticipant = async (orderItemId: string) => {
        try {
            await api.post('/orders/items/participants/manual', { orderItemId });
            fetchOrderDetails();
        } catch (error) {
            console.error("Échec de l'ajout.");
        }
    };

    const handleCertifyParticipant = async (pId: string, firstName: string, lastName: string) => {
        if (!firstName || !lastName) return;
        setUpdatingId(pId);
        try {
            await api.patch(`/orders/participants/${pId}/status`, {
                firstName,
                lastName,
                isValidated: true
            });
            fetchOrderDetails();
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Échec de la certification.");
        } finally {
            setUpdatingId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md font-sans selection:bg-emerald-100">
            <div className="bg-white border-4 border-slate-200 w-full max-w-7xl h-[92vh] flex flex-col rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">

                <button onClick={onClose} className="absolute top-8 right-8 text-black hover:text-emerald-600 z-20 transition-all focus:outline-none">
                    <X size={32} strokeWidth={3} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <Loader2 className="animate-spin text-emerald-600 mb-6" size={48} strokeWidth={3} />
                        <p className="text-black font-black uppercase tracking-widest text-xs italic">Audit du Registre...</p>
                    </div>
                ) : (
                    <>
                        {/* --- EN-TÊTE --- */}
                        <header className="p-10 md:p-14 border-b-4 border-slate-50 bg-white shrink-0">
                            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none mb-6">
                                Dossier : <span className="text-emerald-600">{order.reference}</span>
                            </h2>
                            <div className="flex flex-wrap items-center gap-8">
                                <span className="flex items-center gap-3 text-xs text-slate-900 font-black uppercase tracking-wider bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                                    <Calendar size={16} className="text-emerald-600" strokeWidth={2.5} />
                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span className={`flex items-center gap-3 text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl border ${
                                    order.status === 'FINALISÉ' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        order.status === 'SÉANCE PLANIFIÉE' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                    {order.status === 'FINALISÉ' ? <CheckCircle2 size={16} strokeWidth={2.5} /> :
                                        order.status === 'SÉANCE PLANIFIÉE' ? <Clock size={16} strokeWidth={2.5} /> :
                                            <AlertCircle size={16} strokeWidth={2.5} />}
                                    {order.status}
                                </span>
                            </div>
                        </header>

                        {/* --- CONTENU DU DOSSIER --- */}
                        <div className="flex-1 overflow-y-auto p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-16 bg-white">

                            <div className="lg:col-span-8 space-y-16">
                                {order.items.map((item: any) => {
                                    const isWorkshop = !!item.workshop;
                                    const validatedCount = item.participants.filter((p: any) => p.isValidated).length;
                                    const progress = (validatedCount / item.quantity) * 100;

                                    return (
                                        <section key={item.id} className="space-y-10">
                                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-emerald-600 pl-8">
                                                <div>
                                                    <h3 className="text-xs text-slate-400 font-black uppercase tracking-[0.3em] mb-3">Composition</h3>
                                                    <h4 className="text-4xl font-black text-black uppercase tracking-tighter leading-none">
                                                        {item.workshop ? item.workshop.title : item.volume?.product.name}
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Volume réservé</p>
                                                    <p className="text-2xl font-black text-black">{item.quantity} UNITÉS</p>
                                                </div>
                                            </div>

                                            {/* 🏺 MODULE COHORTE PRO (ÉMARGEMENT) */}
                                            {isWorkshop && order.isBusiness && (
                                                <div className="bg-slate-50 border-4 border-slate-100 rounded-[2.5rem] p-10 space-y-10 shadow-inner">
                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-end">
                                                            <div className="flex items-center gap-3">
                                                                <UserCheck className="text-emerald-600" size={24} strokeWidth={3} />
                                                                <p className="text-xs font-black uppercase tracking-widest text-black">Certification de Cohorte</p>
                                                            </div>
                                                            <p className="text-sm font-black text-emerald-700">
                                                                {validatedCount} / {item.quantity} PRÉSENCES SCELLÉES
                                                            </p>
                                                        </div>
                                                        <div className="h-4 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-inner">
                                                            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-emerald-600 shadow-[0_0_15px_rgba(5,150,105,0.4)]" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {item.participants.map((p: any, idx: number) => (
                                                            <ParticipantRow key={p.id} index={idx + 1} participant={p} isUpdating={updatingId === p.id} onCertify={(fn: string, ln: string) => handleCertifyParticipant(p.id, fn, ln)} />
                                                        ))}
                                                        {item.participants.length < item.quantity && (
                                                            <button onClick={() => handleAddParticipant(item.id)} className="w-full py-5 border-2 border-dashed border-slate-300 text-slate-400 hover:border-emerald-600 hover:text-emerald-600 rounded-3xl text-[11px] font-black uppercase transition-all flex items-center justify-center gap-3">
                                                                <PlusCircle size={18} /> Ajouter un participant ({item.participants.length + 1} / {item.quantity})
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* 🏺 MODULE PARTICULIERS & SALARIÉS CE */}
                                            {isWorkshop && !order.isBusiness && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {item.participants.map((p: any) => (
                                                        <div key={p.id} className="bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl flex items-center gap-4 border-l-4 border-emerald-600 shadow-sm transition-all hover:bg-white">
                                                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700">
                                                                <CheckCircle2 size={20} strokeWidth={3} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black uppercase text-black">{p.lastName} {p.firstName}</p>
                                                                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">
                                                                    {p.memberCode ? `Passeport : ${p.memberCode}` : 'Accès Individuel'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </section>
                                    );
                                })}
                            </div>

                            <div className="lg:col-span-4 border-l-4 border-slate-50 pl-12 space-y-12">
                                <section className="space-y-10 sticky top-0">
                                    <div className="flex items-center gap-4 border-l-4 border-black pl-4">
                                        {/* 🏺 ICONE FORCEE EN NOIR POUR VISIBILITÉ */}
                                        <UserCircle className="text-black" size={24} strokeWidth={3} />
                                        <h3 className="text-xs text-black font-black uppercase tracking-widest">Dossier Client</h3>
                                    </div>
                                    <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl space-y-8">
                                        <p className="text-2xl font-black uppercase border-b border-white/10 pb-6">
                                            {order.user.companyName || `${order.user.firstName} ${order.user.lastName}`}
                                        </p>
                                        <div className="space-y-5 text-[11px] font-black uppercase tracking-widest">
                                            <p className="flex items-center gap-4"><Mail className="text-emerald-400" size={18} strokeWidth={3} /> {order.user.email}</p>
                                            <p className="flex items-center gap-4"><Phone className="text-emerald-400" size={18} strokeWidth={3} /> {order.user.phone || 'Non renseigné'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-10 border-t-4 border-slate-50 text-right">
                                        <p className="text-6xl font-black text-black tracking-tighter leading-none">{order.total.toFixed(2)}€</p>
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

function ParticipantRow({ index, participant, onCertify, isUpdating }: any) {
    const [fn, setFn] = useState(participant.firstName || '');
    const [lastNameValue, setLastNameValue] = useState(participant.lastName || '');

    return (
        <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all ${participant.isValidated ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 shadow-sm'}`}>
            <span className="text-[10px] font-black text-slate-400 w-6">{index}.</span>

            {/* 🏺 INPUTS NOIRS SUR BLANC */}
            <input
                type="text"
                placeholder="PRÉNOM"
                value={fn}
                onChange={(e) => setFn(e.target.value.toUpperCase())}
                disabled={participant.isValidated}
                className="flex-1 bg-transparent border-b-2 border-slate-100 text-[11px] text-black font-black uppercase outline-none focus:border-emerald-500 disabled:opacity-50 transition-all placeholder:text-slate-300"
            />
            <input
                type="text"
                placeholder="NOM"
                value={lastNameValue}
                onChange={(e) => setLastNameValue(e.target.value.toUpperCase())}
                disabled={participant.isValidated}
                className="flex-1 bg-transparent border-b-2 border-slate-100 text-[11px] text-black font-black uppercase outline-none focus:border-emerald-500 disabled:opacity-50 transition-all placeholder:text-slate-300"
            />

            {participant.isValidated ? (
                <div className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-900/10">
                    <Check size={14} strokeWidth={4} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Certifié</span>
                </div>
            ) : (
                <button
                    onClick={() => onCertify(fn, lastNameValue)}
                    disabled={isUpdating || !fn || !lastNameValue}
                    className="flex items-center gap-3 px-8 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-emerald-600 disabled:opacity-20 transition-all shadow-lg active:scale-95"
                >
                    {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Valider
                </button>
            )}
        </div>
    );
}