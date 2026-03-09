import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'framer-motion';
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

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const { user } = useAuthStore();
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (err: any) {
                setError("Impossible d'accéder au registre de vos commandes.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleDownloadPDF = async (orderId: string, reference: string) => {
        setDownloadingId(orderId);
        try {
            const response = await api.get(`/orders/${orderId}/download`, {
                responseType: 'blob'
            });

            // 🏺 CORRECTION CRITIQUE : Utilisez directement response.data
            const url = window.URL.createObjectURL(response.data);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Justificatif_${reference}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Nettoyage
            link.remove();
            window.URL.revokeObjectURL(url);
            addToast("Le document a été généré avec succès.");
        } catch (err) {
            addToast("Échec de la génération.", "error");
        } finally {
            setDownloadingId(null);
        }
    };

    /**
     * 🏺 SCELLAGE DU NOM D'AFFICHAGE
     * Résout le bug "undefined" en identifiant le flux correct.
     */
    const getItemDisplayName = (item: OrderItem) => {
            // 1. Priorité au type GIFT_CARD
            if (item.groupNames === 'GIFT_CARD') return "CARTE CADEAU";

            // 2. Si le nom est scellé en base, on l'utilise
            if (item.name) return item.name;

            // 3. Fallback intelligent si le nom manque (Anciennes commandes)
            return item.workshop?.title || item.volume?.product?.name || "Article technique";
        };

    /**
     * 🏺 SCELLAGE DES DÉTAILS TECHNIQUES
     * Supprime "SÉANCE TECHNIQUE" pour les bouteilles et évite le (undefinedundefined).
     */
    const getItemDetails = (item: OrderItem) => {
        if (item.groupNames === 'GIFT_CARD') return "CRÉDIT ÉTABLISSEMENT";
        if (item.volume) return `${item.volume.size}${item.volume.unit}`;
        return null; // Pas de label superflu pour les ateliers
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAYÉ': return 'border-green-500/40 text-green-400 bg-green-500/5';
            case 'EN PRÉPARATION': return 'border-rhum-gold/40 text-rhum-gold bg-rhum-gold/5';
            default: return 'border-white/20 text-white/60';
        }
    };

    if (loading) return <div className="text-rhum-gold animate-pulse text-[10px] uppercase tracking-widest p-10 font-black">Extraction du registre...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest p-10 font-black">{error}</div>;

    return (
        <div className="space-y-12">
            <header className="mb-10">
                <h2 className="text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">Historique des achats</h2>
                <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mt-3 font-black opacity-70">Suivi des réservations</p>
            </header>

            {orders.length === 0 ? (
                <div className="py-24 text-center border border-white/10 bg-white/[0.01] rounded-sm">
                    <p className="text-white/40 uppercase tracking-widest text-xs font-bold">Aucune transaction enregistrée.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.map((order) => (
                        <motion.div key={order.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-sm group hover:border-rhum-gold/40 transition-all duration-500">
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-8 border-b border-white/10 pb-8 mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-10">
                                    <div>
                                        <span className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block mb-2">Référence Dossier</span>
                                        <p className="text-lg font-mono text-white font-bold tracking-tighter">#{order.reference}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/30 uppercase font-bold block mb-2">Date de Scellage</span>
                                        <p className="text-xs text-white font-bold uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`text-[9px] px-4 py-1.5 border font-black uppercase tracking-[0.2em] rounded-sm ${getStatusStyle(order.status)}`}>{order.status}</span>
                                    <button onClick={() => handleDownloadPDF(order.id, order.reference)} disabled={downloadingId === order.id} className="text-[10px] uppercase tracking-[0.2em] font-black text-rhum-gold border border-rhum-gold/30 px-6 py-3 hover:bg-rhum-gold hover:text-rhum-green transition-all disabled:opacity-30 rounded-sm">
                                        {downloadingId === order.id ? 'GÉNÉRATION...' : 'Justificatif PDF'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                {order.items.map((item, index) => (
                                    <div key={index} className="space-y-4">
                                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                                            <div>
                                                <p className="text-lg md:text-xl text-white font-serif tracking-tight leading-none">
                                                    {getItemDisplayName(item)}
                                                </p>
                                                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mt-2">
                                                    {getItemDetails(item) && <span>{getItemDetails(item)} • </span>}
                                                    Quantité : {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-sm text-rhum-gold font-bold">{(item.price * item.quantity).toFixed(2)}€</p>
                                        </div>

                                        {user?.role !== 'PRO' && item.participants && item.participants.length > 0 && (
                                            <div className="pl-6 border-l-2 border-rhum-gold/20 py-1">
                                                <p className="text-[9px] uppercase tracking-widest text-rhum-gold font-black mb-2 opacity-60">Identités Scellées :</p>
                                                <p className="text-[11px] text-white/60 font-bold uppercase tracking-tight">
                                                    {item.participants.map(p => p.firstName && p.lastName ? `${p.firstName} ${p.lastName}` : "Bénéficiaire en attente").join(' • ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-white/5">
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">Investissement Global</span>
                                <p className="text-3xl md:text-4xl font-serif text-rhum-gold leading-none tracking-tighter">{Number(order.total).toFixed(2)}€</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}