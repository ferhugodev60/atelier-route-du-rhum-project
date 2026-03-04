import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X, Calendar, Loader2, UserCircle, Phone,
    Mail, PlusCircle, Award, ShieldCheck, GraduationCap,
    Check, FileText
} from 'lucide-react';
import api from '../../api/axiosInstance';

/**
 * 📜 DOSSIER DE VENTE ET CERTIFICATION (ADMIN)
 * Version avec Feedback Visuel : Animation de scellage et gestion de succès.
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

    /** 🏺 SCELLAGE DU NIVEAU TECHNIQUE (CURSUS) */
    const handleUpdateUserLevel = async (userId: string, targetLevel: number, participantId: string) => {
        if (!userId) return false;
        setUpdatingId(participantId);
        try {
            await api.patch(`/users/${userId}/level`, { level: Number(targetLevel) });
            await fetchOrderDetails(); // Rafraîchit le Registre pour mettre à jour isLevelMastered
            if (onRefresh) onRefresh();
            return true; // 🏺 Indispensable pour déclencher l'animation de succès
        } catch (error) {
            console.error("❌ Échec du scellage.");
            return false;
        } finally {
            setUpdatingId(null);
        }
    };

    /** 🏺 AJOUT MANUEL D'UN EMPLACEMENT */
    const handleAddManualParticipant = async (orderItemId: string) => {
        try {
            await api.post('/orders/items/participants/manual', { orderItemId });
            fetchOrderDetails();
        } catch (error) {
            console.error("❌ Échec de l'ajout manuel.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md font-sans">
            <div className="bg-white border-4 border-slate-200 w-full max-w-7xl h-[92vh] flex flex-col rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] relative overflow-hidden text-black">

                <button onClick={onClose} className="absolute top-10 right-10 text-slate-300 hover:text-emerald-600 z-20 transition-all focus:outline-none">
                    <X size={40} strokeWidth={3} />
                </button>

                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-600 mb-6" size={56} strokeWidth={3} />
                        <p className="text-black font-black uppercase tracking-[0.3em] text-[10px] italic">Audit du Registre...</p>
                    </div>
                ) : (
                    <>
                        <header className="p-12 md:p-16 border-b-8 border-slate-50 bg-white shrink-0">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-emerald-600">
                                        <FileText size={20} strokeWidth={3} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Infrastructure Administrative</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-black uppercase tracking-tighter leading-none">
                                        Dossier <span className="text-emerald-600">{order.reference}</span>
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end gap-3 font-black uppercase tracking-widest text-[10px]">
                                    <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-100">
                                        <Calendar size={18} className="text-emerald-600" />
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                    <div className={`px-6 py-3 rounded-2xl border-2 ${order.status === 'FINALISÉ' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className="flex-1 overflow-y-auto p-12 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-20 bg-white">
                            <div className="lg:col-span-8 space-y-24 text-black">
                                {order.items.map((item: any) => {
                                    const targetLevel = item.workshop?.level || 0;
                                    const activeParticipants = item.participants.filter((p: any) => p.isValidated);

                                    return (
                                        <section key={item.id} className="space-y-12">
                                            <div className="flex justify-between items-end border-l-[12px] border-emerald-600 pl-10">
                                                <div className="space-y-4">
                                                    <h3 className="text-xs text-slate-400 font-black uppercase tracking-[0.3em]">Séance Technique</h3>
                                                    <h4 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                                                        {item.workshop?.title || "Produit Boutique"}
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    {item.workshop && (
                                                        <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 mb-2">
                                                            <GraduationCap size={16} className="text-emerald-600" />
                                                            <span className="text-[10px] font-black text-emerald-800 uppercase">Niveau Cible : {targetLevel}</span>
                                                        </div>
                                                    )}
                                                    <p className="text-3xl font-black text-black uppercase">{item.quantity} UNITÉS</p>
                                                </div>
                                            </div>

                                            {item.workshop && (
                                                <div className="bg-slate-50 border-4 border-slate-100 rounded-[3.5rem] p-12 space-y-10 shadow-inner">
                                                    <div className="flex justify-between items-center px-4">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Membres Certifiés à la Cohorte</p>
                                                        <span className="text-xs font-black text-black">{activeParticipants.length} / {item.quantity} Présents</span>
                                                    </div>

                                                    <div className="space-y-6">
                                                        {activeParticipants.length > 0 ? (
                                                            activeParticipants.map((p: any, idx: number) => (
                                                                <ParticipantRow
                                                                    key={p.id}
                                                                    index={idx + 1}
                                                                    participant={p}
                                                                    targetLevel={targetLevel}
                                                                    isUpdating={updatingId === p.id}
                                                                    onLevelUp={() => handleUpdateUserLevel(p.userId, targetLevel, p.id)}
                                                                />
                                                            ))
                                                        ) : (
                                                            <div className="py-20 text-center border-4 border-dashed border-slate-200 rounded-[2.5rem]">
                                                                <p className="text-[11px] text-slate-300 font-black uppercase tracking-[0.4em]">En attente de scellage par QR Code...</p>
                                                            </div>
                                                        )}

                                                        {item.participants.length < item.quantity && (
                                                            <button
                                                                onClick={() => handleAddManualParticipant(item.id)}
                                                                className="w-full py-6 border-4 border-dashed border-slate-200 text-slate-300 hover:border-emerald-600 hover:text-emerald-600 hover:bg-white rounded-[2.5rem] text-[11px] font-black uppercase transition-all flex items-center justify-center gap-4"
                                                            >
                                                                <PlusCircle size={20} /> Ajouter manuellement
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </section>
                                    );
                                })}
                            </div>

                            <div className="lg:col-span-4 border-l-8 border-slate-50 pl-16 space-y-16">
                                <section className="space-y-12 sticky top-12">
                                    <div className="flex items-center gap-6 border-l-[6px] border-black pl-6">
                                        <UserCircle size={32} strokeWidth={3} className="text-black" />
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Acheteur</h3>
                                    </div>
                                    <div className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl space-y-10">
                                        <p className="text-3xl font-black uppercase border-b border-white/10 pb-10 leading-none tracking-tighter">
                                            {order.user.companyName || `${order.user.firstName} ${order.user.lastName}`}
                                        </p>
                                        <div className="space-y-8 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
                                            <p className="flex items-center gap-6 truncate"><Mail size={20} /> {order.user.email}</p>
                                            <p className="flex items-center gap-6"><Phone size={20} /> {order.user.phone || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-16 border-t-8 border-slate-50 text-right">
                                        <p className="text-7xl font-black text-black tracking-tighter leading-none">{order.total.toFixed(2)}€</p>
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

/** 🏺 LIGNE DE MEMBRE AVEC FEEDBACK DE SCELLAGE */
function ParticipantRow({ index, participant, onLevelUp, isUpdating, targetLevel }: any) {
    const [isSuccess, setIsSuccess] = useState(false);

    const isScanned = !!participant.userId;
    const currentLevel = participant.user?.conceptionLevel || 0;
    const isLevelMastered = currentLevel >= targetLevel;

    const handleAction = async () => {
        const success = await onLevelUp();
        if (success) {
            setIsSuccess(true);
            // On laisse le message de succès 3 secondes avant de laisser le bouton définitif
            setTimeout(() => setIsSuccess(false), 3000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col xl:flex-row items-center gap-10 p-10 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            <span className="text-[11px] font-black text-slate-200 w-10">{index}.</span>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-4">
                    <p className="text-2xl font-black uppercase text-black truncate tracking-tighter">
                        {participant.firstName} {participant.lastName}
                    </p>
                    {isScanned && (
                        <span className="bg-slate-900 text-white text-[9px] px-3 py-1 rounded-lg font-black flex items-center gap-2 uppercase">
                            <ShieldCheck size={12} className="text-emerald-400" /> Scanné
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <p className="text-emerald-700">Passeport : {participant.memberCode || 'N/A'}</p>
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                    <p>Cursus : Niveau {currentLevel}</p>
                </div>
            </div>

            <div className="shrink-0 min-w-[240px]">
                {isScanned ? (
                    <button
                        onClick={handleAction}
                        disabled={isLevelMastered || isUpdating || isSuccess}
                        className={`flex items-center justify-center gap-4 px-10 py-5 rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl border-4 w-full ${
                            isSuccess
                                ? 'bg-emerald-600 border-emerald-600 text-white' // 🏺 État : Succès (Vert)
                                : isLevelMastered
                                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed shadow-none' // 🏺 État : Grisé (Acquis)
                                    : 'bg-white border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white' // 🏺 État : À faire
                        }`}
                    >
                        {isUpdating ? <Loader2 size={20} className="animate-spin" /> :
                            isSuccess ? <Check size={20} strokeWidth={4} /> :
                                <Award size={20} />}

                        {isSuccess ? "Niveau Scellé !" : isLevelMastered ? `Niveau ${targetLevel} Acquis` : `Sceller Niveau ${targetLevel}`}
                    </button>
                ) : (
                    <div className="bg-slate-50 px-8 py-4 rounded-2xl border-2 border-slate-100">
                        <span className="text-[10px] font-black uppercase text-slate-300 italic tracking-[0.2em]">En attente de scan...</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}