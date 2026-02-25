import { useState, useEffect } from 'react';
import { X, User, Mail, GraduationCap, ShoppingBag, ArrowUpRight, Loader2, Phone, Fingerprint } from 'lucide-react';
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
            api.get(`/users/${customerId}`)
                .then(res => {
                    setFullData(res.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [isOpen, customerId]);

    const handleLevelUpdate = async (newLevel: number) => {
        setIsUpdating(true);
        try {
            await api.patch(`/users/${fullData.id}/level`, { newLevel });
            addToast(`Certification mise à jour : Palier technique ${newLevel} validé.`);
            onRefresh();
            onClose();
        } catch (error) {
            addToast("Échec de la validation du palier technique.", "error");
        } finally {
            setIsUpdating(false);
        }
    };

    /**
     * 🏺 Signalétique Institutionnelle Certifiée
     */
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'PAYÉ':
            case 'FINALISÉ':
                return 'border-green-500/30 text-green-500 bg-green-500/5';
            case 'ATELIER PLANIFIÉ':
                return 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5';
            case 'À TRAITER':
            case 'EN ATTENTE':
            default:
                return 'border-red-500/30 text-red-500 bg-red-500/5';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md font-sans selection:bg-rhum-gold/30">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-3xl h-[80vh] flex flex-col rounded-sm shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white z-10 transition-colors">
                    <X size={24} />
                </button>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-rhum-gold uppercase tracking-[0.4em] text-[10px] animate-pulse font-black">
                        <Loader2 className="animate-spin mr-3" size={14} /> Extraction du dossier...
                    </div>
                ) : (
                    <>
                        <header className="p-10 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-8">
                                <div className="w-20 h-20 bg-rhum-gold/10 rounded-full flex items-center justify-center border border-rhum-gold/20 shadow-xl">
                                    <User size={32} className="text-rhum-gold" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">
                                        {fullData.lastName} <span className="text-rhum-gold font-bold">{fullData.firstName}</span>
                                    </h2>

                                    {/* 🏺 Identification unique : Code Client */}
                                    <div className="flex items-center gap-2 mt-2 bg-rhum-gold/5 border border-rhum-gold/10 px-3 py-1.5 w-fit rounded-sm">
                                        <Fingerprint size={12} className="text-rhum-gold/60" />
                                        <span className="text-[11px] text-rhum-gold font-black uppercase tracking-[0.2em]">
                                            {fullData.memberCode || "Non Certifié"}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-1">
                                        <p className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                            <Mail size={12} className="text-rhum-gold/40" /> {fullData.email}
                                        </p>
                                        <p className="text-[11px] text-white/50 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                            <Phone size={12} className="text-rhum-gold/40" /> {fullData.phone || 'Non renseigné'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <nav className="flex gap-10 mt-10">
                                {[
                                    { id: 'cursus', label: 'Maîtrise Cursus', icon: GraduationCap },
                                    { id: 'orders', label: 'Historique Ventes', icon: ShoppingBag }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 pb-4 text-[10px] uppercase tracking-[0.2em] font-black transition-all border-b-2 ${
                                            activeTab === tab.id
                                                ? 'text-rhum-gold border-rhum-gold'
                                                : 'text-white/20 border-transparent hover:text-white/60'
                                        }`}
                                    >
                                        <tab.icon size={12} /> {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </header>

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-10">
                            {activeTab === 'cursus' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm space-y-8 shadow-inner">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-6">
                                            <p className="text-[10px] text-rhum-gold font-black uppercase tracking-widest">État de maîtrise technique</p>
                                            <span className="text-sm font-serif text-white font-bold uppercase tracking-widest">
                                                {fullData.conceptionLevel === 0 ? "Initié" : `Palier ${fullData.conceptionLevel} / 4`}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {[0, 1, 2, 3, 4].map((level) => (
                                                <button
                                                    key={level}
                                                    disabled={isUpdating}
                                                    onClick={() => handleLevelUpdate(level)}
                                                    className={`flex-1 py-6 border transition-all flex flex-col items-center gap-2 rounded-sm ${
                                                        fullData.conceptionLevel === level
                                                            ? 'bg-rhum-gold border-rhum-gold text-rhum-green font-black shadow-lg shadow-rhum-gold/20'
                                                            : 'bg-white/5 border-white/10 text-white/30 hover:border-rhum-gold/40 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="text-[9px] uppercase font-black tracking-tighter">
                                                        {level === 0 ? "Départ" : "Palier"}
                                                    </span>
                                                    <span className="text-3xl font-serif">{level}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-white/20 text-center leading-relaxed font-sans font-black uppercase tracking-widest px-10">
                                        L'ajustement manuel du palier technique permet de réguler l'accès aux formations de niveau supérieur pour ce membre.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {fullData.orders?.map((order: any) => (
                                        <div
                                            key={order.id}
                                            onClick={() => setSelectedOrderId(order.id)}
                                            className="bg-white/[0.02] border border-white/5 p-6 flex justify-between items-center group hover:bg-white/[0.05] hover:border-rhum-gold/30 transition-all cursor-pointer rounded-sm shadow-sm"
                                        >
                                            <div className="flex items-center gap-8">
                                                <div className="p-4 bg-white/5 rounded-full text-rhum-gold/40 group-hover:text-rhum-gold group-hover:bg-rhum-gold/10 transition-colors border border-white/5">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-widest group-hover:text-rhum-gold transition-colors">{order.reference}</p>
                                                    <p className="text-[11px] text-white/40 uppercase mt-2 font-black tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right space-y-2">
                                                <p className="text-rhum-gold font-serif text-xl font-bold">{order.total.toFixed(2)}€</p>
                                                <span className={`inline-block text-[8px] px-3 py-1 border font-black uppercase tracking-widest rounded-sm ${getStatusStyles(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {fullData.orders?.length === 0 && (
                                        <div className="py-24 text-center text-white/10 uppercase tracking-[0.3em] text-xs font-black">
                                            Aucun flux transactionnel répertorié au sein du registre.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <OrderDetailsModal
                isOpen={!!selectedOrderId}
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
            />
        </div>
    );
}