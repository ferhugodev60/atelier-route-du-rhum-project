import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import api from '../api/axiosInstance';
import { Product } from '../types/shop';

// Importations Techniques & Animations
import heroShop from '../assets/images/hero-shop.webp';
import { bounceAnimation } from '../utils/animations.ts';

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
    const yHero = useTransform(scrollY, [0, 800], [0, 200]);
    const opacityHero = useTransform(scrollY, [0, 700], [1, 0.2]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchRegistre = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Interruption du Registre :", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRegistre();
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
                    Chargemement en cours...
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
            {/* --- 🏺 SECTION 1 : TERRITOIRE HÉROÏQUE --- */}
            <div className="relative w-full h-screen h-[100dvh] overflow-hidden border-b border-white/10 z-0 grid grid-rows-[auto_1fr_auto]">

                <motion.div style={{ y: yHero, opacity: opacityHero }} className="absolute inset-0 z-0">
                    <img src={heroShop} className="w-full h-full object-cover" alt="L'Établissement" loading="eager" />
                    <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#0a1a14]/80" />
                </motion.div>

                <div className="h-24 md:h-32 pointer-events-none z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center px-4">
                    <header className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <h1 className="text-6xl md:text-9xl font-serif text-white uppercase tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                                La <span className="text-rhum-gold">Boutique</span>
                            </h1>
                        </motion.div>
                    </header>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="relative z-30 flex flex-col items-center justify-center py-6 md:py-10"
                >
                    <a href="#collection" className="group flex flex-col items-center gap-1 md:gap-3 no-underline">
                        <span className="text-rhum-gold/70 text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold group-hover:text-rhum-gold transition-colors">
                            Explorer les bouteilles
                        </span>
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-rhum-gold/30 flex items-center justify-center group-hover:bg-rhum-gold/10 transition-all backdrop-blur-sm">
                            <motion.svg
                                animate={bounceAnimation}
                                width="16" height="16"
                                viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="1.5"
                                className="text-rhum-gold md:w-6 md:h-6"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <polyline points="19 12 12 19 5 12" />
                            </motion.svg>
                        </div>
                    </a>
                </motion.div>
            </div>

            <div className="w-full h-px bg-white/10 z-30" />

            {/* --- 🏺 SECTION 2 : LE REGISTRE DES ESSENCES --- */}
            <div id="collection" className="relative z-20 bg-[#0a1a14] pt-16 md:pt-24 pb-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
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
                                Aucune référence certifiée pour le moment.
                            </p>
                        </div>
                    )}

                    <ShopReassurance />
                </div>
            </div>
        </motion.main>
    );
}