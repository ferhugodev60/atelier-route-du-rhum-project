import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, Users, ArrowUpRight, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
        <div className="flex items-center justify-center h-64">
            <div className="text-rhum-gold text-[10px] animate-pulse uppercase tracking-[0.5em] font-black">
                Analyse des indicateurs en cours...
            </div>
        </div>
    );

    return (
        <div className="space-y-12 font-sans selection:bg-rhum-gold/30">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Console de Gestion</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Rapport d'activité consolidé</p>
                </div>
            </header>

            {/* --- 📊 INDICATEURS CLÉS INTERACTIFS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Chiffre d'Affaires"
                    value={`${stats?.totalRevenue.toFixed(2)}€`}
                    icon={<TrendingUp className="text-green-400" />}
                />
                <StatCard
                    title="Ventes Totales"
                    value={stats?.totalSales}
                    icon={<ShoppingCart className="text-rhum-gold" />}
                    onClick={() => navigate('/admin/orders')}
                />
                {/* 🏺 KPI PRIORITAIRE : DOSSIERS À TRAITER */}
                <StatCard
                    title="Dossiers à Traiter"
                    value={stats?.pendingOrdersCount || 0}
                    icon={<AlertCircle className={stats?.pendingOrdersCount > 0 ? "text-red-500 animate-pulse" : "text-rhum-gold/20"} />}
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard
                    title="Clientèle"
                    value={stats?.totalUsers || "0"}
                    icon={<Users className="text-rhum-gold" />}
                    onClick={() => navigate('/admin/customers')}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* --- ⚠️ INVENTAIRE CRITIQUE (RÉTABLI) --- */}
                <div
                    onClick={() => navigate('/admin/boutique')}
                    className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm shadow-xl cursor-pointer hover:bg-white/[0.04] transition-all"
                >
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-black mb-8 border-b border-white/5 pb-4 flex items-center justify-between">
                        Stocks à Réapprovisionner
                        <AlertTriangle size={12} className="text-red-500 opacity-60" />
                    </h3>
                    <div className="space-y-5">
                        {stats?.lowStockAlerts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div>
                                    <p className="text-rhum-cream text-xs font-bold uppercase group-hover:text-rhum-gold transition-colors tracking-tight">
                                        {item.product.name}
                                    </p>
                                    <p className="text-[9px] text-rhum-gold/40 uppercase font-black mt-1">
                                        Format : {item.size} {item.unit}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-red-500 font-serif text-xl font-bold">{item.stock}</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${(item.stock / 5) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!stats?.lowStockAlerts || stats.lowStockAlerts.length === 0) && (
                            <div className="flex flex-col items-center py-10 gap-3">
                                <CheckCircle2 size={24} className="text-green-500/20" />
                                <p className="text-[10px] text-rhum-cream/20 uppercase font-black tracking-widest text-center">Inventaire parfaitement approvisionné</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- 🕒 FLUX DE VENTES RÉCENTS --- */}
                <div
                    onClick={() => navigate('/admin/orders')}
                    className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm shadow-xl cursor-pointer hover:bg-white/[0.04] transition-all"
                >
                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                        <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black">
                            Dernières Archives du Registre
                        </h3>
                        <span className="text-[8px] text-white/20 uppercase font-black tracking-widest">
                            5 derniers flux
                        </span>
                    </div>
                    <div className="space-y-6">
                        {stats?.recentOrders?.slice(0, 5).map((order: any) => (
                            <div key={order.id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-full">
                                        <ArrowUpRight size={12} className="text-rhum-gold opacity-30 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <div>
                                        <p className="text-rhum-cream text-[10px] font-bold uppercase tracking-tight">
                                            {order.user.firstName} {order.user.lastName}
                                        </p>
                                        <p className="text-[8px] text-white/20 uppercase tracking-widest font-black mt-1">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-rhum-gold font-serif text-sm font-bold leading-none mb-1">
                                        {order.total.toFixed(2)}€
                                    </p>
                                    {/* 🏺 Statut binaire : À TRAITER ou FINALISÉ */}
                                    <span className={`text-[7px] border px-2 py-0.5 rounded-sm uppercase font-black tracking-widest ${
                                        order.status === 'FINALISÉ' ? 'border-green-500/20 text-green-500' : 'border-red-500/20 text-red-500'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, onClick }: { title: string, value: any, icon: React.ReactNode, onClick?: () => void }) {
    return (
        <motion.div
            whileHover={onClick ? { y: -4, backgroundColor: "rgba(255, 255, 255, 0.04)" } : {}}
            onClick={onClick}
            className={`bg-white/[0.03] border border-rhum-gold/10 p-8 rounded-sm space-y-4 transition-all ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
        >
            <div className="flex justify-between items-start">
                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-black">{title}</p>
                {icon}
            </div>
            <p className="text-3xl font-serif text-white tracking-tight leading-none">{value}</p>
        </motion.div>
    );
}