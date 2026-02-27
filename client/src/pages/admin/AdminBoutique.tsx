import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search, Trash2, Package } from 'lucide-react';
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';
import AdminPagination from '../../components/admin/AdminPagination';
import { useToastStore } from '../../store/toastStore';

export default function AdminBoutique() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const addToast = useToastStore(state => state.addToast);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            addToast("Échec de synchronisation du Registre.", "error");
        }
    };

    useEffect(() => { fetchProducts(); }, []);
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const filteredProducts = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(lowerSearch) ||
            product.category.name.toLowerCase().includes(lowerSearch)
        );
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const displayedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    }, [filteredProducts, currentPage]);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Confirmer la radiation de "${name}" ?`)) {
            try {
                await api.delete(`/admin/products/${id}`);
                addToast(`Référence "${name}" retirée.`);
                fetchProducts();
            } catch (error) {
                addToast("Erreur lors de la suppression.", "error");
            }
        }
    };

    const openEdit = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    return (
        <section className="space-y-10 font-sans selection:bg-emerald-100 pb-20">
            {/* --- EN-TÊTE DE DIRECTION (Miroir Commandes/Clientèle) --- */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center border-b-4 border-slate-100 pb-8 gap-6">
                <div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Catalogue Flacons</h2>
                    <p className="text-[11px] text-emerald-700 uppercase tracking-widest mt-1 font-black">Gestion du Registre des Références</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="bg-white border-2 border-slate-200 px-6 py-3.5 rounded-2xl flex items-center gap-4 w-full sm:w-[300px] shadow-sm focus-within:border-emerald-500 transition-all">
                        <Search size={20} className="text-emerald-600" strokeWidth={3} />
                        <input
                            type="text"
                            placeholder="RECHERCHER UNE RÉFÉRENCE..."
                            className="bg-transparent text-[11px] text-black outline-none w-full font-black uppercase tracking-widest placeholder:text-slate-300"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-emerald-900/20 whitespace-nowrap"
                    >
                        + Nouvelle Bouteille
                    </button>
                </div>
            </header>

            {/* --- TABLEAU DU REGISTRE --- */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-900 border-b border-slate-100">
                        <th className="py-6 px-10 font-black w-[35%]">Identité bouteille</th>
                        <th className="py-6 px-10 font-black text-center w-[20%]">Collection</th>
                        <th className="py-6 px-10 font-black w-[30%]">Inventaire & Tarification</th>
                        <th className="py-6 px-10 font-black text-right w-[15%]">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-50">
                    {displayedProducts.map(product => (
                        <tr
                            key={product.id}
                            onClick={() => openEdit(product)}
                            className="group hover:bg-slate-50/50 transition-all align-middle cursor-pointer"
                        >
                            <td className="py-8 px-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-black text-base font-black uppercase tracking-tighter">{product.name}</p>
                                        <div className="flex items-center gap-2 mt-1 text-slate-400">
                                            <Package size={10} />
                                            <p className="text-[9px] uppercase font-bold tracking-widest">ID: {product.id.slice(0, 8)}</p>
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className="py-8 px-10 text-center">
                                    <span className="inline-block px-4 py-2 bg-slate-100 text-black text-[10px] font-black uppercase rounded-xl border border-slate-200">
                                        {product.category.name}
                                    </span>
                            </td>

                            <td className="py-8 px-10">
                                <div className="flex flex-col gap-2">
                                    {product.volumes.map((v: any) => (
                                        <div key={v.id} className="flex items-center gap-3 text-[11px]">
                                            <span className={`w-2 h-2 rounded-full ${v.stock < 5 ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'}`} />
                                            <span className="font-black text-slate-900 w-16 uppercase tracking-tighter">{v.size}{v.unit}</span>
                                            <span className="font-black text-emerald-700 w-16">{v.price}€</span>
                                            <span className={`font-black uppercase italic ${v.stock < 5 ? 'text-red-600' : 'text-slate-400'}`}>({v.stock} pcs)</span>
                                        </div>
                                    ))}
                                </div>
                            </td>

                            <td className="py-8 px-10 text-right" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="w-12 h-12 bg-white border-2 border-slate-100 text-slate-300 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all rounded-2xl flex items-center justify-center shadow-sm"
                                >
                                    <Trash2 size={20} strokeWidth={2.5} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page: number) => setCurrentPage(page)}
            />

            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onRefresh={fetchProducts} />
            <EditProductModal isOpen={isEditOpen} product={selectedProduct} onClose={() => setIsEditOpen(false)} onRefresh={fetchProducts} />
        </section>
    );
}