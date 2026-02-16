import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, ArrowUpRight } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // 🏺 Limite de 10 dossiers par page

    const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data));
    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    // 🏺 Calcul de la pagination
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const displayedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    return (
        <section className="space-y-10 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre des Ventes</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Retraits et Réservations</p>
                </div>

                {/* 🏺 Barre de recherche réduite à 260px pour plus d'élégance */}
                <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-[260px]">
                    <Search size={14} className="text-rhum-gold/40" />
                    <input
                        type="text"
                        placeholder="RECHERCHER..."
                        className="bg-transparent text-[10px] text-white outline-none w-full uppercase tracking-widest"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Référence & Date</th>
                        <th className="py-6 px-8 font-black">Identité Client</th>
                        <th className="py-6 px-8 font-black">Règlement</th>
                        <th className="py-6 px-8 font-black">État du Retrait</th>
                        <th className="py-6 px-8 font-black text-right">Dossier</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {displayedOrders.map(order => (
                        <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-6 px-8">
                                <p className="text-white text-sm font-bold uppercase">{order.reference}</p>
                                <p className="text-[8px] text-white/20 uppercase mt-1 tracking-widest">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </td>
                            <td className="py-6 px-8">
                                <p className="text-rhum-cream text-xs font-medium uppercase">{order.user.firstName} {order.user.lastName}</p>
                                <p className="text-[8px] text-rhum-gold/40 uppercase">{order.user.email}</p>
                            </td>
                            <td className="py-6 px-8">
                                <p className="text-rhum-gold font-serif text-lg">{order.total.toFixed(2)}€</p>
                            </td>
                            <td className="py-6 px-8">
                                    <span className={`text-[8px] border px-3 py-1 rounded-sm uppercase font-black tracking-widest ${
                                        order.status === 'CLÔTURÉ' ? 'border-green-400/20 text-green-400' : 'border-rhum-gold/20 text-rhum-gold'
                                    }`}>
                                        {order.status}
                                    </span>
                            </td>
                            <td className="py-6 px-8 text-right">
                                <button
                                    onClick={() => setSelectedOrderId(order.id)}
                                    className="p-3 bg-white/5 text-rhum-gold/40 hover:text-white transition-all rounded-full"
                                >
                                    <ArrowUpRight size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            <OrderDetailsModal
                isOpen={!!selectedOrderId}
                orderId={selectedOrderId}
                onClose={() => setSelectedOrderId(null)}
                onRefresh={fetchOrders}
            />
        </section>
    );
}