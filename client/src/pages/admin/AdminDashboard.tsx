import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    ArrowUpRight,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    CalendarDays,
    FileSearch,
    Globe,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🏺 Paramètres Temporels
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // 🏺 Micro-pagination (Hauteur Fixe)
    const [stockPage, setStockPage] = useState(1);
    const [orderPage, setOrderPage] = useState(1);
    const itemsPerPage = 4;

    const years = useMemo(() => {
        const start = stats?.earliestYear || 2024;
        const length = currentYear - start + 1;
        return Array.from({ length }, (_, i) => start + i).reverse();
    }, [stats?.earliestYear, currentYear]);

    const months = [
        { v: 1, n: 'Janvier' }, { v: 2, n: 'Février' }, { v: 3, n: 'Mars' },
        { v: 4, n: 'Avril' }, { v: 5, n: 'Mai' }, { v: 6, n: 'Juin' },
        { v: 7, n: 'Juillet' }, { v: 8, n: 'Août' }, { v: 9, n: 'Septembre' },
        { v: 10, n: 'Octobre' }, { v: 11, n: 'Novembre' }, { v: 12, n: 'Décembre' }
    ];

    const displayedMonths = useMemo(() => {
        if (selectedYear === 0) return [];
        if (selectedYear === currentYear) return months.filter(m => m.v <= currentMonth);
        return months;
    }, [selectedYear, currentYear, currentMonth]);

    useEffect(() => {
        setLoading(true);
        api.get(`/admin/stats?month=${selectedMonth}&year=${selectedYear}`)
            .then(res => {
                setStats(res.data);
                setLoading(false);
                setStockPage(1);
                setOrderPage(1);
            })
            .catch(() => setLoading(false));
    }, [selectedMonth, selectedYear]);

    const paginatedStock = useMemo(() => {
        const start = (stockPage - 1) * itemsPerPage;
        return stats?.lowStockAlerts?.slice(start, start + itemsPerPage) || [];
    }, [stats, stockPage]);

    const paginatedOrders = useMemo(() => {
        const start = (orderPage - 1) * itemsPerPage;
        return stats?.recentOrders?.slice(start, start + itemsPerPage) || [];
    }, [stats, orderPage]);

    if (loading && !stats) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-black text-[10px] font-black uppercase tracking-widest italic">Audit du Registre...</p>
        </div>
    );

    const hasData = stats?.totalSales > 0;

    return (
        <div className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            {/* --- EN-TÊTE --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-2 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-black text-black tracking-tighter uppercase">Console de Gestion</h2>
                    <p className="text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">
                        {selectedYear === 0 ? "Consolidation Globale" : `${months.find(m => m.v === selectedMonth)?.n || 'Année'} ${selectedYear}`}
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white border-2 border-slate-200 p-1.5 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl">
                        {selectedYear === 0 ? <Globe size={16} className="text-emerald-400" /> : <CalendarDays size={16} className="text-emerald-400" />}
                        <span className="text-[9px] font-black uppercase tracking-widest">Période</span>
                    </div>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-transparent text-black font-black uppercase text-[11px] outline-none cursor-pointer px-2">
                        <option value={0}>Tout le Registre</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {selectedYear !== 0 && (
                        <>
                            <div className="w-px h-6 bg-slate-200 mx-2" />
                            <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-transparent text-black font-black uppercase text-[11px] outline-none cursor-pointer px-2">
                                <option value={0}>Année complète</option>
                                {displayedMonths.map(m => <option key={m.v} value={m.v}>{m.n}</option>)}
                            </select>
                        </>
                    )}
                </div>
            </header>

            {/* --- 📊 INDICATEURS SUR FOND BLANC --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title={selectedMonth === 0 ? "CA TOTAL" : `CA ${months.find(m => m.v === selectedMonth)?.n.toUpperCase()}`}
                    value={`${stats?.totalRevenue.toFixed(2)}€`}
                    icon={<TrendingUp size={24} />}
                />
                <StatCard
                    title="VOLUME VENTES"
                    value={stats?.totalSales}
                    icon={<ShoppingCart size={24} />}
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard
                    title="À TRAITER"
                    value={stats?.pendingOrdersCount || 0}
                    icon={<AlertCircle size={24} />}
                    onClick={() => navigate('/admin/orders')}
                    isAlert={stats?.pendingOrdersCount > 0}
                />
                <StatCard
                    title="MEMBRES ACTIFS"
                    value={stats?.totalUsers || "0"}
                    icon={<Users size={24} />}
                    onClick={() => navigate('/admin/customers')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* ALERTE STOCK */}
                <section className="bg-white border-2 border-slate-100 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[520px]">
                    <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-white shrink-0">
                        <h3 className="text-black text-xs uppercase tracking-widest font-black flex items-center gap-3">
                            <AlertTriangle size={18} className="text-red-600" strokeWidth={2.5} /> Alerte Stocks
                        </h3>
                        <button onClick={() => navigate('/admin/boutique')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-emerald-600 transition-all">Gérer le Registre</button>
                    </div>

                    <div className="p-8 space-y-6 flex-1 overflow-hidden">
                        {stats?.lowStockAlerts.length > 0 ? paginatedStock.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                                <div>
                                    <p className="text-black text-sm font-black uppercase tracking-tight truncate max-w-[200px]">{item.product.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold mt-1">Format : {item.size} {item.unit}</p>
                                </div>
                                <span className="text-red-600 font-black text-xl tracking-tighter">{item.stock}</span>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full gap-3">
                                <CheckCircle2 size={48} className="text-emerald-500 opacity-20" />
                                <p className="text-[10px] uppercase font-black text-slate-400">Inventaire certifié</p>
                            </div>
                        )}
                    </div>

                    {stats?.lowStockAlerts.length > itemsPerPage && (
                        <div className="p-4 border-t border-slate-50 flex justify-center gap-4 bg-slate-50/30">
                            <button onClick={() => setStockPage(p => Math.max(1, p - 1))} disabled={stockPage === 1} className="p-2 text-black disabled:opacity-20 hover:text-emerald-600 transition-colors"><ChevronLeft size={18} strokeWidth={3} /></button>
                            <span className="text-[10px] font-black flex items-center uppercase">Page {stockPage}</span>
                            <button onClick={() => setStockPage(p => p + 1)} disabled={stockPage * itemsPerPage >= stats.lowStockAlerts.length} className="p-2 text-black disabled:opacity-20 hover:text-emerald-600 transition-colors"><ChevronRight size={18} strokeWidth={3} /></button>
                        </div>
                    )}
                </section>

                {/* FLUX DE PÉRIODE (Correction 404 ici) */}
                <section className="bg-white border-2 border-slate-100 rounded-3xl shadow-lg overflow-hidden flex flex-col h-[520px]">
                    <div className="p-8 border-b-2 border-slate-50 flex items-center justify-between bg-white shrink-0">
                        <h3 className="text-black text-xs uppercase tracking-widest font-black flex items-center gap-3">
                            <FileSearch size={18} className="text-emerald-600" strokeWidth={2.5} /> Flux de la période
                        </h3>
                        {hasData && <button onClick={() => navigate('/admin/orders')} className="text-[10px] text-emerald-700 font-black uppercase hover:underline underline-offset-4">Voir tout</button>}
                    </div>

                    <div className="p-8 space-y-6 flex-1 overflow-hidden">
                        {hasData ? paginatedOrders.map((order: any) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-all"
                                onClick={() => navigate(`/admin/orders?id=${order.id}`)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
                                        <ArrowUpRight size={20} strokeWidth={3} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-black text-sm font-black uppercase tracking-tight truncate">
                                            {order.user.firstName} {order.user.lastName}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-black font-black text-base tracking-tighter ml-4 shrink-0">
                                    {order.total.toFixed(2)}€
                                </p>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-300">
                                <FileSearch size={54} strokeWidth={1} />
                                <p className="text-[11px] uppercase font-black tracking-widest">Aucun mouvement</p>
                            </div>
                        )}
                    </div>

                    {stats?.recentOrders.length > itemsPerPage && (
                        <div className="p-4 border-t border-slate-50 flex justify-center gap-4 bg-slate-50/30">
                            <button onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={orderPage === 1} className="p-2 text-black disabled:opacity-20 hover:text-emerald-600 transition-colors"><ChevronLeft size={18} strokeWidth={3} /></button>
                            <span className="text-[10px] font-black flex items-center uppercase">Page {orderPage}</span>
                            <button onClick={() => setOrderPage(p => p + 1)} disabled={orderPage * itemsPerPage >= stats.recentOrders.length} className="p-2 text-black disabled:opacity-20 hover:text-emerald-600 transition-colors"><ChevronRight size={18} strokeWidth={3} /></button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, onClick, isAlert }: any) {
    return (
        <motion.div
            whileHover={onClick ? { scale: 1.02, y: -4 } : {}}
            onClick={onClick}
            className={`
                bg-white border-2 p-7 rounded-3xl transition-all relative shadow-sm
                ${onClick ? 'cursor-pointer active:scale-95' : ''}
                ${isAlert ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-100'}
            `}
        >
            <div className="flex justify-between items-center mb-6">
                <p className={`text-[10px] uppercase tracking-[0.2em] font-black ${isAlert ? 'text-red-600' : 'text-slate-400'}`}>
                    {title}
                </p>
                <div className={`p-3 rounded-2xl shadow-sm ${isAlert ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl font-black text-black tracking-tighter leading-none">{value}</p>
        </motion.div>
    );
}