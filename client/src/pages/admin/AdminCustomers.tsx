import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Mail, Phone, User, Fingerprint } from 'lucide-react'; // 🏺 Identifiant unique
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore';

export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast);

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const fetchCustomers = () => {
        setLoading(true);
        api.get('/users').then(res => {
            setCustomers(res.data);
            setLoading(false);
        }).catch(() => {
            addToast("Erreur lors de l'extraction de la base client.", "error");
            setLoading(false);
        });
    };

    useEffect(() => { fetchCustomers(); }, []);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    /**
     * 🏺 Logique de filtrage augmentée
     * Permet désormais la recherche par Nom, Prénom, Email ou Code Client.
     */
    const filteredCustomers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return customers.filter(c =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch) ||
            c.email.toLowerCase().includes(lowerSearch) ||
            (c.memberCode && c.memberCode.toLowerCase().includes(lowerSearch))
        );
    }, [customers, searchTerm]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const displayedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    const openCustomerDetails = (customer: any) => {
        setSelectedCustomer(customer);
        setIsDetailsOpen(true);
    };

    return (
        <section className="space-y-10 font-sans selection:bg-rhum-gold/30">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre de la Clientèle</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-black">Pilotage des dossiers membres</p>
                </div>

                <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-[260px]">
                    <Search size={14} className="text-rhum-gold/40" />
                    <input
                        type="text"
                        placeholder="NOM, EMAIL OU CODE..."
                        className="bg-transparent text-[11px] text-white outline-none w-full uppercase tracking-widest font-black"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5 rounded-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[11px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Identité & Code</th>
                        <th className="py-6 px-8 font-black">Coordonnées</th>
                        <th className="py-6 px-8 font-black">État du Cursus</th>
                        <th className="py-6 px-8 font-black text-center">Activité</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {displayedCustomers.map(customer => (
                        <tr
                            key={customer.id}
                            onClick={() => openCustomerDetails(customer)}
                            className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                        >
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                        <User size={18} className="text-rhum-gold/40" />
                                    </div>
                                    <div>
                                        <p className="text-white text-base font-bold uppercase tracking-tight">
                                            {customer.lastName} <span className="text-rhum-gold font-bold">{customer.firstName}</span>
                                        </p>

                                        {/* 🏺 Mise en valeur du Code Client (Identifiant unique) */}
                                        <div className="flex items-center gap-2 mt-1">
                                            <Fingerprint size={10} className="text-rhum-gold/60" />
                                            <span className="text-[11px] text-rhum-gold font-black uppercase tracking-[0.2em]">
                                                {customer.memberCode || "NON CERTIFIÉ"}
                                            </span>
                                        </div>

                                        <p className="text-[10px] text-white/20 uppercase mt-1 tracking-widest font-black">
                                            Membre depuis le {new Date(customer.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 px-8 space-y-3">
                                <div className="flex items-center gap-3 text-[11px] text-rhum-cream font-black uppercase tracking-widest">
                                    <Mail size={12} className="text-rhum-gold/40" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-rhum-cream font-black uppercase tracking-widest">
                                    <Phone size={12} className="text-rhum-gold/40" /> {customer.phone || 'Non renseigné'}
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`w-2 h-5 rounded-full transition-all ${lvl <= customer.conceptionLevel ? 'bg-rhum-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 'bg-white/5'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-rhum-gold font-black uppercase tracking-widest">
                                        {customer.conceptionLevel === 0 ? "Initié" : `Niveau ${customer.conceptionLevel}`}
                                    </span>
                                </div>
                            </td>
                            <td className="py-6 px-8 text-center">
                                <span className="text-2xl font-serif text-white font-bold">{customer._count?.orders || 0}</span>
                                <p className="text-[10px] text-white/30 uppercase font-black mt-2 tracking-widest">Commandes</p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {(displayedCustomers.length === 0 && !loading) && (
                    <div className="py-24 text-center text-white/20 text-xs font-black uppercase tracking-[0.3em]">
                        Aucun dossier membre trouvé dans le registre.
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