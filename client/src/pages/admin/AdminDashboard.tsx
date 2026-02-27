import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    ArrowUpRight,
    AlertCircle,
    AlertTriangle,
    CheckCircle2
} from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-slate-500 text-xs uppercase tracking-[0.3em] font-black">Chargement du Registre...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 font-sans selection:bg-emerald-100">
            {/* --- EN-TÊTE ULTRA-LISIBLE --- */}
            <header className="flex justify-between items-center border-b-2 border-slate-100 pb-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Tableau de bord</h2>
                    <p className="text-xs text-emerald-600 uppercase tracking-widest mt-1 font-black">Rapport d'activité</p>
                </div>
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full shadow-lg shadow-emerald-900/20 font-black uppercase text-[10px] tracking-widest">
                    Février 2026
                </div>
            </header>

            {/* --- 📊 INDICATEURS CLÉS VIBRANTS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Chiffre d'Affaires"
                    value={`${stats?.totalRevenue.toFixed(2)}€`}
                    icon={<TrendingUp size={24} />}
                    colorClass="bg-emerald-50 text-emerald-600 border-emerald-100"
                    iconBg="bg-emerald-600 text-white"
                />
                <StatCard
                    title="Ventes Totales"
                    value={stats?.totalSales}
                    icon={<ShoppingCart size={24} />}
                    colorClass="bg-blue-50 text-blue-600 border-blue-100"
                    iconBg="bg-blue-600 text-white"
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard
                    title="Dossiers en attente"
                    value={stats?.pendingOrdersCount || 0}
                    icon={<AlertCircle size={24} />}
                    colorClass={stats?.pendingOrdersCount > 0 ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-400 border-slate-100"}
                    iconBg={stats?.pendingOrdersCount > 0 ? "bg-red-600 text-white animate-pulse" : "bg-slate-400 text-white"}
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard
                    title="Répertoire Clients"
                    value={stats?.totalUsers || "0"}
                    icon={<Users size={24} />}
                    colorClass="bg-amber-50 text-amber-600 border-amber-100"
                    iconBg="bg-amber-600 text-white"
                    onClick={() => navigate('/admin/customers')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* --- ⚠️ INVENTAIRE CRITIQUE --- */}
                <section className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-slate-900 text-xs uppercase tracking-widest font-black flex items-center gap-3">
                            <AlertTriangle size={18} className="text-red-600" />
                            Alerte Stocks
                        </h3>
                        <button
                            onClick={() => navigate('/admin/boutique')}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                        >
                            Gérer l'inventaire
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        {stats?.lowStockAlerts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-slate-900 text-sm font-black uppercase tracking-tighter">{item.product.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Format : {item.size} {item.unit}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-red-600 font-black text-2xl tracking-tighter">{item.stock}</span>
                                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                                            style={{ width: `${Math.min((item.stock / 5) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!stats?.lowStockAlerts || stats.lowStockAlerts.length === 0) && (
                            <div className="flex flex-col items-center py-12 gap-4">
                                <CheckCircle2 size={48} className="text-emerald-500" />
                                <p className="text-xs uppercase font-black tracking-widest text-slate-400 text-center">Inventaire 100% opérationnel</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- 🕒 RÉCENTES ARCHIVES --- */}
                <section className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                        <h3 className="text-slate-900 text-xs uppercase tracking-widest font-black">Flux du Registre</h3>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="text-[10px] text-emerald-600 font-black uppercase hover:underline underline-offset-4"
                        >
                            Tout consulter
                        </button>
                    </div>
                    <div className="p-8 space-y-6">
                        {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                            <div
                                key={order.id}
                                className="flex justify-between items-center group cursor-pointer p-2 hover:bg-slate-50 rounded-2xl transition-all"
                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                                        <ArrowUpRight size={20} />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 text-xs font-black uppercase tracking-tight">
                                            {order.user.firstName} {order.user.lastName}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-900 font-black text-base tracking-tighter">
                                        {order.total.toFixed(2)}€
                                    </p>
                                    <span className={`text-[8px] px-3 py-1 rounded-full font-black tracking-widest mt-2 inline-block ${
                                        order.status === 'FINALISÉ'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                            : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, onClick, colorClass, iconBg }: any) {
    return (
        <motion.div
            whileHover={onClick ? { scale: 1.02, y: -5 } : {}}
            onClick={onClick}
            className={`
                ${colorClass} border-2 p-8 rounded-3xl transition-all relative shadow-sm
                ${onClick ? 'cursor-pointer active:scale-95' : ''}
            `}
        >
            <div className="flex justify-between items-center mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black opacity-80">{title}</p>
                <div className={`${iconBg} p-3 rounded-2xl shadow-md`}>
                    {icon}
                </div>
            </div>
            <p className="text-4xl font-black tracking-tighter leading-none">{value}</p>
        </motion.div>
    );
}