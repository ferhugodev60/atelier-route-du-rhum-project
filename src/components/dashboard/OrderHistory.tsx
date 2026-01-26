export default function OrderHistory() {
    const orders = [
        { id: 'ORD-2026-X1', date: '24/01/2026', total: '124.00€', status: 'En préparation' },
        { id: 'ORD-2025-A9', date: '12/12/2025', total: '45.00€', status: 'Livré' },
    ];

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-serif text-white">Historique de la Cave</h2>
                <p className="text-white/40 text-xs mt-1 italic">Retrouvez le détail de vos commandes passées.</p>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                    <tr>
                        <th className="py-4 text-[9px] uppercase tracking-widest text-rhum-gold/50">Référence</th>
                        <th className="py-4 text-[9px] uppercase tracking-widest text-rhum-gold/50">Date</th>
                        <th className="py-4 text-[9px] uppercase tracking-widest text-rhum-gold/50">Total</th>
                        <th className="py-4 text-[9px] uppercase tracking-widest text-rhum-gold/50 text-right">Statut</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-6 font-mono text-[11px] text-white/80">{order.id}</td>
                            <td className="py-6 text-sm text-white/60">{order.date}</td>
                            <td className="py-6 text-sm font-bold text-rhum-gold">{order.total}</td>
                            <td className="py-6 text-right">
                                    <span className="text-[8px] px-2 py-1 border border-white/10 text-white/40 uppercase tracking-tighter">
                                        {order.status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}