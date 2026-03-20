import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { useAuthStore } from '../../store/authStore';

interface Participant {
    id?: string;
    firstName: string;
    lastName: string;
}

interface OrderItem {
    name: string | null;
    quantity: number;
    price: number;
    groupNames?: string | null;
    workshop?: { title: string };
    volume?: {
        size: string;
        unit: string;
        product: { name: string }
    };
    participants: Participant[];
}

interface Order {
    id: string;
    reference: string;
    createdAt: string;
    total: number;
    status: string;
    items: OrderItem[];
}

interface OrderHistoryProps {
    paymentSuccess?: boolean;
}

export default function OrderHistory({ paymentSuccess }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { user } = useAuthStore();
    const addToast = useToastStore(state => state.addToast);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            const validatedOrders = response.data.filter((order: Order) => {
                const status = order.status ? order.status.trim().toUpperCase() : '';
                return status === 'PAYÉ' || status === 'EN PRÉPARATION' || status === 'EN_ATTENTE_PAIEMENT';
            });
            setOrders(validatedOrders);
        } catch (err: any) {
            setError("Impossible d'accéder au registre de vos commandes.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Re-fetch si l'utilisateur revient d'un paiement Stripe (webhook peut être asynchrone)
    useEffect(() => {
        if (paymentSuccess) {
            setLoading(true);
            fetchOrders();
        }
    }, [paymentSuccess]);

    const handleDownloadPDF = async (orderId: string, reference: string) => {
        setDownloadingId(orderId);
        try {
            const response = await api.get(`/orders/${orderId}/download`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Justificatif_${reference}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            addToast("Le document a été généré avec succès.");
        } catch (err) {
            addToast("Échec de la génération.", "error");
        } finally {
            setDownloadingId(null);
        }
    };

    const getItemDisplayName = (item: OrderItem) => {
        if (item.groupNames === 'GIFT_CARD') return "CARTE CADEAU";
        if (item.name) return item.name;
        return item.workshop?.title || item.volume?.product?.name || "Article technique";
    };

    const getItemDetails = (item: OrderItem) => {
        if (item.groupNames === 'GIFT_CARD') return "CRÉDIT ÉTABLISSEMENT";
        if (item.volume) return `${item.volume.size}${item.volume.unit}`;
        return null;
    };

    const getStatusStyle = (status: string) => {
        const s = status.trim().toUpperCase();
        switch (s) {
            case 'PAYÉ': return 'border-green-500/40 text-green-400 bg-green-500/5';
            case 'EN PRÉPARATION': return 'border-rhum-gold/40 text-rhum-gold bg-rhum-gold/5';
            case 'EN_ATTENTE_PAIEMENT': return 'border-white/20 text-white/40 bg-white/5';
            default: return 'border-white/20 text-white/60';
        }
    };

    const getStatusLabel = (status: string) => {
        if (status.trim().toUpperCase() === 'EN_ATTENTE_PAIEMENT') return 'EN ATTENTE DE CONFIRMATION';
        return status;
    };

    if (loading) return <div className="text-rhum-gold animate-pulse text-[10px] uppercase tracking-widest p-10 font-black">Extraction du registre...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest p-10 font-black">{error}</div>;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 md:space-y-12 px-2 sm:px-0">
            {/* 🏺 HEADER : Harmonisé avec SecuritySettings */}
            <header className="mb-10 md:mb-16 border-b border-rhum-gold/10 pb-6 md:pb-8 flex flex-col items-center text-center">
                <h2 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tight">Historique des achats</h2>
                <p className="text-rhum-gold text-[8px] md:text-[9px] uppercase tracking-[0.4em] mt-2 md:mt-3 font-black">Suivi des réservations</p>
            </header>

            {orders.length === 0 ? (
                <div className="py-24 text-center border border-white/10 bg-white/[0.01] rounded-sm">
                    <p className="text-white/40 uppercase tracking-widest text-xs font-bold px-6">Aucune transaction validée enregistrée.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] border border-white/10 p-6 md:p-12 rounded-sm group hover:border-rhum-gold/40 transition-all duration-500"
                        >
                            {/* EN-TÊTE DE COMMANDE RESPONSIVE */}
                            <div className="flex flex-col xl:flex-row justify-between xl:items-start gap-8 border-b border-white/10 pb-8 mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-10">
                                    <div>
                                        <span className="text-[9px] md:text-[10px] text-rhum-gold font-black uppercase tracking-widest block mb-2">Référence Dossier</span>
                                        <p className="text-base md:text-lg font-mono text-white font-bold tracking-tighter">#{order.reference}</p>
                                    </div>
                                    <div>
                                        <span className="text-[9px] md:text-[10px] text-white/50 uppercase font-black block mb-2">Date d'achat</span>
                                        <p className="text-[10px] md:text-xs text-white font-bold uppercase tracking-widest">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                {/* ACTIONS : Empilement intelligent sur mobile */}
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <div className={`text-[9px] px-4 py-2 border font-black uppercase tracking-[0.2em] rounded-sm text-center ${getStatusStyle(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </div>
                                    <button
                                        onClick={() => handleDownloadPDF(order.id, order.reference)}
                                        disabled={downloadingId === order.id}
                                        className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-rhum-gold border border-rhum-gold/30 px-6 py-3.5 hover:bg-rhum-gold hover:text-rhum-green transition-all disabled:opacity-30 rounded-sm bg-white/5 sm:bg-transparent"
                                    >
                                        {downloadingId === order.id ? (
                                            <span className="animate-pulse uppercase">Génération...</span>
                                        ) : (
                                            <>
                                                <FileText size={14} />
                                                <span>Justificatif PDF</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* DÉTAILS DES ARTICLES */}
                            <div className="space-y-8 mb-10">
                                {order.items.map((item, index) => (
                                    <div key={index} className="space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-2 gap-4">
                                            <div className="min-w-0">
                                                <p className="text-lg md:text-xl text-white font-serif tracking-tight leading-tight truncate">
                                                    {getItemDisplayName(item)}
                                                </p>
                                                <p className="text-[9px] text-white/50 uppercase tracking-widest font-black mt-2">
                                                    {getItemDetails(item) && <span>{getItemDetails(item)} • </span>}
                                                    Quantité : {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm text-rhum-gold font-black">{(item.price * item.quantity).toFixed(2)}€</p>
                                        </div>

                                        {user?.role !== 'PRO' && item.participants && item.participants.length > 0 && (
                                            <div className="pl-4 md:pl-6 border-l-2 border-rhum-gold/30 py-1">
                                                <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold font-black mb-1.5">Participant(s) :</p>
                                                <p className="text-[10px] md:text-[11px] text-white font-bold uppercase tracking-tight leading-relaxed">
                                                    {item.participants.map(p => p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : "Bénéficiaire en attente").join(' • ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL GLOBAL */}
                            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white font-black">Total</span>
                                <p className="text-2xl md:text-4xl font-serif text-rhum-gold leading-none tracking-tighter">{Number(order.total).toFixed(2)}€</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}