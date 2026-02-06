import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';
import { Product, ProductVolume } from '../types/shop';

// Composants
import ProductCard from '../components/shop/ProductCard.tsx';
import ShopFilters from '../components/shop/ShopFilters.tsx';
import ShopReassurance from '../components/shop/ShopReassurance.tsx';

interface ShopPageProps {
    onAddToCart: (product: Product, volume: ProductVolume, qty: number) => void;
}

export default function ShopPage({ onAddToCart }: ShopPageProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortOrder, setSortOrder] = useState<string>("default");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    // 🏺 Chargement des élixirs depuis le serveur
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchInventory = async () => {
            try {
                const { data } = await api.get('/shop/products');
                setProducts(data);
            } catch (err) {
                console.error("Erreur lors de la lecture de la cave :", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // LOGIQUE DE FILTRAGE ET TRI
    const processedProducts = useMemo(() => {
        if (!products) return [];

        let filtered = activeCat === "TOUS"
            ? products
            : products.filter((p) => p.category?.name === activeCat);

        if (sortOrder === "asc") {
            return [...filtered].sort((a, b) => (a.volumes[0]?.price || 0) - (b.volumes[0]?.price || 0));
        }
        if (sortOrder === "desc") {
            return [...filtered].sort((a, b) => (b.volumes[0]?.price || 0) - (a.volumes[0]?.price || 0));
        }

        return filtered;
    }, [activeCat, sortOrder, products]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center">
                <p className="text-rhum-gold font-serif italic animate-pulse">Chauffage de l'alambic...</p>
            </div>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0a1a14] pt-40 md:pt-60 pb-20 px-4 md:px-6"
        >
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-7xl font-serif text-rhum-gold tracking-[0.2em] uppercase mb-4">
                        La BOUTIQUE
                    </h1>
                    <p className="text-rhum-cream/60 font-sans max-w-xl mx-auto text-[11px] md:text-lg mt-10">
                        Chaque flacon est une promesse de voyage, distillée avec passion dans notre atelier.
                    </p>
                </header>

                <ShopFilters
                    activeCat={activeCat}
                    onCatChange={setActiveCat}
                    onSortChange={setSortOrder}
                />

                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {processedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isSelected={selectedProductId === product.id}
                                onToggleSelect={() => setSelectedProductId(selectedProductId === product.id ? null : product.id)}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {processedProducts.length === 0 && (
                    <div className="py-24 text-center border border-white/5 bg-white/[0.02]">
                        <p className="font-serif italic text-rhum-cream/30 text-xl">
                            Cet élixir n'a pas encore été mis en bouteille...
                        </p>
                    </div>
                )}

                <ShopReassurance />
            </div>
        </motion.main>
    );
}