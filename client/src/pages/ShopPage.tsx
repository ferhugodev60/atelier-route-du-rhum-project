import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import api from '../api/axiosInstance';
import { Product } from '../types/shop';

// Importation Pro
import heroShop from '../assets/images/hero-shop.webp';

// Composants certifiés
import ProductCard from '../components/shop/ProductCard.tsx';
import ShopFilters from '../components/shop/ShopFilters.tsx';
import ShopReassurance from '../components/shop/ShopReassurance.tsx';
import ScrollReveal from '../components/animations/ScrollReveal.tsx';

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortOrder, setSortOrder] = useState<string>("default");

    const { scrollY } = useScroll();

    // 🏺 Parallaxe scellé dans le territoire Héroïque
    const yHero = useTransform(scrollY, [0, 800], [0, 200]);
    // 🏺 L'image s'efface subtilement à l'approche de la frontière
    const opacityHero = useTransform(scrollY, [0, 700], [1, 0.2]);

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
                console.error("Échec technique :", err);
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
                <p className="text-rhum-gold font-serif italic animate-pulse tracking-[0.4em] uppercase text-[12px] font-black">
                    Consultation du Registre...
                </p>
            </div>
        );
    }

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0a1a14] selection:bg-rhum-gold/40 overflow-x-hidden"
        >
            {/* --- 🏺 SECTION 1 : TERRITOIRE HÉROÏQUE (Full width/Height) --- */}
            <div className="relative w-full h-[80vh] md:h-[100vh] overflow-hidden border-b border-white/10 z-0">

                {/* Image de fond avec Parallaxe et Filtre Vert */}
                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <img
                        src={heroShop}
                        className="w-full h-full object-cover"
                        alt="Bannière Établissement"
                        loading="eager"
                    />

                    {/* LE FILTRE VERT SCELLÉ */}
                    <div className="absolute inset-0 bg-[#0a1a14]/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#0a1a14]/40" />
                </motion.div>

                {/* Contenu du Header (Centré dans le Banner) */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-6">
                    <header className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <h1 className="text-6xl md:text-9xl font-serif text-white uppercase mb-10 tracking-tighter drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
                                La <span className="text-rhum-gold">Boutique</span>
                            </h1>
                        </motion.div>
                    </header>
                </div>
            </div>

            {/* 🏺 FRONTIÈRE DE SCÉLLAGE (Le délimiteur horizontal) */}
            <div className="w-full h-[1px] bg-white/10 z-30" />

            {/* --- 🏺 SECTION 2 : TERRITOIRE DES ESSENCES (Solid background) --- */}
            <div className="relative z-20 bg-[#0a1a14] pt-16 md:pt-24 pb-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">

                    {/* COLLECTIONS & FILTRES : Positionnés sur le fond uni */}
                    <ScrollReveal>
                        <div className="mb-20 md:mb-28">
                            <ShopFilters
                                categories={categories}
                                activeCat={activeCat}
                                onCatChange={setActiveCat}
                                onSortChange={setSortOrder}
                            />
                        </div>
                    </ScrollReveal>

                    {/* GRILLE DE PRODUITS */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 md:gap-y-32"
                    >
                        <AnimatePresence mode="popLayout">
                            {processedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05, duration: 0.7 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {processedProducts.length === 0 && (
                        <div className="py-32 text-center border border-white/10 bg-white/5 rounded-sm">
                            <p className="font-serif italic text-white text-2xl tracking-widest uppercase">
                                Aucune bouteille disponible dans le Registre.
                            </p>
                        </div>
                    )}

                    <div className="mt-40 border-t border-white/5 pt-20">
                        <ShopReassurance />
                    </div>
                </div>
            </div>
        </motion.main>
    );
}