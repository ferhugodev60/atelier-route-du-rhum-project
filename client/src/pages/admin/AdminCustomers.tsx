// client/src/pages/admin/AdminCustomers.tsx
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import { Search, Mail, Phone } from 'lucide-react';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCustomers = () => {
        api.get('/users').then(res => {
            setCustomers(res.data);
            setLoading(false);
        });
    };

    useEffect(() => { fetchCustomers(); }, []);

    // Filtrage dynamique
    const filteredCustomers = customers.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="space-y-10 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre de la Clientèle</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Gestion des profils et cursus</p>
                </div>
                <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-sm">
                    <Search size={14} className="text-rhum-gold/40" />
                    <input
                        type="text"
                        placeholder="RECHERCHER UN CLIENT..."
                        className="bg-transparent text-[10px] text-white outline-none w-full uppercase tracking-widest"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {/* --- TABLEAU DES CLIENTS --- */}
            <div className="overflow-x-auto bg-white/[0.01] border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Identité</th>
                        <th className="py-6 px-8 font-black">Coordonnées</th>
                        <th className="py-6 px-8 font-black">Cursus</th>
                        <th className="py-6 px-8 font-black text-center">Activité</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredCustomers.map(customer => (
                        <tr key={customer.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-6 px-8">
                                <p className="text-white text-sm font-bold uppercase tracking-tight">
                                    {customer.lastName} <span className="text-rhum-gold/80 font-medium">{customer.firstName}</span>
                                </p>
                                <p className="text-[8px] text-white/20 uppercase mt-1">Membre depuis le {new Date(customer.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="py-6 px-8 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-rhum-cream/60">
                                    <Mail size={10} className="text-rhum-gold/40" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-rhum-cream/60">
                                    <Phone size={10} className="text-rhum-gold/40" /> {customer.phone || 'Non renseigné'}
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4].map(lvl => (
                                            <div key={lvl} className={`w-1.5 h-3 rounded-full ${lvl <= customer.conceptionLevel ? 'bg-rhum-gold' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[9px] text-rhum-gold font-black uppercase">Niveau {customer.conceptionLevel}</span>
                                </div>
                            </td>
                            <td className="py-6 px-8 text-center">
                                <span className="text-xs font-serif text-white">{customer._count.orders}</span>
                                <p className="text-[8px] text-white/20 uppercase">Commandes</p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredCustomers.length === 0 && !loading && (
                    <div className="py-20 text-center italic text-white/20 text-sm font-serif">
                        Aucun client ne correspond à votre recherche.
                    </div>
                )}
            </div>
        </section>
    );
}