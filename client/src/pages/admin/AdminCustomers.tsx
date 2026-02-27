import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Mail, Phone, Fingerprint, Building2, Loader2 } from 'lucide-react';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore';

/**
 * 🏺 RÉPERTOIRE CLIENTÈLE ET RÉGISTRE DES NIVEAUX
 * Gestion centralisée des passeports techniques et des comptes institutionnels.
 */
export default function AdminCustomers() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'USER' | 'PRO'>('ALL');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast);

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    /**
     * 🏺 Extraction des données du Registre
     */
    const fetchCustomers = () => {
        setLoading(true);
        api.get('/users')
            .then(res => {
                setCustomers(res.data);
                setLoading(false);
            })
            .catch(() => {
                addToast("Erreur lors de l'extraction de la base client.", "error");
                setLoading(false);
            });
    };

    useEffect(() => { fetchCustomers(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterRole]);

    /**
     * 🏺 Logique de Filtrage Multi-Critères
     */
    const filteredCustomers = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return customers.filter(c => {
            if (filterRole !== 'ALL' && c.role !== filterRole) return false;
            return (
                `${c.firstName} ${c.lastName}`.toLowerCase().includes(lowerSearch) ||
                c.email.toLowerCase().includes(lowerSearch) ||
                (c.memberCode && c.memberCode.toLowerCase().includes(lowerSearch)) ||
                (c.companyName && c.companyName.toLowerCase().includes(lowerSearch))
            );
        });
    }, [customers, searchTerm, filterRole]);

    /**
     * 🏺 Pagination du Registre
     */
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const displayedCustomers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCustomers.slice(start, start + itemsPerPage);
    }, [filteredCustomers, currentPage]);

    /**
     * 🏺 ÉCRAN DE CHARGEMENT HAUTE VISIBILITÉ
     */
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" strokeWidth={3} />
                <h2 className="text-2xl font-black text-black uppercase tracking-widest">
                    Extraction du Registre...
                </h2>
            </div>
        );
    }

    return (
        <section className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            {/* --- EN-TÊTE DE DIRECTION --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Clientèle</h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Sélecteur de Rôles */}
                    <div className="flex bg-slate-100 border-2 border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        {(['ALL', 'USER', 'PRO'] as const).map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${
                                    filterRole === role ? 'bg-white text-emerald-700 shadow-md' : 'text-slate-500 hover:text-black'
                                }`}
                            >
                                {role === 'ALL' ? 'Tous' : role === 'USER' ? 'Membres' : 'Entreprises'}
                            </button>
                        ))}
                    </div>

                    {/* Champ de Recherche */}
                    <div className="bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl flex items-center gap-4 w-full sm:w-[300px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={20} className="text-emerald-600" strokeWidth={3} />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            className="bg-transparent text-[11px] text-black outline-none w-full font-black uppercase tracking-widest placeholder:text-slate-300"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* --- TABLEAU DU REGISTRE INTERACTIF --- */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-900 border-b border-slate-100">
                        <th className="py-6 px-10 font-black">Identité & Statut</th>
                        <th className="py-6 px-10 font-black">Coordonnées</th>
                        <th className="py-6 px-10 font-black">Atelier conception</th>
                        <th className="py-6 px-10 font-black text-center">Commande(s)</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                    {displayedCustomers.map(customer => (
                        <tr
                            key={customer.id}
                            onClick={() => { setSelectedCustomer(customer); setIsDetailsOpen(true); }}
                            className="group hover:bg-slate-50/50 transition-all cursor-pointer align-middle"
                        >
                            {/* Colonne Identité */}
                            <td className="py-8 px-10">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-black text-base font-black uppercase tracking-tighter">
                                            {customer.lastName} <span className="text-emerald-700">{customer.firstName}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5 bg-slate-50 border border-slate-100 w-fit px-2 py-0.5 rounded-lg">
                                            {customer.role === 'PRO' ? <Building2 size={10} className="text-emerald-700" /> : <Fingerprint size={10} className="text-emerald-700" />}
                                            <span className="text-[10px] text-black font-black uppercase tracking-widest">
                                                    {customer.role === 'PRO' ? (customer.companyName || "Entreprise Certifiée") : (customer.memberCode || "PASSEPORT NON DÉLIVRÉ")}
                                                </span>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Colonne Coordonnées */}
                            <td className="py-8 px-10 space-y-2">
                                <div className="flex items-center gap-3 text-[11px] text-black font-black uppercase tracking-widest">
                                    <Mail size={14} className="text-emerald-600" strokeWidth={3} /> {customer.email}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-black font-black uppercase tracking-widest">
                                    <Phone size={14} className="text-emerald-600" strokeWidth={3} /> {customer.phone || 'NON RENSEIGNÉ'}
                                </div>
                            </td>

                            {/* Colonne Niveau Technique (Certification) */}
                            <td className="py-8 px-10">
                                <div className="flex items-center gap-4">
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(lvl => (
                                            <div
                                                key={lvl}
                                                className={`w-3 h-6 rounded-md transition-all border ${lvl <= (customer.conceptionLevel || 0) ? 'bg-emerald-600 border-emerald-700 shadow-md shadow-emerald-900/10' : 'bg-slate-100 border-slate-200'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-black font-black uppercase tracking-widest">
                                            {/* 🏺 RENDU DYNAMIQUE DU NIVEAU SCELLÉ */}
                                        {customer.role === 'PRO'
                                            ? `Niveau ${customer.conceptionLevel || 0}`
                                            : (customer.conceptionLevel === 0 ? "Niveau 0" : `Niveau ${customer.conceptionLevel}`)}
                                        </span>
                                </div>
                            </td>

                            {/* Colonne Statistiques Commandes */}
                            <td className="py-8 px-10 text-center">
                                    <span className="text-3xl font-black text-black tracking-tighter">
                                        {customer._count?.orders || 0}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Logicielle */}
            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => setCurrentPage(page)}
            />

            {/* Modale de Détails avec synchronisation en temps réel */}
            <CustomerDetailsModal
                isOpen={isDetailsOpen}
                customerId={selectedCustomer?.id}
                onClose={() => { setIsDetailsOpen(false); setSelectedCustomer(null); }}
                onRefresh={fetchCustomers}
            />
        </section>
    );
}