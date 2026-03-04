import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Search, Package, GraduationCap, Filter, Building2, User } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';

/**
 * 🏺 REGISTRE DES FLUX (ÉDITION COMPACTE)
 * Optimisé pour les petits écrans afin de limiter le défilement horizontal.
 */
export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TOUS');
    const [activeTab, setActiveTab] = useState<'PRO' | 'USER'>('USER');
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [searchParams, setSearchParams] = useSearchParams();

    const fetchOrders = () => api.get('/orders').then(res => setOrders(res.data));

    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => {
        const idFromUrl = searchParams.get('id');
        if (idFromUrl) setSelectedOrderId(idFromUrl);
    }, [searchParams]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, activeTab]);

    const handleCloseModal = () => {
        setSelectedOrderId(null);
        setSearchParams({});
    };

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            console.error("Erreur de synchronisation au Registre.");
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                `${o.user.firstName} ${o.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.user.companyName && o.user.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = statusFilter === 'TOUS' || o.status === statusFilter;
            const matchesTab = activeTab === 'PRO' ? o.isBusiness : !o.isBusiness;
            return matchesSearch && matchesStatus && matchesTab;
        });
    }, [orders, searchTerm, statusFilter, activeTab]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const displayedOrders = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(start, start + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'FINALISÉ': return 'bg-emerald-100 text-emerald-900 border-emerald-200';
            case 'SÉANCE PLANIFIÉE': return 'bg-amber-100 text-amber-900 border-amber-200';
            default: return 'bg-red-100 text-red-900 border-red-200';
        }
    };

    return (
        <section className="space-y-6 md:space-y-10 font-sans selection:bg-emerald-100 pb-10">
            {/* --- EN-TÊTE RESPONSIVE --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter uppercase">Registre des Flux</h2>
                    <p className="text-[9px] md:text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">Pilotage des Ventes & Paliers Techniques</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    <div className="bg-white border-2 border-slate-200 px-3 py-2 md:px-4 md:py-3 rounded-xl flex items-center gap-2 w-full sm:min-w-[200px] shadow-sm">
                        <Filter size={14} className="text-emerald-600" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-[10px] text-black font-black uppercase outline-none cursor-pointer w-full">
                            <option value="TOUS">Tous statuts</option>
                            <option value="À TRAITER">⚠️ À Traiter</option>
                            <option value="SÉANCE PLANIFIÉE">📅 Planifiée</option>
                            <option value="FINALISÉ">✅ Finalisé</option>
                        </select>
                    </div>

                    <div className="bg-white border-2 border-slate-200 px-4 py-2 md:py-3 rounded-xl flex items-center gap-3 w-full sm:max-w-[220px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={16} className="text-emerald-600" />
                        <input type="text" placeholder="RECHERCHER..." className="bg-transparent text-[10px] text-black outline-none w-full uppercase font-black placeholder:text-slate-300" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </header>

            {/* --- ONGLETS COMPACTS --- */}
            <div className="flex gap-4 md:gap-8 border-b-2 border-slate-100">
                <button onClick={() => setActiveTab('USER')} className={`flex items-center gap-2 pb-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-4 ${activeTab === 'USER' ? 'text-emerald-700 border-emerald-600' : 'text-slate-300 border-transparent'}`}>
                    <User size={14} /> Particuliers
                </button>
                <button onClick={() => setActiveTab('PRO')} className={`flex items-center gap-2 pb-3 text-[10px] font-black uppercase tracking-wider transition-all border-b-4 ${activeTab === 'PRO' ? 'text-emerald-700 border-emerald-600' : 'text-slate-300 border-transparent'}`}>
                    <Building2 size={14} /> Entreprises
                </button>
            </div>

            {/* --- TABLEAU COMPACT --- */}
            <div className="bg-white border-2 border-slate-100 rounded-2xl shadow-lg overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                    <tr className="bg-slate-50 text-[9px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                        <th className="py-4 px-6 font-black w-[28%]">Dossier & Date</th>
                        <th className="py-4 px-6 font-black w-[32%]">Membre</th>
                        <th className="py-4 px-6 font-black w-[15%]">Total</th>
                        <th className="py-4 px-6 font-black text-center w-[25%]">
                            {activeTab === 'PRO' ? "Membres" : "Logistique"}
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {displayedOrders.map(order => {
                        const workshopItem = order.items.find((i: any) => i.workshopId);
                        const validatedCount = workshopItem?.participants?.filter((p: any) => p.isValidated).length || 0;
                        const totalCount = workshopItem?.quantity || 0;
                        const isCertified = totalCount > 0 && validatedCount === totalCount;

                        return (
                            <tr key={order.id} onClick={() => setSelectedOrderId(order.id)} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${workshopItem ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {workshopItem ? <GraduationCap size={16} /> : <Package size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-black text-xs font-black uppercase truncate">{order.reference}</p>
                                            <p className="text-[9px] text-slate-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-black text-xs font-black uppercase truncate leading-tight">
                                        {order.user.companyName || `${order.user.firstName} ${order.user.lastName}`}
                                    </p>
                                    <p className="text-[9px] text-emerald-700 font-bold truncate">{order.user.email}</p>
                                </td>
                                <td className="py-4 px-6">
                                    <p className="text-black font-black text-sm tracking-tight">{order.total.toFixed(2)}€</p>
                                </td>
                                <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                                    {activeTab === 'PRO' ? (
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 md:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                                    <div className={`h-full ${isCertified ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${(validatedCount / totalCount) * 100}%` }} />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-600">{validatedCount}/{totalCount}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`text-[8px] border-2 px-3 py-1.5 rounded-lg uppercase font-black outline-none cursor-pointer w-full max-w-[120px] ${getStatusStyles(order.status)}`}>
                                            <option value="À TRAITER">À Traiter</option>
                                            <option value="SÉANCE PLANIFIÉE">Planifiée</option>
                                            <option value="FINALISÉ">Finalisé</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => setCurrentPage(page)} />
            <OrderDetailsModal isOpen={!!selectedOrderId} orderId={selectedOrderId} onClose={handleCloseModal} onRefresh={fetchOrders} />
        </section>
    );
}