import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports des données et composants synchronisés
import { BOTTLES, Bottle } from '../data/bottles';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import ShopReassurance from '../components/shop/ShopReassurance';

interface ShopPageProps {
    onAddToCart: (item: any) => void;
}

export default function ShopPage({ onAddToCart }: ShopPageProps) {
    /** * État de la catégorie active.
     * On l'initialise sur "TOUS" pour que l'intégralité du catalogue
     * soit visible dès l'arrivée sur la page.
     */
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortOrder, setSortOrder] = useState<string>("default");
    const [selectedBottleId, setSelectedBottleId] = useState<number | null>(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    // LOGIQUE DE FILTRAGE ET TRI
    const processedBottles = useMemo(() => {
        /** * FILTRAGE : Si l'ID de catégorie est "TOUS", on retourne le tableau BOTTLES complet.
         * Sinon, on filtre strictement par la catégorie sélectionnée (Fruité, Vrac, Dame-Jeanne).
         */
        let filtered = activeCat === "TOUS"
            ? BOTTLES
            : BOTTLES.filter((b: Bottle) => b.category === activeCat);

        /**
         * TRI : Comme les bouteilles ont plusieurs tailles, on effectue le tri
         * basé sur le prix de la première taille disponible.
         */
        if (sortOrder === "asc") {
            return [...filtered].sort((a, b) => a.availableSizes[0].price - b.availableSizes[0].price);
        }
        if (sortOrder === "desc") {
            return [...filtered].sort((a, b) => b.availableSizes[0].price - a.availableSizes[0].price);
        }

        return filtered;
    }, [activeCat, sortOrder]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* AJUSTEMENT : Augmentation du padding-top (pt-40 sur mobile et md:pt-60 sur desktop) */
            className="min-h-screen bg-[#0a1a14] pt-40 md:pt-60 pb-20 px-4 md:px-6"
        >
            <div className="max-w-7xl mx-auto">

                {/* Header de la boutique */}
                <header className="text-center mb-10 md:mb-16 relative">
                    <h1 className="text-3xl md:text-7xl font-serif text-rhum-gold tracking-[0.2em] uppercase mb-4 md:mb-6">
                        NOS BOUTEILLES
                    </h1>
                    <p className="text-rhum-cream/60 font-sans max-w-xl mx-auto italic text-[11px] md:text-lg leading-relaxed px-2">
                        "Découvrez nos bouteilles de fabrication artisanale française aux saveurs uniques."
                    </p>
                </header>

                {/* Composant de filtres synchronisé */}
                <ShopFilters
                    activeCat={activeCat}
                    onCatChange={setActiveCat}
                    onSortChange={setSortOrder}
                />

                {/* Grille de produits dynamique */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {processedBottles.map((bottle) => (
                            <ProductCard
                                key={bottle.id}
                                bottle={bottle}
                                isSelected={selectedBottleId === bottle.id}
                                onToggleSelect={() => setSelectedBottleId(selectedBottleId === bottle.id ? null : bottle.id)}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Message d'état vide : si le filtre ne retourne aucun résultat */}
                {processedBottles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-24 text-center border border-white/5 bg-white/[0.02] rounded-sm"
                    >
                        <p className="font-serif italic text-rhum-cream/30 text-xl tracking-wide">
                            Cette collection n'a pas encore été distillée...
                        </p>
                    </motion.div>
                )}

                <ShopReassurance />
            </div>
        </motion.main>
    );
}