import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'framer-motion';

// 🏺 Typage précis des relations Prisma
interface OrderItem {
    id: string;
    quantity: number;
    priceAtPurchase: number;
    productVolume?: {
        size: number;
        unit: string;
        product: { name: string };
    };
    workshop?: {
        title: string;
    };
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Appel à votre route GET /api/orders
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (err: any) {
                setError("Impossible de consulter les registres de l'Atelier.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    /**
     * 🏺 Helper pour formater le nom de l'article selon son type
     */
    const getItemName = (item: OrderItem) => {
        if (item.workshop) return item.workshop.title;
        if (item.productVolume) {
            const { product, size, unit } = item.productVolume;
            return `${product.name} (${size} ${unit})`;
        }
        return "Article inconnu";
    };

    if (loading) return <div className="text-rhum-gold/40 animate-pulse text-[10px] uppercase tracking-widest p-10">Lecture des registres...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest p-10">{error}</div>;

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-serif text-white uppercase tracking-tight">Historique d'achat</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Retrait de bouteille à l'Atelier uniquement</p>
            </header>

            {orders.length === 0 ? (
                <div className="py-20 text-center border border-white/5 bg-white/[0.01]">
                    <p className="text-white/20 italic text-sm">"Aucune commande n'a encore été distillée."</p>
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
                            {/* EN-TÊTE DE COMMANDE */}
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/5 pb-6 mb-6">
                                <div>
                                    <span className="text-[10px] text-rhum-gold font-black uppercase tracking-tighter">Référence</span>
                                    <p className="text-sm font-mono text-white/90">#{order.reference}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-white/30 uppercase block">Date de scellé</span>
                                    <p className="text-xs text-white/60">
                                        {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="md:text-right">
                                    <span className={`text-[9px] px-3 py-1 border font-black uppercase tracking-widest ${
                                        order.status === 'COMPLETED' ? 'border-green-500/30 text-green-400 bg-green-500/5' : 'border-white/10 text-white/40'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENU */}
                            <div className="space-y-4 mb-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <p className="text-sm md:text-base text-white/80 font-serif italic">
                                            {getItemName(item)}
                                            <span className="text-[10px] text-white/20 ml-2 not-italic">x{item.quantity}</span>
                                        </p>
                                        <p className="text-xs text-white/40">{(item.priceAtPurchase * item.quantity).toFixed(2)}€</p>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL */}
                            <div className="flex justify-between items-end pt-4 border-t border-white/5">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white/20">Total de la transaction</span>
                                <p className="text-2xl md:text-3xl font-serif text-rhum-gold">{order.total.toFixed(2)}€</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}