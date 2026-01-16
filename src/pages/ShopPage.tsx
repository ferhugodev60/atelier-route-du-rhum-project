import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports des données et composants décomposés
import { BOTTLES, Bottle } from '../data/bottles';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import ShopReassurance from '../components/shop/ShopReassurance';

const CATEGORIES = ["Tous", "Rhum Arrangé", "Signature", "Plantes"];
const FLAVORS = ["Tous", "Fruité", "Épicé", "Boisé"];

interface ShopPageProps {
    onAddToCart: (bottle: Bottle, qty: number) => void;
}

export default function ShopPage({ onAddToCart }: ShopPageProps) {
    const [activeCat, setActiveCat] = useState("Tous");
    const [activeFlavor, setActiveFlavor] = useState("Tous");
    const [sortOrder, setSortOrder] = useState("default");
    const [selectedBottleId, setSelectedBottleId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const updateQty = (id: number, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, Math.min(10, (prev[id] || 1) + delta))
        }));
    };

    const handleAddToCart = (bottle: Bottle) => {
        const qty = quantities[bottle.id] || 1;
        onAddToCart(bottle, qty);
    };

    const processedBottles = useMemo(() => {
        let filtered = BOTTLES.filter(b =>
            (activeCat === "Tous" || b.type === activeCat) &&
            (activeFlavor === "Tous" || b.flavor === activeFlavor)
        );
        if (sortOrder === "asc") return [...filtered].sort((a, b) => a.price - b.price);
        if (sortOrder === "desc") return [...filtered].sort((a, b) => b.price - a.price);
        return filtered;
    }, [activeCat, activeFlavor, sortOrder]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0a1a14] pt-20 md:pt-32 pb-20 px-4 md:px-6" // Padding réduit sur mobile
        >
            <div className="max-w-7xl mx-auto">

                {/* Navigation discrète */}
                <div className="inline-flex items-center gap-2 text-rhum-gold/50 hover:text-rhum-gold text-[9px] uppercase tracking-widest mb-8 transition-colors group">
                </div>

                {/* Header compacté pour mobile */}
                <header className="text-center mb-10 md:mb-16 relative">
                    <div className="inline-block relative">
                        {/* Taille de police adaptative : text-2xl sur mobile vs text-7xl sur desktop */}
                        <h1 className="text-2xl md:text-7xl font-serif text-rhum-gold tracking-[0.2em] uppercase mb-2 md:mb-6">
                            NOS BOUTEILLES
                        </h1>
                    </div>
                    <p className="text-rhum-cream/60 font-sans max-w-xl mx-auto italic text-[11px] md:text-lg mt-3 md:mt-4 leading-relaxed px-2">
                        "Découvrez nos bouteilles de fabrication artisanale française aux saveurs uniques."
                    </p>
                </header>

                {/* Composant de filtres optimisé par ailleurs pour le responsive */}
                <ShopFilters
                    categories={CATEGORIES}
                    activeCat={activeCat}
                    onCatChange={setActiveCat}
                    flavors={FLAVORS}
                    activeFlavor={activeFlavor}
                    onFlavorChange={setActiveFlavor}
                    onSortChange={setSortOrder}
                />

                {/* Grille de produits avec espacements resserrés sur mobile */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 md:gap-x-12 md:gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {processedBottles.map((bottle) => (
                            <ProductCard
                                key={bottle.id}
                                bottle={bottle}
                                quantity={quantities[bottle.id] || 1}
                                onUpdateQty={(delta) => updateQty(bottle.id, delta)}
                                isSelected={selectedBottleId === bottle.id}
                                onToggleSelect={() => setSelectedBottleId(selectedBottleId === bottle.id ? null : bottle.id)}
                                onAddToCart={() => handleAddToCart(bottle)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                <ShopReassurance />
            </div>
        </motion.main>
    );
}