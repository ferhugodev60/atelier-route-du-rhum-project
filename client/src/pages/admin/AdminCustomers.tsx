import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Mail, Phone, User, Fingerprint, Briefcase, Building2 } from 'lucide-react';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'PRO'>('ALL'); // 🏺 Nouveau filtre par rang
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast);

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchCustomers = () => {
        setLoading(true);
        // Note : Vérifiez bien que votre route backend renvoie tous les rôles
        api.get('/users').then(res => {
            setCustomers(res.data);
            setLoading(false);
        }).catch(() => {
            addToast("Erreur lors de l'extraction de la base client.", "error");
            setLoading(false);
        });
    };

    useEffect(() => { fetchCustomers(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterRole]);

    /**
     * 🏺 Logique de filtrage multi-critères
     * Combine la recherche textuelle et le filtre par rôle institutionnel.
     */
    const filteredCustomers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();

        return customers.filter(c => {
            // 1. Filtre par rôle
            if (filterRole !== 'ALL' && c.role !== filterRole) return false;

            // 2. Recherche textuelle
            return (
                `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch) ||
                c.email.toLowerCase().includes(lowerSearch) ||
                (c.memberCode && c.memberCode.toLowerCase().includes(lowerSearch)) ||
                (c.companyName && c.companyName.toLowerCase().includes(lowerSearch)) ||
                (c.siret && c.siret.includes(lowerSearch))
            );
        });
    }, [customers, searchTerm, filterRole]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const displayedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    return (
        <section className="space-y-10 font-sans selection:bg-rhum-gold/30">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-rhum-gold/10 pb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre de la Clientèle</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Pilotage des dossiers membres & entreprises</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* 🏺 Sélecteur de type de compte */}
                    <div className="flex bg-white/5 border border-white/5 rounded-sm p-1">
                        {(['ALL', 'USER', 'PRO'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-4 py-2 text-[9px] uppercase tracking-widest font-black transition-all ${
                                    filterRole === role ? 'bg-rhum-gold text-rhum-green shadow-lg' : 'text-white/40 hover:text-white'
                                }`}
                            >
                                {role === 'ALL' ? 'Tous' : role === 'USER' ? 'Membres' : 'Entreprises'}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 flex-1 md:w-[260px]">
                        <Search size={14} className="text-rhum-gold/40" />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            className="bg-transparent text-[11px] text-white outline-none w-full uppercase tracking-widest font-black placeholder:text-white/10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[11px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Identité & Statut</th>
                        <th className="py-6 px-8 font-black">Coordonnées</th>
                        <th className="py-6 px-8 font-black">Progression</th>
                        <th className="py-6 px-8 font-black text-center">Volume</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {displayedCustomers.map(customer => (
                        <tr
                            key={customer.id}
                            onClick={() => {
                                setSelectedCustomer(customer);
                                setIsDetailsOpen(true);
                            }}
                            className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                        >
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                                        customer.role === 'PRO' ? 'border-rhum-gold/30 bg-rhum-gold/5' : 'border-white/5 bg-white/5'
                                    }`}>
                                        {customer.role === 'PRO' ? (
                                            <Briefcase size={18} className="text-rhum-gold" />
                                        ) : (
                                            <User size={18} className="text-rhum-gold/40" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-white text-base font-bold uppercase tracking-tight">
                                                {customer.lastName} <span className="text-rhum-gold font-bold">{customer.firstName}</span>
                                            </p>
                                            {customer.role === 'PRO' && (
                                                <span className="text-[7px] bg-rhum-gold text-rhum-green px-2 py-0.5 rounded-full font-black uppercase tracking-tighter shadow-sm">
                                                    Compte CE
                                                </span>
                                            )}
                                        </div>

                                        {customer.role === 'PRO' ? (
                                            <div className="mt-1 space-y-0.5">
                                                {/* On utilise companyName si présent, sinon le nom complet */}
                                                <div className="flex items-center gap-1.5 text-[10px] text-white/60 font-black uppercase tracking-widest">
                                                    <Building2 size={10} className="text-rhum-gold/60" />
                                                    {customer.companyName || customer.lastName}
                                                </div>
                                                <div className="text-[8px] text-white/20 font-black uppercase tracking-widest pl-4">
                                                    SIRET : {customer.siret || "NON RENSEIGNÉ"}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mt-1">
                                                <Fingerprint size={10} className="text-rhum-gold/60" />
                                                <span className="text-[11px] text-rhum-gold font-black uppercase tracking-[0.2em]">
                                                    {customer.memberCode || "NON CERTIFIÉ"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-8 space-y-3">
                                <div className="flex items-center gap-3 text-[11px] text-rhum-cream font-black uppercase tracking-widest">
                                    <Mail size={12} className="text-rhum-gold/40" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-rhum-cream font-black uppercase tracking-widest">
                                    <Phone size={12} className="text-rhum-gold/40" /> {customer.phone || 'N/A'}
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`w-2 h-5 rounded-full transition-all ${lvl <= (customer.conceptionLevel || 0) ? 'bg-rhum-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-white/5'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-rhum-gold font-black uppercase tracking-widest">
                                        {customer.role === 'PRO' ? "Cohorte" : (customer.conceptionLevel === 0 ? "Initié" : `Niveau ${customer.conceptionLevel}`)}
                                    </span>
                                </div>
                            </td>
                            <td className="py-6 px-8 text-center">
                                <span className="text-2xl font-serif text-white font-bold">{customer._count?.orders || 0}</span>
                                <p className="text-[10px] text-white/30 uppercase font-black mt-2 tracking-widest">Dossiers</p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {(displayedCustomers.length === 0 && !loading) && (
                    <div className="py-24 text-center text-white/20 text-xs font-black uppercase tracking-[0.3em]">
                        Aucun dossier correspondant dans le registre.
                    </div>
                )}
            </div>

            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />

            <CustomerDetailsModal
                isOpen={isDetailsOpen}
                customerId={selectedCustomer?.id}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setSelectedCustomer(null);
                }}
                onRefresh={fetchCustomers}
            />
        </section>
    );
}