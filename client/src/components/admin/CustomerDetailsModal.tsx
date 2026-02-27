import { useState, useEffect } from 'react';
import { X, User, Mail, GraduationCap, ShoppingBag, ArrowUpRight, Loader2, Phone, Fingerprint, ShieldCheck } from 'lucide-react';
import api from '../../api/axiosInstance';
import OrderDetailsModal from './OrderDetailsModal';
import { useToastStore } from '../../store/toastStore';

export default function CustomerDetailsModal({ isOpen, customerId, onClose, onRefresh }: any) {
    const [activeTab, setActiveTab] = useState<'cursus' | 'orders'>('cursus');
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const addToast = useToastStore(state => state.addToast);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && customerId) {
            setLoading(true);
            api.get(`/users/${customerId}`).then(res => {
                setFullData(res.data);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [isOpen, customerId]);

    const handleLevelUpdate = async (newLevel: number) => {
        setIsUpdating(true);
        try {
            await api.patch(`/users/${fullData.id}/level`, { newLevel });
            addToast(`Certification mise à jour : Niveau technique ${newLevel} scellé.`);
            onRefresh();
            onClose();
        } catch (error) {
            addToast("Échec de la validation technique.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md font-sans">
            <div className="bg-white border-4 border-slate-200 w-full max-w-4xl h-[85vh] flex flex-col rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.3)] relative overflow-hidden">
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
                        <header className="p-10 md:p-14 border-b-4 border-slate-50 bg-white relative z-10">
                            <div className="flex items-center gap-10">
                                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl">
                                    <User size={40} className="text-white" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-black text-black uppercase tracking-tighter leading-none">
                                        {fullData.lastName} <span className="text-emerald-600">{fullData.firstName}</span>
                                    </h2>

                                    <div className="flex items-center gap-3 mt-4 bg-emerald-50 border-2 border-emerald-100 px-4 py-2 w-fit rounded-xl">
                                        <Fingerprint size={16} className="text-emerald-700" strokeWidth={3} />
                                        <span className="text-[11px] text-emerald-800 font-black uppercase tracking-widest">
                                            {fullData.memberCode || "IDENTITÉ NON CERTIFIÉE"}
                                        </span>
                                    </div>

                                    <div className="mt-6 flex gap-8">
                                        <p className="text-[11px] text-slate-900 uppercase tracking-widest font-black flex items-center gap-2">
                                            <Mail size={14} className="text-emerald-600" strokeWidth={3} /> {fullData.email}
                                        </p>
                                        <p className="text-[11px] text-slate-900 uppercase tracking-widest font-black flex items-center gap-2">
                                            <Phone size={14} className="text-emerald-600" strokeWidth={3} /> {fullData.phone || 'NON RENSEIGNÉ'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex gap-12 mt-12">
                                {[
                                    { id: 'cursus', label: 'Certification Cursus', icon: GraduationCap },
                                    { id: 'orders', label: 'Historique des Flux', icon: ShoppingBag }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-3 pb-4 text-[11px] uppercase tracking-widest font-black transition-all border-b-4 ${
                                            activeTab === tab.id
                                                ? 'text-emerald-600 border-emerald-600'
                                                : 'text-slate-300 border-transparent hover:text-black'
                                        }`}
                                    >
                                        <tab.icon size={16} strokeWidth={3} /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </header>

                        <div className="flex-1 overflow-y-auto p-10 md:p-14 bg-white relative z-10">
                            {activeTab === 'cursus' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                    <div className="bg-slate-50 border-2 border-slate-100 p-10 rounded-3xl space-y-10">
                                        <div className="flex justify-between items-center border-b-2 border-white pb-6">
                                            <p className="text-xs text-black font-black uppercase tracking-widest">Maîtrise Technique Actuelle</p>
                                            <span className="text-lg text-emerald-700 font-black uppercase tracking-tighter">
                                                {fullData.conceptionLevel === 0 ? "Initié" : `Niveau ${fullData.conceptionLevel} / 4 certifié`}
                                            </span>
                                        </div>
                                        <div className="flex gap-4">
                                            {[0, 1, 2, 3, 4].map((level) => (
                                                <button
                                                    key={level}
                                                    disabled={isUpdating}
                                                    onClick={() => handleLevelUpdate(level)}
                                                    className={`flex-1 py-8 border-4 transition-all flex flex-col items-center gap-3 rounded-2xl shadow-sm ${
                                                        fullData.conceptionLevel === level
                                                            ? 'bg-emerald-600 border-emerald-700 text-white font-black shadow-lg shadow-emerald-900/20'
                                                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'
                                                    }`}
                                                >
                                                    <span className="text-[10px] uppercase font-black tracking-tighter">
                                                        {level === 0 ? "ACCÈS" : "Niveau"}
                                                    </span>
                                                    <span className="text-4xl font-black">{level}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-100">
                                        <ShieldCheck className="text-emerald-700 flex-shrink-0" size={20} strokeWidth={3} />
                                        <p className="text-[11px] text-emerald-900 font-bold uppercase tracking-widest leading-relaxed">
                                            L'ajustement du palier technique modifie instantanément les privilèges d'accès du membre au sein du Registre.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                                    {fullData.orders?.map((order: any) => (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="bg-white border-2 border-slate-100 p-8 flex justify-between items-center group hover:border-emerald-500 hover:shadow-xl transition-all cursor-pointer rounded-2xl"
                                        >
                                            <div className="flex items-center gap-10">
                                                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-emerald-600 transition-colors">
                                                    <ArrowUpRight size={22} strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-black uppercase tracking-tighter">{order.reference}</p>
                                                    <p className="text-[11px] text-slate-500 uppercase mt-1.5 font-bold tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-black font-black text-2xl tracking-tighter">{order.total.toFixed(2)}€</p>
                                                <span className={`inline-block text-[9px] px-3 py-1 border-2 font-black uppercase tracking-widest rounded-lg mt-2 ${
                                                    order.status === 'FINALISÉ' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {fullData.orders?.length === 0 && (
                                        <div className="py-24 text-center text-slate-300 uppercase tracking-widest text-xs font-black">
                                            AUCUN FLUX TRANSACTIONNEL RÉPERTORIÉ AU REGISTRE.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <OrderDetailsModal isOpen={!!selectedOrderId} orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
        </div>
    );
}