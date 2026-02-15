import { useEffect, useState, useMemo } from 'react';
import api from '../../api/axiosInstance';
import { Search } from 'lucide-react'; // 🏺 Import de l'icône
import AddProductModal from '../../components/admin/AddProductModal';
import EditProductModal from '../../components/admin/EditProductModal';

export default function AdminBoutique() {
    const [products, setProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState(''); // 🏺 État pour la recherche

    // Pilotage des modales
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (error) {
            console.error("Erreur de synchronisation du catalogue");
        }
    };

    // 🏺 Logique de filtrage dynamique
    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Confirmer la suppression définitive de "${name}" ?`)) {
            try {
                await api.delete(`/admin/products/${id}`);
                fetchProducts();
                alert("Référence supprimée.");
            } catch (error) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    const openEdit = (product: any) => {
        setSelectedProduct(product);
        setIsEditOpen(true);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <section className="space-y-8 font-sans">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rhum-gold/10 pb-6 gap-6">
                <div>
                    <h2 className="text-2xl font-serif text-white uppercase tracking-tight">Catalogue Boutique</h2>
                    <p className="text-[10px] text-rhum-gold/50 uppercase tracking-widest mt-1 font-bold">Gestion des références et inventaires</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* 🏺 Barre de recherche identique à la section Clientèle */}
                    <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-sm flex items-center gap-4 w-full max-w-sm">
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
                        className="bg-rhum-gold text-rhum-green px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg whitespace-nowrap w-full sm:w-auto"
                    >
                        + Nouvelle Référence
                    </button>
                </div>
            </header>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase tracking-[0.2em] text-rhum-gold/40">
                        <th className="py-4 font-bold">Produit</th>
                        <th className="py-4 font-bold">Catégorie</th>
                        <th className="py-4 font-bold">Formats & Stocks</th>
                        <th className="py-4 font-bold text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredProducts.map(product => (
                        <tr key={product.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/5 overflow-hidden border border-white/5">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    <span className="text-rhum-cream text-sm font-medium">{product.name}</span>
                                </div>
                            </td>
                            <td className="py-6 text-xs text-rhum-gold/60">{product.category.name}</td>
                            <td className="py-6">
                                <div className="space-y-1">
                                    {product.volumes.map((v: any) => (
                                        <div key={v.id} className="text-[10px] text-rhum-cream/60 uppercase">
                                            {v.size}{v.unit} — <span className="text-rhum-gold">{v.price}€</span>
                                            <span className={`ml-2 ${v.stock < 5 ? 'text-red-400 font-bold' : 'text-green-400/50'}`}>
                                                    ({v.stock} en stock)
                                                </span>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="py-6 text-right space-x-4">
                                <button
                                    onClick={() => openEdit(product)}
                                    className="text-[9px] uppercase tracking-widest text-rhum-gold/40 hover:text-white transition-colors"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id, product.name)}
                                    className="text-[9px] uppercase tracking-widest text-red-400/40 hover:text-red-400 transition-colors"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center italic text-white/20 text-sm font-serif">
                        Aucun produit ne correspond à votre recherche.
                    </div>
                )}
            </div>

            <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onRefresh={fetchProducts} />
            <EditProductModal isOpen={isEditOpen} product={selectedProduct} onClose={() => setIsEditOpen(false)} onRefresh={fetchProducts} />
        </section>
    );
}