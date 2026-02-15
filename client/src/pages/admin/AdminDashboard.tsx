import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, AlertTriangle, Users, ArrowUpRight } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            <div className="text-rhum-gold text-[10px] animate-pulse uppercase tracking-[0.5em]">
                Analyse des indicateurs en cours...
            </div>
        </div>
    );

    return (
        <div className="space-y-12 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Console de Gestion</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Rapport d'activité consolidé</p>
                </div>
            </header>

            {/* --- 📊 INDICATEURS CLÉS --- */}
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
                />
                <StatCard
                    title="Alertes Stocks"
                    value={stats?.lowStockAlerts.length}
                    icon={<AlertTriangle className={stats?.lowStockAlerts.length > 0 ? "text-red-400 animate-pulse" : "text-rhum-gold/20"} />}
                />
                <StatCard
                    title="Clientèle"
                    value={stats?.totalUsers || "0"}
                    icon={<Users className="text-rhum-gold" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* --- ⚠️ INVENTAIRE CRITIQUE --- */}
                <div className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm shadow-xl">
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-black mb-8 border-b border-white/5 pb-4 flex items-center justify-between">
                        Stocks à Réapprovisionner
                        <AlertTriangle size={12} className="opacity-40" />
                    </h3>
                    <div className="space-y-5">
                        {stats?.lowStockAlerts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center group">
                                <div>
                                    <p className="text-rhum-cream text-xs font-medium group-hover:text-rhum-gold transition-colors">{item.product.name}</p>
                                    <p className="text-[9px] text-rhum-gold/40 uppercase">{item.size}{item.unit}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-red-400 font-serif text-xl">{item.stock}</span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-400" style={{ width: `${(item.stock / 5) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {stats?.lowStockAlerts.length === 0 && (
                            <p className="text-[10px] text-rhum-cream/20 uppercase italic text-center py-6">Inventaire parfaitement approvisionné.</p>
                        )}
                    </div>
                </div>

                {/* --- 🕒 DERNIÈRES TRANSACTIONS --- */}
                <div className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm shadow-xl">
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black mb-8 border-b border-white/5 pb-4">
                        Flux de Ventes Récents
                    </h3>
                    <div className="space-y-6">
                        {stats?.recentOrders.map((order: any) => (
                            <div key={order.id} className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-full">
                                        <ArrowUpRight size={12} className="text-rhum-gold opacity-30 group-hover:opacity-100 transition-all" />
                                    </div>
                                    <div>
                                        <p className="text-rhum-cream text-[10px] font-bold uppercase">{order.user.firstName} {order.user.lastName}</p>
                                        <p className="text-[8px] text-white/20 uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-rhum-gold font-serif text-sm font-bold">{order.total.toFixed(2)}€</p>
                                    <span className="text-[7px] border border-rhum-gold/20 text-rhum-gold px-2 py-0.5 rounded-sm uppercase font-black">
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

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
    return (
        <motion.div
            whileHover={{ y: -4, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            className="bg-white/[0.03] border border-rhum-gold/10 p-8 rounded-sm space-y-4 transition-all"
        >
            <div className="flex justify-between items-start">
                <p className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-black">{title}</p>
                {icon}
            </div>
            <p className="text-3xl font-serif text-white tracking-tight">{value}</p>
        </motion.div>
    );
}