import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, ArrowUpRight, Package, GraduationCap } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data));
    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    /**
     * 🏺 GESTION SIMPLIFIÉE DU REGISTRE
     * Passage binaire entre l'action requise et la clôture du dossier
     */
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Erreur de synchronisation du dossier");
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o =>
            o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const displayedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    // 🏺 Signalétique binaire : Alerte ou Réussite
    const getStatusStyles = (status: string) => {
        if (status === 'FINALISÉ') {
            return 'border-green-500/30 text-green-500 bg-green-500/5';
        }
        return 'border-red-500/30 text-red-500 bg-red-500/5';
    };

    return (
        <section className="space-y-10 font-sans selection:bg-rhum-gold/30">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre des Ventes</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Suivi des Retraits et Formations Techniques</p>
                </div>

                <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-[260px]">
                    <Search size={14} className="text-rhum-gold/40" />
                    <input
                        type="text"
                        placeholder="RECHERCHER..."
                        className="bg-transparent text-[10px] text-white outline-none w-full uppercase tracking-widest font-black"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Référence & Nature</th>
                        <th className="py-6 px-8 font-black">Identité Client</th>
                        <th className="py-6 px-8 font-black">Règlement</th>
                        <th className="py-6 px-8 font-black">État du Dossier</th>
                        <th className="py-6 px-8 font-black text-right">Détails</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {displayedOrders.map(order => {
                        const hasWorkshop = order.items.some((i: any) => i.workshopId);

                        return (
                            <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-6 px-8">
                                    <div className="flex items-center gap-3">
                                        {hasWorkshop ?
                                            <GraduationCap size={14} className="text-rhum-gold/60" /> :
                                            <Package size={14} className="text-white/20" />
                                        }
                                        <p className="text-white text-sm font-bold uppercase tracking-tight">{order.reference}</p>
                                    </div>
                                    <p className="text-[8px] text-white/20 uppercase mt-1 tracking-widest font-black">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="py-6 px-8">
                                    <p className="text-rhum-cream text-xs font-bold uppercase">{order.user.firstName} {order.user.lastName}</p>
                                    <p className="text-[8px] text-rhum-gold/40 uppercase font-black tracking-tighter">{order.user.email}</p>
                                </td>
                                <td className="py-6 px-8">
                                    <p className="text-rhum-gold font-serif text-lg">{order.total.toFixed(2)}€</p>
                                </td>
                                <td className="py-6 px-8">
                                    <div className="flex items-center gap-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`text-[9px] border px-4 py-2 rounded-sm uppercase font-black tracking-widest bg-transparent outline-none cursor-pointer transition-all ${getStatusStyles(order.status)}`}
                                        >
                                            <option value="À TRAITER" className="bg-[#0a1a14] text-red-500 font-black">À Traiter</option>
                                            <option value="CLIENT CONTACTé" className="bg-[#0a1a14] text-yellow-500 font-black">CLIENT CONTACTé</option>
                                            <option value="FINALISÉ" className="bg-[#0a1a14] text-green-500 font-black">Finalisé</option>
                                        </select>
                                    </div>
                                </td>
                                <td className="py-6 px-8 text-right">
                                    <button
                                        onClick={() => setSelectedOrderId(order.id)}
                                        className="p-3 bg-white/5 text-rhum-gold/40 hover:text-white transition-all rounded-full border border-white/5"
                                    >
                                        <ArrowUpRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
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