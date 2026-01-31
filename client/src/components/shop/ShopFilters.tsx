import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShopFiltersProps {
    activeCat: string;
    onCatChange: (cat: string) => void;
    onSortChange: (sort: string) => void;
}

/**
 * 🏺 Les IDs correspondent désormais aux noms de catégories en base de données
 * pour correspondre au filtrage 'p.category.name' de la ShopPage.
 */
const SHOP_CATEGORIES = [
    { id: "TOUS", label: "Tous", desc: "Découvrez l'intégralité de nos créations artisanales." },
    { id: "Rhum arrangé", label: "Rhum arrangé", desc: "Bouteilles contenant des fruits entiers. Rempotables à l'infini." },
    { id: "Vrac", label: "Vrac", desc: "Rhum arrangé sans fruits prêt à la consommation." },
    { id: "Location de Dame-Jeanne", label: "Location de Dame-Jeanne", desc: "Nos formats de prestige disponibles pour vos événements." }
];

export default function ShopFilters({ activeCat, onCatChange, onSortChange }: ShopFiltersProps) {
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-6 mb-8 md:mb-16 border-y border-rhum-gold/10 py-6 md:py-14 md:flex-row md:justify-between md:items-end">

            {/* COLLECTIONS */}
            <div className="flex flex-col gap-4 items-center md:items-start">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/30 font-bold md:ml-1 text-center">
                    Collections de l'Atelier
                </span>

                <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-4 md:gap-x-10">
                    {SHOP_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="relative flex items-center gap-2 group">
                            <button
                                onClick={() => onCatChange(cat.id)}
                                className={`text-base md:text-xl font-serif tracking-wide transition-all duration-500 relative pb-1 ${
                                    activeCat === cat.id ? "text-rhum-gold opacity-100" : "text-white opacity-30 hover:opacity-100"
                                }`}
                            >
                                {cat.label}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-px bg-rhum-gold"
                                    animate={{ width: activeCat === cat.id ? '100%' : '0%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </button>

                            {/* Info Tooltip */}
                            <div
                                className="relative flex items-center"
                                onMouseEnter={() => setHoveredInfo(cat.id)}
                                onMouseLeave={() => setHoveredInfo(null)}
                            >
                                <span className="cursor-help text-[9px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-rhum-gold/20 text-rhum-gold/30 italic font-serif">i</span>
                                <AnimatePresence>
                                    {hoveredInfo === cat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-56 p-4 bg-[#0a1a14] border border-rhum-gold/20 shadow-2xl z-[999] pointer-events-none backdrop-blur-xl"
                                        >
                                            <p className="text-[10px] leading-relaxed text-rhum-cream/80 italic text-center font-sans">
                                                {cat.desc}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRI */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-4 border-t border-white/5 md:border-t-0 md:pt-0">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/30 font-bold">Ordonner par</span>
                <div className="relative group">
                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-transparent text-white/60 text-[10px] uppercase tracking-[0.2em] border-b border-rhum-gold/20 py-1 pr-8 focus:outline-none cursor-pointer appearance-none hover:text-rhum-gold transition-colors"
                    >
                        <option value="asc" className="bg-[#0a1a14]">Prix croissant</option>
                        <option value="desc" className="bg-[#0a1a14]">Prix décroissant</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-rhum-gold/30 text-[8px] pointer-events-none">▼</span>
                </div>
            </div>
        </div>
    );
}