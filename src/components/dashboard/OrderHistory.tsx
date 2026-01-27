export default function OrderHistory() {
    const orders = [
        {
            id: 'ORD-2026-X1',
            date: '24/01/2026',
            total: '124.00€',
            status: 'En préparation',
            items: [{ name: 'Rhum Alchimie', type: 'bouteille', qty: 1 }, { name: 'Atelier Botanique', type: 'atelier', qty: 2 }]
        },
        {
            id: 'ORD-2025-A9',
            date: '12/12/2025',
            total: '45.00€',
            status: 'Livré',
            items: [{ name: 'Bouteille Signature', type: 'bouteille', qty: 1 }]
        },
    ];

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Historique d'achat</h2>
                <p className="text-rhum-gold/40 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">Retrait de bouteille à l'Atelier uniquement</p>
            </header>

            {/* VERSION MOBILE : LISTE DE CARTES */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white/[0.02] border border-white/5 p-6 space-y-4">
                        <div className="flex justify-between items-start border-b border-white/5 pb-4">
                            <div>
                                <p className="text-[10px] text-rhum-gold font-black uppercase tracking-tighter">{order.id}</p>
                                <p className="text-[10px] text-white/40 uppercase">{order.date}</p>
                            </div>
                            <span className="text-[8px] px-2 py-1 border border-white/10 text-white/60 uppercase font-black">{order.status}</span>
                        </div>
                        <div className="space-y-2">
                            {order.items.map((item, i) => (
                                <p key={i} className="text-xs text-white/80 font-serif italic">
                                    {item.name} <span className="text-[9px] opacity-30">x{item.qty}</span>
                                </p>
                            ))}
                        </div>
                        <p className="text-lg font-bold text-rhum-gold text-right">{order.total}</p>
                    </div>
                ))}
            </div>

            {/* VERSION DESKTOP : TABLEAU CLASSIQUE */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-white/5">
                    <tr>
                        <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black">Référence</th>
                        <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black">Contenu</th>
                        <th className="py-5 text-[9px] uppercase tracking-widest text-rhum-gold/50 font-black text-right">Total</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-6">
                                <p className="text-[11px] font-mono text-white/80">{order.id}</p>
                                <p className="text-[10px] text-white/30 uppercase">{order.date}</p>
                            </td>
                            <td className="py-6">
                                {order.items.map((item, i) => (
                                    <p key={i} className="text-sm text-white/60 font-serif italic">{item.name}</p>
                                ))}
                            </td>
                            <td className="py-6 text-right">
                                <p className="text-sm font-bold text-rhum-gold">{order.total}</p>
                                <span className="text-[8px] text-white/40 uppercase tracking-tighter">{order.status}</span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}