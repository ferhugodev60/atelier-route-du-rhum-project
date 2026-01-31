import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';

interface OrderItem {
    name: string;
    quantity: number;
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
                const response = await api.get('/orders');
                setOrders(response.data);
            } catch (err: any) {
                setError("Impossible de récupérer vos grimoires de commande.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-rhum-gold/40 animate-pulse uppercase text-[10px] tracking-widest">Lecture des registres...</div>;
    if (error) return <div className="text-red-400 text-[10px] uppercase tracking-widest">{error}</div>;

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Historique d'achat</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Retrait de bouteille à l'Atelier uniquement</p>
            </header>

            {orders.length === 0 ? (
                <p className="text-white/20 italic text-sm">Aucune commande n'a encore été distillée.</p>
            ) : (
                <>
                    {/* VERSION MOBILE : LISTE DE CARTES */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                                    <div>
                                        <p className="text-[10px] text-rhum-gold font-black uppercase tracking-tighter">#{order.reference}</p>
                                        <p className="text-[10px] text-white/40 uppercase">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <span className="text-[8px] px-2 py-1 border border-white/10 text-white/60 uppercase font-black">{order.status}</span>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item, i) => (
                                        <p key={i} className="text-xs text-white/80 font-serif italic">
                                            {item.name} <span className="text-[9px] opacity-30">x{item.quantity}</span>
                                        </p>
                                    ))}
                                </div>
                                <p className="text-lg font-bold text-rhum-gold text-right">{order.total.toFixed(2)}€</p>
                            </div>
                        ))}
                    </div>

                    {/* VERSION DESKTOP : TABLEAU CLASSIQUE */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-white/5">
                            <tr>
                                <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black">Référence</th>
                                <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black">Contenu</th>
                                <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black text-right">Total</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-6">
                                        <p className="text-[11px] font-mono text-white/80">#{order.reference}</p>
                                        <p className="text-[10px] text-white/30 uppercase">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </td>
                                    <td className="py-6">
                                        {order.items.map((item, i) => (
                                            <p key={i} className="text-sm text-white/60 font-serif italic">{item.name} (x{item.quantity})</p>
                                        ))}
                                    </td>
                                    <td className="py-6 text-right">
                                        <p className="text-sm font-bold text-rhum-gold">{order.total.toFixed(2)}€</p>
                                        <span className="text-[8px] text-white/40 uppercase tracking-tighter">{order.status}</span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}