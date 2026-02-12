import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { motion } from 'framer-motion';

// 🏺 Alignement sur le formatage du Backend (orderController.ts)
interface OrderItem {
    name: string;      // Le backend combine déjà titre/volume/unité
    quantity: number;
    price: number;
    participants: string[]; // Noms des voyageurs pour les ateliers
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
     * 🏺 Helper pour le style des statuts
     */
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

    if (loading) return <div className="text-rhum-gold/40 animate-pulse text-[10px] uppercase tracking-widest p-10">Lecture des registres...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest p-10">{error}</div>;

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-serif text-white uppercase tracking-tight">Historique d'achat</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold italic">
                    Retrait de flacon à l'Atelier uniquement
                </p>
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
                                    <span className={`text-[9px] px-3 py-1 border font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENU */}
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

                                        {/* 🏺 Affichage des participants si atelier */}
                                        {item.participants.length > 0 && (
                                            <div className="pl-4 border-l border-rhum-gold/10">
                                                <p className="text-[8px] uppercase tracking-widest text-rhum-gold/40 mb-1">Voyageurs enregistrés :</p>
                                                <p className="text-[10px] text-white/30 italic">
                                                    {item.participants.join(', ')}
                                                </p>
                                            </div>
                                        )}
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