import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Edit3, Trash2 } from 'lucide-react';
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore'; // 🏺 Import du store

export default function AdminBoutique() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast); // 🏺 Hook de notification

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Erreur de synchronisation");
        }
    };

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Confirmer la suppression définitive de "${name}" ?`)) {
            try {
                await api.delete(`/admin/products/${id}`);
                addToast(`Référence "${name}" supprimée du registre.`); // 🏺 Toast Succès
                fetchProducts();
            } catch (error) {
                addToast("Échec de la suppression technique.", "error"); // 🏺 Toast Erreur
            }
        }
    };

    const openEdit = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    return (
        <section className="space-y-10 font-sans">
            <header className="flex justify-between items-end border-b border-rhum-gold/10 pb-8">
                <div>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Catalogue Boutique</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-[0.4em] mt-2 font-bold">Gestion des références et stocks</p>
                </div>

                <div className="flex items-center gap-6">
                    {/* 🏺 Barre de recherche réduite à 260px */}
                    <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-[260px]">
                        <Search size={14} className="text-rhum-gold/40" />
                        <input
                            type="text"
                            placeholder="RECHERCHER..."
                            className="bg-transparent text-[10px] text-white outline-none w-full uppercase tracking-widest"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-rhum-gold text-rhum-green px-8 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl whitespace-nowrap"
                    >
                        + Nouvelle Bouteille
                    </button>
                </div>
            </header>

            <div className="overflow-x-auto bg-white/[0.01] border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-6 px-8 font-black">Identité Produit</th>
                        <th className="py-6 px-8 font-black">Catégorie</th>
                        <th className="py-6 px-8 font-black">Inventaire & Tarifs</th>
                        <th className="py-6 px-8 font-black text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {displayedProducts.map(product => (
                        <tr key={product.id} className="group hover:bg-white/[0.02] transition-colors">
                            <td className="py-6 px-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white/5 overflow-hidden border border-white/5 shadow-inner">
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <p className="text-white text-sm font-bold uppercase tracking-tight">{product.name}</p>
                                </div>
                            </td>
                            <td className="py-6 px-8">
                                <span className="text-[10px] text-rhum-gold/60 font-black uppercase tracking-widest border border-rhum-gold/10 px-3 py-1 rounded-sm">
                                    {product.category.name}
                                </span>
                            </td>
                            <td className="py-6 px-8">
                                <div className="space-y-2">
                                    {product.volumes.map((v: any) => (
                                        <div key={v.id} className="flex items-center gap-3">
                                            <div className={`w-1.5 h-3 rounded-full ${v.stock < 5 ? 'bg-red-400 animate-pulse' : 'bg-rhum-gold'}`} />
                                            <span className="text-[10px] text-rhum-cream/60 uppercase tracking-tighter">
                                                {v.size}{v.unit} — <b className="text-rhum-gold">{v.price}€</b>
                                                <span className="ml-2 opacity-40">({v.stock} bouteilles)</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="py-6 px-8 text-right">
                                <div className="flex justify-end gap-5">
                                    <button onClick={() => openEdit(product)} className="text-rhum-gold/70 hover:text-white transition-colors"><Edit3 size={18} /></button>
                                    <button onClick={() => handleDelete(product.id, product.name)} className="text-red-400/70 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onRefresh={fetchProducts} />
            <EditProductModal isOpen={isEditOpen} product={selectedProduct} onClose={() => setIsEditOpen(false)} onRefresh={fetchProducts} />
        </section>
    );
}