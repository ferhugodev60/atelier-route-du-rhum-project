import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Mail, Phone, User } from 'lucide-react';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore'; // 🏺 Import du store

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

    const filteredCustomers = useMemo(() => {
        return customers.filter(c =>
            `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <section className="space-y-10 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Registre de la Clientèle</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Pilotage des dossiers membres</p>
                </div>

                <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-[260px]">
                    <Search size={14} className="text-rhum-gold/40" />
                    <input
                        type="text"
                        placeholder="RECHERCHER..."
                        className="bg-transparent text-[10px] text-white outline-none w-full uppercase tracking-widest"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Identité</th>
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
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                                        <User size={16} className="text-rhum-gold/40" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-bold uppercase tracking-tight">
                                            {customer.lastName} <span className="text-rhum-gold/80 font-medium">{customer.firstName}</span>
                                        </p>
                                        <p className="text-[8px] text-white/20 uppercase mt-1 tracking-widest">
                                            Membre depuis le {new Date(customer.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
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
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`w-1.5 h-4 rounded-full transition-all ${lvl <= customer.conceptionLevel ? 'bg-rhum-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]' : 'bg-white/5'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[9px] text-rhum-gold font-black uppercase tracking-widest">
                                        {customer.conceptionLevel === 0 ? "Sans Certification" : `Niveau ${customer.conceptionLevel}`}
                                        </span>
                                </div>
                            </td>
                            <td className="py-6 px-8 text-center">
                                <span className="text-xs font-serif text-white">{customer._count?.orders || 0}</span>
                                <p className="text-[8px] text-white/20 uppercase font-bold mt-1">Commandes</p>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {(displayedCustomers.length === 0 && !loading) && (
                    <div className="py-24 text-center italic text-white/10 text-sm font-serif tracking-widest">
                        Aucune fiche client ne correspond à votre recherche.
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