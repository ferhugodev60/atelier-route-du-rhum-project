import { useState, useEffect } from 'react';
import { X, User, Mail, GraduationCap, ShoppingBag, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function CustomerDetailsModal({ isOpen, customerId, onClose, onRefresh }: any) {
    const [activeTab, setActiveTab] = useState<'cursus' | 'orders'>('cursus');
    const [fullData, setFullData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

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
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Erreur de validation");
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="bg-[#0a1a14] border border-rhum-gold/20 w-full max-w-3xl h-[80vh] flex flex-col rounded-sm shadow-2xl relative font-sans">
                <button onClick={onClose} className="absolute top-6 right-6 text-rhum-gold/40 hover:text-white z-10"><X size={24} /></button>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-rhum-gold uppercase tracking-[0.4em] text-[10px] animate-pulse">
                        <Loader2 className="animate-spin mr-3" size={14} /> Extraction du dossier...
                    </div>
                ) : (
                    <>
                        <header className="p-10 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-rhum-gold/10 rounded-full flex items-center justify-center border border-rhum-gold/20">
                                    <User size={28} className="text-rhum-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif text-white uppercase tracking-tight">
                                        {fullData.lastName} <span className="text-rhum-gold">{fullData.firstName}</span>
                                    </h2>
                                    <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] mt-1 flex items-center gap-2">
                                        <Mail size={10} /> {fullData.email}
                                    </p>
                                </div>
                            </div>

                            <nav className="flex gap-10 mt-10">
                                {[
                                    { id: 'cursus', label: 'Validation Cursus', icon: GraduationCap },
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

                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                            {activeTab === 'cursus' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-sm space-y-8">
                                        <div className="flex justify-between items-center">
                                            <p className="text-[9px] text-rhum-gold font-black uppercase tracking-widest">Statut Pédagogique Actuel</p>
                                            <span className="text-xs font-serif text-white">
                                                {fullData.conceptionLevel === 0 ? "Aucune Certification" : `Palier ${fullData.conceptionLevel} / 4`}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Ajout du niveau 0 pour réinitialiser le statut */}
                                            {[0, 1, 2, 3, 4].map((level) => (
                                                <button
                                                    key={level}
                                                    disabled={isUpdating}
                                                    onClick={() => handleLevelUpdate(level)}
                                                    className={`flex-1 py-5 border transition-all flex flex-col items-center gap-1 ${
                                                        fullData.conceptionLevel === level
                                                            ? 'bg-rhum-gold border-rhum-gold text-rhum-green font-black shadow-lg'
                                                            : 'bg-white/5 border-white/10 text-white/30 hover:border-rhum-gold/40 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="text-[8px] uppercase font-bold tracking-tighter">
                                                        {level === 0 ? "Initial" : "Niveau"}
                                                    </span>
                                                    <span className="text-2xl font-serif">{level}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/20 italic text-center leading-relaxed">
                                        Le Niveau 0 identifie un membre n'ayant pas encore validé de séance de conception technique au sein de l'établissement.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    {fullData.orders?.map((order: any) => (
                                        <div key={order.id} className="bg-white/[0.02] border border-white/5 p-6 flex justify-between items-center group hover:bg-white/[0.04] transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="p-3 bg-white/5 rounded-full text-rhum-gold/40 group-hover:text-rhum-gold transition-colors">
                                                    <ArrowUpRight size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white uppercase tracking-tight">{order.reference}</p>
                                                    <p className="text-[9px] text-white/20 uppercase mt-1">
                                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-rhum-gold font-serif text-lg">{order.total.toFixed(2)}€</p>
                                                <span className="text-[8px] border border-rhum-gold/20 text-rhum-gold px-2 py-0.5 rounded-sm uppercase font-black">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {fullData.orders?.length === 0 && (
                                        <div className="py-20 text-center text-white/10 font-serif italic">
                                            Aucun flux transactionnel répertorié.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}