import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Package, GraduationCap, Filter, Calendar, CreditCard } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TOUS');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data));
    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Erreur de synchronisation du dossier.");
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'TOUS' || o.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const displayedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'FINALISÉ': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
            case 'SÉANCE PLANIFIÉE': return 'bg-amber-100 text-amber-900 border-amber-200';
            case 'À TRAITER':
            default: return 'bg-red-100 text-red-900 border-red-200';
        }
    };

    return (
        <section className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Registre des Ventes</h2>
                    <p className="text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">Suivi des Retraits & Séances Certifiées</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="bg-white border-2 border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-3 w-full sm:min-w-[240px] shadow-sm">
                        <Filter size={16} className="text-emerald-600" strokeWidth={3} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent text-[11px] text-black font-black uppercase tracking-wider outline-none cursor-pointer w-full"
                        >
                            <option value="TOUS">Tous les dossiers</option>
                            <option value="À TRAITER">⚠️ À Traiter</option>
                            <option value="SÉANCE PLANIFIÉE">📅 Séance Planifiée</option>
                            <option value="FINALISÉ">✅ Finalisé</option>
                        </select>
                    </div>

                    <div className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 w-full sm:max-w-[260px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={18} className="text-emerald-600" strokeWidth={3} />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            className="bg-transparent text-[11px] text-black outline-none w-full uppercase tracking-widest font-black placeholder:text-slate-300"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                        <th className="py-6 px-10 font-black">Référence & Date</th>
                        <th className="py-6 px-10 font-black">Identité Client</th>
                        <th className="py-6 px-10 font-black">Règlement</th>
                        <th className="py-6 px-10 font-black text-center">État du Dossier</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                    {displayedOrders.map(order => {
                        const hasWorkshop = order.items.some((i: any) => i.workshopId);
                        return (
                            <tr
                                key={order.id}
                                onClick={() => setSelectedOrderId(order.id)}
                                className="group hover:bg-slate-50/50 transition-all align-middle cursor-pointer"
                            >
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${hasWorkshop ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {hasWorkshop ? <GraduationCap size={20} strokeWidth={2.5} /> : <Package size={20} strokeWidth={2.5} />}
                                        </div>
                                        <div>
                                            <p className="text-black text-base font-black uppercase tracking-tighter">{order.reference}</p>
                                            <div className="flex items-center gap-2 mt-1 text-slate-400">
                                                <Calendar size={10} />
                                                <p className="text-[10px] uppercase font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-10">
                                    <p className="text-black text-sm font-black uppercase tracking-tight">{order.user.firstName} {order.user.lastName}</p>
                                    <p className="text-[10px] text-emerald-700 uppercase font-bold mt-1">{order.user.email}</p>
                                </td>
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-2">
                                        <CreditCard size={14} className="text-slate-400" />
                                        <p className="text-black font-black text-lg tracking-tighter">{order.total.toFixed(2)}€</p>
                                    </div>
                                </td>
                                <td className="py-8 px-10 text-center" onClick={(e) => e.stopPropagation()}>
                                    {/* 🏺 Le stopPropagation() empêche l'ouverture de la modale lors du changement de statut */}
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`text-[9px] border-2 px-4 py-2 rounded-xl uppercase font-black tracking-widest outline-none cursor-pointer transition-all shadow-sm ${getStatusStyles(order.status)}`}
                                    >
                                        <option value="À TRAITER">À Traiter</option>
                                        <option value="SÉANCE PLANIFIÉE">Séance Planifiée</option>
                                        <option value="FINALISÉ">Finalisé</option>
                                    </select>
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
                onPageChange={(page: number) => setCurrentPage(page)}
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