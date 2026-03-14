import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';
import { Product } from '../types/shop';

// Composants certifiés
import ProductCard from '../components/shop/ProductCard.tsx';
import ShopFilters from '../components/shop/ShopFilters.tsx';
import ShopReassurance from '../components/shop/ShopReassurance.tsx';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortOrder, setSortOrder] = useState<string>("default");

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Échec de synchronisation technique :", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const processedProducts = useMemo(() => {
        if (!products) return [];
        let filtered = activeCat === "TOUS"
            ? products
            : products.filter((p) => p.category?.name === activeCat);

        if (sortOrder === "asc") return [...filtered].sort((a, b) => (a.volumes[0]?.price || 0) - (b.volumes[0]?.price || 0));
        if (sortOrder === "desc") return [...filtered].sort((a, b) => (b.volumes[0]?.price || 0) - (a.volumes[0]?.price || 0));
        return filtered;
    }, [activeCat, sortOrder, products]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-rhum-gold font-serif italic animate-pulse tracking-[0.4em] uppercase text-[12px] font-black">
                        Consultation du Registre des Essences...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* 🏺 Correction : Réduction du PT (Top Padding) de 60 à 32 pour remonter le contenu */
            className="min-h-screen bg-[#0a1a14] pt-24 md:pt-32 pb-20 px-4 md:px-6 font-sans selection:bg-rhum-gold/40"
        >
            <div className="max-w-7xl mx-auto">

                {/* 🏺 HEADER : Format Compact Prestige */}
                <header className="text-center mb-8 md:mb-12 relative">
                    {/* 🏺 Correction : Taille de police réduite de 9xl à 7xl pour libérer de l'espace vertical */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-tighter uppercase mb-4 drop-shadow-2xl">
                        La <span className="text-rhum-gold">Boutique</span>
                    </h1>

                    <div className="mt-6 flex justify-center gap-4">
                        <div className="h-[1px] w-8 bg-rhum-gold/30 self-center" />
                        <span className="text-rhum-gold text-[9px] font-black tracking-[0.3em] uppercase">Atelier de la route du Rhum</span>
                        <div className="h-[1px] w-8 bg-rhum-gold/30 self-center" />
                    </div>
                </header>

                {/* 🏺 FILTRES : Position remontée */}
                <div className="mb-12 md:mb-16">
                    <ShopFilters
                        categories={categories}
                        activeCat={activeCat}
                        onCatChange={setActiveCat}
                        onSortChange={setSortOrder}
                    />
                </div>

                {/* 🏺 GRILLE DE CATALOGUE : Désormais visible dès l'ouverture */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 md:gap-x-16 md:gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {processedProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* ... État vide et réassurance ... */}
                {processedProducts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center border border-white/10 bg-white/5 rounded-sm"
                    >
                        <p className="font-serif italic text-white text-xl tracking-widest uppercase">
                            Cet élixir n'a pas encore rejoint le <span className="text-rhum-gold">Registre</span>.
                        </p>
                    </motion.div>
                )}

                <div className="mt-32 border-t border-white/5 pt-16">
                    <ShopReassurance />
                </div>
            </div>
        </motion.main>
    );
}