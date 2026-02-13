// client/src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingCart, AlertTriangle, Users } from 'lucide-react';
import api from '../../api/axiosInstance';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Récupération des données agrégées
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-rhum-gold text-[10px] animate-pulse uppercase tracking-widest">Calcul des indicateurs...</div>;

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Tableau de Bord</h2>
                <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2">Indicateurs de performance</p>
            </header>

            {/* --- 📊 CARTES KPI --- */}
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
                    title="Alertes Stock"
                    value={stats?.lowStockAlerts.length}
                    icon={<AlertTriangle className={stats?.lowStockAlerts.length > 0 ? "text-red-400" : "text-rhum-gold/20"} />}
                />
                <StatCard
                    title="Nouveaux Clients"
                    value="--" // À implémenter avec une route spécifique
                    icon={<Users className="text-blue-400/40" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* --- ⚠️ ALERTES STOCKS BAS --- */}
                <div className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm">
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6 flex items-center gap-3">
                        <AlertTriangle size={14} /> Stocks Critiques
                    </h3>
                    <div className="space-y-4">
                        {stats?.lowStockAlerts.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-3">
                                <div>
                                    <p className="text-rhum-cream text-sm font-medium">{item.product.name}</p>
                                    <p className="text-[9px] text-rhum-gold/40 uppercase">{item.size}{item.unit}</p>
                                </div>
                                <span className="text-red-400 font-serif text-lg">{item.stock}</span>
                            </div>
                        ))}
                        {stats?.lowStockAlerts.length === 0 && (
                            <p className="text-[10px] text-rhum-cream/20 uppercase italic">Tous les nectars sont approvisionnés.</p>
                        )}
                    </div>
                </div>

                {/* --- 🕒 DERNIÈRES COMMANDES --- */}
                <div className="bg-white/[0.02] border border-rhum-gold/10 p-8 rounded-sm">
                    <h3 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6">Flux Récents</h3>
                    <div className="space-y-4">
                        {stats?.recentOrders.map((order: any) => (
                            <div key={order.id} className="flex justify-between items-center text-xs">
                                <span className="text-rhum-cream/60">{order.user.firstName} {order.user.lastName}</span>
                                <span className="text-rhum-gold font-bold">{order.total.toFixed(2)}€</span>
                                <span className="text-[8px] bg-rhum-gold/10 text-rhum-gold px-2 py-1 rounded-full uppercase tracking-tighter">
                                    {order.status}
                                </span>
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
            whileHover={{ y: -5 }}
            className="bg-white/[0.03] border border-rhum-gold/10 p-6 rounded-sm space-y-4"
        >
            <div className="flex justify-between items-start">
                <p className="text-[9px] uppercase tracking-[0.2em] text-rhum-gold/50 font-bold">{title}</p>
                {icon}
            </div>
            <p className="text-2xl font-serif text-white">{value}</p>
        </motion.div>
    );
}