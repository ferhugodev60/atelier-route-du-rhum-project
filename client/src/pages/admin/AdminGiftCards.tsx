import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Gift, ArrowDownCircle, Loader2, Calendar, History } from 'lucide-react';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore';

/**
 * 🏺 REGISTRE DES TITRES DE CURSUS (CARTES CADEAUX)
 * Interface de gestion des flux physiques et anonymes.
 */
export default function AdminGiftCards() {
    const [giftCards, setGiftCards] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [debitAmounts, setDebitAmounts] = useState<Record<string, string>>({});
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast);

    /**
     * 🏺 Recherche par Suffixe au Registre
     */
    const handleSearch = () => {
        if (!searchTerm) {
            setGiftCards([]);
            return;
        }
        setLoading(true);
        api.get(`/gift-cards/search?suffix=${searchTerm}`)
            .then(res => {
                setGiftCards(res.data);
                setLoading(false);
            })
            .catch(() => {
                addToast("Erreur lors de la recherche au Registre.", "error");
                setLoading(false);
            });
    };

    // Déclenchement de la recherche à la saisie (optionnel) ou via Enter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 2) handleSearch();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    /**
     * 🏺 Régularisation Physique (Débit)
     */
    const handleDebit = async (code: string, cardId: string) => {
        const amount = parseFloat(debitAmounts[cardId]);
        if (!amount || amount <= 0) {
            addToast("Montant invalide.", "error");
            return;
        }

        try {
            const { data } = await api.post(`/gift-cards/${code}/debit`, { amountToDebit: amount });
            addToast(`Débit scellé : -${amount}€ effectués.`, "success");

            // Mise à jour locale du Registre
            setGiftCards(giftCards.map(card =>
                card.id === cardId ? { ...card, balance: data.newBalance, status: data.newBalance <= 0 ? 'ÉPUISÉ' : card.status } : card
            ));
            setDebitAmounts({ ...debitAmounts, [cardId]: '' });
        } catch (error: any) {
            addToast(error.response?.data?.error || "Échec du débit.", "error");
        }
    };

    const totalPages = Math.ceil(giftCards.length / itemsPerPage);
    const displayedCards = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return giftCards.slice(start, start + itemsPerPage);
    }, [giftCards, currentPage]);

    return (
        <section className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            {/* --- EN-TÊTE DE DIRECTION --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Titres de Cursus</h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Champ de Recherche par Suffixe */}
                    <div className="bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl flex items-center gap-4 w-full sm:w-[400px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={20} className="text-emerald-600" strokeWidth={3} />
                        <input
                            type="text"
                            placeholder="RECHERCHER PAR SUFFIXE (EX: A2B3)..."
                            className="bg-transparent text-[11px] text-black outline-none w-full font-black uppercase tracking-widest placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                        />
                    </div>
                </div>
            </header>

            {/* --- TABLEAU DES TITRES --- */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-900 border-b border-slate-100">
                        <th className="py-6 px-10 font-black">Référence Titre</th>
                        <th className="py-6 px-10 font-black">Valeur & Solde</th>
                        <th className="py-6 px-10 font-black">Échéance</th>
                        <th className="py-6 px-10 font-black text-center">Régularisation Physique</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                    {loading ? (
                        <tr>
                            <td colSpan={4} className="py-20 text-center">
                                <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={32} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation du Registre...</p>
                            </td>
                        </tr>
                    ) : displayedCards.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-24 text-center text-slate-300 uppercase tracking-widest text-xs font-black">
                                {searchTerm ? "AUCUN RÉSULTAT POUR CE SUFFIXE." : "SAISISSEZ UN CODE POUR INTERROGER LE REGISTRE."}
                            </td>
                        </tr>
                    ) : (
                        displayedCards.map(card => (
                            <tr key={card.id} className="group hover:bg-slate-50/50 transition-all align-middle">
                                {/* Colonne Référence */}
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                                            <Gift size={20} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-black text-base font-black uppercase tracking-tighter">
                                                {card.code}
                                            </p>
                                            <span className={`inline-block text-[8px] px-2 py-0.5 border font-black uppercase tracking-widest rounded-md mt-1 ${
                                                card.status === 'ACTIF' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                                            }`}>
                                                    {card.status}
                                                </span>
                                        </div>
                                    </div>
                                </td>

                                {/* Colonne Valeur */}
                                <td className="py-8 px-10">
                                    <div className="space-y-1">
                                        <p className="text-2xl font-black text-black tracking-tighter">{card.balance.toFixed(2)}€</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                                            <History size={10} /> Valeur Initiale : {card.amount.toFixed(2)}€
                                        </p>
                                    </div>
                                </td>

                                {/* Colonne Échéance */}
                                <td className="py-8 px-10">
                                    <div className="flex items-center gap-3 text-[11px] text-black font-black uppercase tracking-widest">
                                        <Calendar size={14} className="text-emerald-600" strokeWidth={3} />
                                        {new Date(card.expiresAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </td>

                                {/* Colonne Action Débit */}
                                <td className="py-8 px-10">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="bg-slate-50 border-2 border-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 group-hover:border-emerald-200 transition-all">
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={debitAmounts[card.id] || ''}
                                                onChange={(e) => setDebitAmounts({...debitAmounts, [card.id]: e.target.value})}
                                                className="bg-transparent w-20 text-right font-black text-sm outline-none text-emerald-700 placeholder:text-slate-200"
                                            />
                                            <span className="text-[10px] font-black text-slate-300">€</span>
                                        </div>
                                        <button
                                            onClick={() => handleDebit(card.code, card.id)}
                                            disabled={card.balance <= 0 || card.status !== 'ACTIF'}
                                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-emerald-600 transition-all shadow-lg disabled:opacity-20"
                                            title="Confirmer le débit"
                                        >
                                            <ArrowDownCircle size={18} strokeWidth={3} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page: number) => setCurrentPage(page)}
                />
            )}
        </section>
    );
}