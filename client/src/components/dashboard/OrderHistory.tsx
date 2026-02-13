import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'framer-motion';
import { useToastStore } from '../../store/toastStore';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    participants: string[];
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
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (err: any) {
                setError("Impossible d'accéder à votre historique de commandes.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    /**
     * Gère le téléchargement du justificatif PDF [cite: 2026-02-13]
     */
    const handleDownloadPDF = async (orderId: string, reference: string) => {
        setDownloadingId(orderId);
        try {
            const response = await api.get(`/orders/${orderId}/download`, {
                responseType: 'blob'
            });

            // Création du lien de téléchargement local
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Commande_${reference}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            addToast("Le document a été téléchargé avec succès.");
        } catch (err) {
            addToast("Erreur lors de la génération du document.", "error");
        } finally {
            setDownloadingId(null);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PAYÉ':
                return 'border-green-500/30 text-green-400 bg-green-500/5';
            case 'EN PRÉPARATION':
                return 'border-rhum-gold/30 text-rhum-gold bg-rhum-gold/5';
            default:
                return 'border-white/10 text-white/40';
        }
    };

    if (loading) return <div className="text-rhum-gold/40 animate-pulse text-[10px] uppercase tracking-widest p-10">Chargement des données...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest p-10">{error}</div>;

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Historique d'achat</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
                    Gestion de vos commandes et réservations
                </p>
            </header>

            {orders.length === 0 ? (
                <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
                    <p className="text-white/20 italic text-sm">Aucune commande enregistrée pour le moment.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.02] border border-white/5 p-5 md:p-8 rounded-sm group hover:border-rhum-gold/20 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                                    <div>
                                        <span className="text-[10px] text-rhum-gold font-black uppercase tracking-tighter">Référence</span>
                                        <p className="text-sm font-mono text-white/90">#{order.reference}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-white/30 uppercase block">Date</span>
                                        <p className="text-xs text-white/60">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`text-[9px] px-3 py-1 border font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                    {/* BOUTON DE TÉLÉCHARGEMENT PDF [cite: 2026-02-13] */}
                                    <button
                                        onClick={() => handleDownloadPDF(order.id, order.reference)}
                                        disabled={downloadingId === order.id}
                                        className="text-[9px] uppercase tracking-widest font-black text-rhum-gold border border-rhum-gold/20 px-4 py-2 hover:bg-rhum-gold/5 transition-all disabled:opacity-30"
                                    >
                                        {downloadingId === order.id ? 'Chargement...' : 'Justificatif PDF'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6 mb-6">
                                {order.items.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm md:text-base text-white/80 font-serif italic">
                                                {item.name}
                                                <span className="text-[10px] text-white/20 ml-2 not-italic">x{item.quantity}</span>
                                            </p>
                                            <p className="text-xs text-white/40">{(item.price * item.quantity).toFixed(2)}€</p>
                                        </div>

                                        {item.participants.length > 0 && (
                                            <div className="pl-4 border-l border-rhum-gold/10">
                                                <p className="text-[8px] uppercase tracking-widest text-rhum-gold/40 mb-1">Participants enregistrés :</p>
                                                <p className="text-[10px] text-white/30 italic">
                                                    {item.participants.join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-white/5">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Montant total réglé</span>
                                <p className="text-2xl md:text-3xl font-serif text-rhum-gold">{order.total.toFixed(2)}€</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}