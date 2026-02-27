import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Search, Package, GraduationCap, Filter, UserCheck, Building2, User } from 'lucide-react';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';

/**
 * 🏺 REGISTRE DES VENTES ET CERTIFICATIONS
 * Version Scellée : Séparation des Flux Institutionnels et Ventes Particuliers.
 */
export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('TOUS');
    const [activeTab, setActiveTab] = useState<'PRO' | 'USER'>('PRO'); // 🏺 Onglet par défaut : PRO
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
            console.error("Erreur de synchronisation du dossier.");
        }
    };

    /**
     * 🏺 Filtrage du Registre global
     */
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

    /**
     * 🏺 Pagination du Registre
     */
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
        <section className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            {/* --- EN-TÊTE DE DIRECTION --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Registre des Flux</h2>
                    <p className="text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">Pilotage des Ventes & Certification des Cohortes</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="bg-white border-2 border-slate-200 px-4 py-3 rounded-2xl flex items-center gap-3 w-full sm:min-w-[240px] shadow-sm">
                        <Filter size={16} className="text-emerald-600" strokeWidth={3} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-[11px] text-black font-black uppercase tracking-wider outline-none cursor-pointer w-full">
                            <option value="TOUS">Tous les statuts</option>
                            <option value="À TRAITER">⚠️ À Traiter</option>
                            <option value="SÉANCE PLANIFIÉE">📅 Séance Planifiée</option>
                            <option value="FINALISÉ">✅ Finalisé</option>
                        </select>
                    </div>

                    <div className="bg-white border-2 border-slate-200 px-6 py-3 rounded-2xl flex items-center gap-4 w-full sm:max-w-[260px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={18} className="text-emerald-600" strokeWidth={3} />
                        <input type="text" placeholder="RECHERCHER..." className="bg-transparent text-[11px] text-black outline-none w-full uppercase tracking-widest font-black placeholder:text-slate-300" onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                </div>
            </header>

            {/* --- SYSTÈME D'ONGLETS INSTITUTIONNELS --- */}
            <div className="flex gap-6 border-b-2 border-slate-100 pb-1">
                <button
                    onClick={() => setActiveTab('PRO')}
                    className={`flex items-center gap-3 pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'PRO' ? 'text-emerald-700 border-emerald-600' : 'text-slate-300 border-transparent hover:text-black'}`}
                >
                    <Building2 size={16} strokeWidth={3} /> Professionnels
                </button>
                <button
                    onClick={() => setActiveTab('USER')}
                    className={`flex items-center gap-3 pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'USER' ? 'text-emerald-700 border-emerald-600' : 'text-slate-300 border-transparent hover:text-black'}`}
                >
                    <User size={16} strokeWidth={3} /> Particuliers & CE
                </button>
            </div>

            {/* --- TABLEAU DU REGISTRE DYNAMIQUE --- */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                        <th className="py-6 px-10 font-black w-[25%]">Référence & Date</th>
                        <th className="py-6 px-10 font-black w-[25%]">Identité Client</th>
                        {/* Colonne Certification uniquement pour les PRO */}
                        {activeTab === 'PRO' && <th className="py-6 px-10 font-black text-center w-[15%]">Certification</th>}
                        <th className="py-6 px-10 font-black w-[15%]">Règlement</th>
                        <th className="py-6 px-10 font-black text-center w-[20%]">État Logistique</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                    {displayedOrders.map(order => {
                        const workshopItem = order.items.find((i: any) => i.workshopId);

                        // Calcul de progression pour l'affichage Pro
                        const validatedCount = workshopItem?.participants?.filter((p: any) => p.isValidated).length || 0;
                        const totalCount = workshopItem?.quantity || 0;
                        const isCertified = totalCount > 0 && validatedCount === totalCount;

                        return (
                            <tr key={order.id} onClick={() => setSelectedOrderId(order.id)} className="group hover:bg-slate-50/50 transition-all align-middle cursor-pointer">
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl flex-shrink-0 ${workshopItem ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {workshopItem ? <GraduationCap size={20} strokeWidth={2.5} /> : <Package size={20} strokeWidth={2.5} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-black text-base font-black uppercase tracking-tighter truncate">{order.reference}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-8 px-10">
                                    <p className="text-black text-sm font-black uppercase tracking-tight truncate">
                                        {order.user.companyName || `${order.user.firstName} ${order.user.lastName}`}
                                    </p>
                                    <p className="text-[10px] text-emerald-700 uppercase font-bold mt-1 truncate">{order.user.email}</p>
                                </td>

                                {activeTab === 'PRO' && (
                                    <td className="py-8 px-10 text-center">
                                        {workshopItem ? (
                                            <div className={`inline-flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl border-2 ${isCertified ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
                                                <div className="flex items-center gap-2">
                                                    <UserCheck size={12} className={isCertified ? 'text-emerald-600' : 'text-slate-400'} />
                                                    <span className={`text-[9px] font-black ${isCertified ? 'text-emerald-700' : 'text-slate-600'}`}>
                                                            {validatedCount} / {totalCount}
                                                        </span>
                                                </div>
                                            </div>
                                        ) : <span className="text-slate-300">—</span>}
                                    </td>
                                )}

                                <td className="py-8 px-10">
                                    <p className="text-black font-black text-lg tracking-tighter whitespace-nowrap">{order.total.toFixed(2)}€</p>
                                    {!order.isBusiness && order.user.isEmployee && (
                                        <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest block mt-1">Tarif CE Scellé</span>
                                    )}
                                </td>

                                <td className="py-8 px-10 text-center" onClick={(e) => e.stopPropagation()}>
                                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className={`text-[9px] border-2 px-4 py-2 rounded-xl uppercase font-black tracking-widest outline-none cursor-pointer shadow-sm w-full max-w-[140px] ${getStatusStyles(order.status)}`}>
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

                {filteredOrders.length === 0 && (
                    <div className="py-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">
                        Aucun dossier répertorié dans cette section.
                    </div>
                )}
            </div>

            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page: number) => setCurrentPage(page)} />

            <OrderDetailsModal isOpen={!!selectedOrderId} orderId={selectedOrderId} onClose={handleCloseModal} onRefresh={fetchOrders} />
        </section>
    );
}