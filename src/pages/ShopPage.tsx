import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BOTTLES, Bottle } from '../data/bottles';
import ProductCard from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import ShopReassurance from '../components/shop/ShopReassurance';

const CATEGORIES = ["Tous", "Rhum Arrangé", "Signature", "Plantes"];
const FLAVORS = ["Tous", "Fruité", "Épicé", "Boisé"];

// Interface pour recevoir la fonction d'ajout du parent
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

    // Déclenchement de l'ajout via la prop parent
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
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a1a14] pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-rhum-gold/50 hover:text-rhum-gold text-[10px] uppercase tracking-widest mb-12 transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour à l'accueil
                </Link>

                <header className="text-center mb-16 relative">
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-7xl font-serif text-rhum-gold tracking-[0.2em] uppercase mb-6">NOS BOUTEILLES</h1>
                        <motion.span key={processedBottles.length} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute -top-4 -right-12 md:-right-16 bg-rhum-gold/10 border border-rhum-gold/30 text-rhum-gold text-[9px] md:text-[11px] font-bold py-1 px-3 rounded-full tracking-widest">
                            {processedBottles.length} ELIXIRS
                        </motion.span>
                    </div>
                    <p className="text-rhum-cream/70 font-sans max-w-2xl mx-auto italic text-sm md:text-lg mt-4 leading-relaxed">
                        "Découvrez nos bouteilles de **fabrication artisanale française** aux saveurs uniques."
                    </p>
                </header>

                <ShopFilters categories={CATEGORIES} activeCat={activeCat} onCatChange={setActiveCat} flavors={FLAVORS} activeFlavor={activeFlavor} onFlavorChange={setActiveFlavor} onSortChange={setSortOrder} />

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
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