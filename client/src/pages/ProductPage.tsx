import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck } from 'lucide-react';
import api from '../api/axiosInstance';
import { Product, ProductVolume } from '../types/shop';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import ProductCard from '../components/shop/ProductCard';
import ShopReassurance from "../components/shop/ShopReassurance.tsx";

export default function ProductPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVol, setSelectedVol] = useState<ProductVolume | null>(null);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'details'>('description');

    const { items, addItem } = useCartStore();
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProductData = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                if (data.volumes.length > 0) setSelectedVol(data.volumes[0]);

                const productsRes = await api.get('/products');
                const filtered = productsRes.data
                    .filter((p: Product) => p.categoryId === data.categoryId && p.id !== data.id)
                    .slice(0, 3);
                setRecommendations(filtered);

            } catch (err) { navigate('/boutique'); }
            finally { setLoading(false); }
        };
        fetchProductData();
    }, [id, navigate]);

    /**
     * 🏺 SCELLAGE DE LA DESCRIPTION COURTE
     * On limite à 160 caractères pour garder une zone d'achat compacte.
     */
    const shortDescription = useMemo(() => {
        if (!product?.description) return "";
        const limit = 160;
        if (product.description.length <= limit) return product.description;
        return `${product.description.substring(0, limit)}...`;
    }, [product]);

    const { realAvailableStock } = useMemo(() => {
        if (!selectedVol) return { realAvailableStock: 0 };
        const itemInCart = items.find(i => i.volumeId === selectedVol.id);
        const inCart = itemInCart ? itemInCart.quantity : 0;
        return { realAvailableStock: Math.max(0, selectedVol.stock - inCart) };
    }, [selectedVol, items]);

    if (loading || !product) return <div className="min-h-screen bg-[#0a1a14]" />;

    return (
        <>
            <Helmet>
                <title>{`${product.name} | L'Établissement de la Route du Rhum`}</title>
                <meta name="description" content={product.description} />
            </Helmet>

            <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a1a14] pt-32 pb-20 px-4 md:px-8 font-sans">
                <div className="max-w-6xl mx-auto">

                    <nav className="flex gap-2 text-[10px] uppercase tracking-[0.2em] text-white mb-8 font-black">
                        <Link to="/" className="hover:text-rhum-gold">ACCUEIL</Link> /
                        <Link to="/boutique" className="hover:text-rhum-gold">{product.category.name}</Link> /
                        <span className="text-rhum-gold">{product.name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-24">
                        <div className="relative aspect-square bg-white/5 border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-4xl md:text-5xl font-serif text-white uppercase mb-4 tracking-tighter">
                                {product.name}
                            </h1>

                            <div className="flex gap-4 text-[10px] font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                                <span className="text-rhum-gold">{product.category.name}</span> | <span>{selectedVol?.size}{selectedVol?.unit}</span>
                            </div>

                            <div className="text-4xl font-serif text-rhum-gold mb-8">
                                {selectedVol?.price.toFixed(2)} €
                                <span className="text-[10px] text-white block mt-2 font-sans uppercase tracking-[0.2em]">Prix TTC</span>
                            </div>

                            {/* 🏺 APERÇU DE LA DESCRIPTION (SHORT) */}
                            <p className="text-white text-base leading-relaxed mb-10 font-serif italic border-l-2 border-rhum-gold pl-6">
                                "{shortDescription}"
                            </p>

                            <div className="flex gap-4 mb-10 items-stretch">
                                <div className="relative flex items-center border border-white/20 rounded-sm bg-white/5">
                                    <button
                                        disabled={qty <= 1}
                                        onClick={() => setQty(q => q - 1)}
                                        className="px-4 py-4 text-white hover:text-rhum-gold transition-colors"
                                    > - </button>
                                    <span className="px-2 text-sm font-black text-rhum-gold min-w-[2rem] text-center">{qty}</span>
                                    <button
                                        disabled={qty >= realAvailableStock}
                                        onClick={() => setQty(q => q + 1)}
                                        className="px-4 py-4 text-white hover:text-rhum-gold transition-colors"
                                    > + </button>
                                </div>

                                <button
                                    disabled={realAvailableStock === 0}
                                    onClick={() => { addItem(product, selectedVol, qty); addToast(`${product.name} ajouté.`); }}
                                    className="flex-1 bg-rhum-gold text-rhum-green font-black text-[11px] uppercase tracking-[0.3em] py-5 hover:bg-white transition-all rounded-sm shadow-xl"
                                >
                                    {realAvailableStock === 0 ? 'STOCK ÉPUISÉ' : 'AJOUTER AU PANIER'}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-white pt-8 border-t border-white/10">
                                <ShieldCheck size={16} className="text-rhum-gold" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Paiement 100% sécurisé via Stripe</span>
                            </div>
                        </div>
                    </div>

                    {/* 🏺 SYSTÈME D'ONGLETS (DESCRIPTION ENTIÈRE ICI) */}
                    <div className="border-t border-white/10 mb-24">
                        <div className="flex justify-center gap-8 md:gap-16 -mt-[1px]">
                            {['description', 'details'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`py-8 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] border-t-2 transition-all
                                        ${activeTab === tab ? 'border-rhum-gold text-white' : 'border-transparent text-white/40 hover:text-white'}`}
                                >
                                    {tab === 'description' ? 'Description' : 'Détails techniques'}
                                </button>
                            ))}
                        </div>

                        <div className="py-16 text-center max-w-3xl mx-auto px-4">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="text-white font-serif text-xl md:text-2xl leading-relaxed"
                                >
                                    {/* 🏺 ON AFFICHE L'INTÉGRALITÉ DU REGISTRE ICI */}
                                    {activeTab === 'description' && product.description}
                                    {activeTab === 'details' && `Volume: ${selectedVol?.size}${selectedVol?.unit} | Alcool: 50% | Provenance du rhum: Guadeloupe`}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {recommendations.length > 0 && (
                        <div className="mt-24 pt-24 border-t border-white/10">
                            <h2 className="text-3xl md:text-4xl font-serif text-white uppercase mb-16 text-center tracking-tight">
                                Nos <span className="text-rhum-gold">Recommandations</span>
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                                {recommendations.map((relProduct) => (
                                    <ProductCard key={relProduct.id} product={relProduct} />
                                ))}
                            </div>
                        </div>
                    )}

                    <ShopReassurance />
                </div>
            </motion.main>
        </>
    );
}