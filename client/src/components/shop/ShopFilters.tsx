import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryInfoModal from './CategoryInfoModal'; // 🏺 Importation de la nouvelle modal

interface ShopFiltersProps {
    categories: any[];
    activeCat: string;
    onCatChange: (cat: string) => void;
    onSortChange: (sort: string) => void;
}

export default function ShopFilters({ categories, activeCat, onCatChange, onSortChange }: ShopFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

    const allCategories = [
        {
            id: "default-all",
            name: "TOUS",
            description: "",
            image: ""
        },
        ...categories
    ];

    return (
        <div className="flex flex-col gap-6 mb-8 md:mb-16 border-y border-rhum-gold/10 py-6 md:py-14 md:flex-row md:justify-between md:items-end font-sans">

            {/* COLLECTIONS DYNAMIQUES */}
            <div className="flex flex-col gap-4 items-center md:items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/30 font-black md:ml-1 text-center">
                    Collections de la Maison
                </span>

                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-4 md:gap-x-10">
                    {allCategories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-3">
                            <button
                                onClick={() => onCatChange(cat.name)}
                                className={`text-base md:text-xl font-serif tracking-wide transition-all duration-500 relative pb-1 ${
                                    activeCat === cat.name ? "text-rhum-gold" : "text-white/30 hover:text-white"
                                }`}
                            >
                                {cat.name === "TOUS" ? "Tous" : cat.name}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-px bg-rhum-gold"
                                    animate={{ width: activeCat === cat.name ? '100%' : '0%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </button>

                            {/* 🏺 Déclencheur de la Modal de Collection */}
                            {cat.name !== "TOUS" && (
                                <button
                                    onClick={() => setSelectedCategory(cat)}
                                    className="w-5 h-5 flex items-center justify-center rounded-full border border-rhum-gold/20 text-rhum-gold/40 hover:text-rhum-gold hover:border-rhum-gold transition-all italic font-serif text-[10px]"
                                    title="Présentation de la collection"
                                >
                                    i
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* TRI TECHNIQUE */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 border-t border-white/5 md:border-t-0 md:pt-0">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/30 font-black">Ordonner par</span>
                <div className="relative">
                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-transparent text-white/60 text-[10px] uppercase tracking-[0.2em] border-b border-rhum-gold/20 py-1 pr-8 focus:outline-none cursor-pointer appearance-none hover:text-rhum-gold transition-colors"
                    >
                        <option value="default" className="bg-[#0a1a14]">SÉLECTIONNER</option>
                        <option value="asc" className="bg-[#0a1a14]">PRIX CROISSANT</option>
                        <option value="desc" className="bg-[#0a1a14]">PRIX DÉCROISSANT</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-rhum-gold/30 text-[8px] pointer-events-none">▼</span>
                </div>
            </div>

            {/* 🏺 Affichage de la Modal si une catégorie est sélectionnée */}
            <AnimatePresence>
                {selectedCategory && (
                    <CategoryInfoModal
                        category={selectedCategory}
                        onClose={() => setSelectedCategory(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}