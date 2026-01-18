import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CAT_FRUITE, CAT_VRAC, CAT_DAME_JEANNE } from '../../data/bottles';

interface ShopFiltersProps {
    activeCat: string;
    onCatChange: (cat: string) => void;
    onSortChange: (sort: string) => void;
}

const SHOP_CATEGORIES = [
    { id: "TOUS", label: "Tous", desc: "Découvrez l'intégralité de nos créations artisanales." },
    { id: CAT_FRUITE, label: "Fruités", desc: "Bouteilles contenant des fruits entiers. Rempotables à l'infini." },
    { id: CAT_VRAC, label: "Vrac", desc: "Infusions filtrées sans fruits pour une dégustation immédiate." },
    { id: CAT_DAME_JEANNE, label: "Dame-Jeanne", desc: "Nos formats de prestige disponibles pour vos événements." }
];

export default function ShopFilters({ activeCat, onCatChange, onSortChange }: ShopFiltersProps) {
    const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-8 mb-16 border-y border-rhum-gold/10 py-10 md:py-14 md:flex-row md:justify-between md:items-end overflow-visible">
            <div className="flex flex-col gap-6">
                <span className="text-[10px] uppercase tracking-[0.4em] text-rhum-gold/40 font-medium ml-1">Collections</span>

                <div className="flex flex-wrap justify-center md:justify-start gap-x-10 gap-y-6">
                    {SHOP_CATEGORIES.map((cat) => (
                        <div key={cat.id} className="relative flex items-center gap-3 group">
                            <button
                                onClick={() => onCatChange(cat.id)}
                                className={`text-lg md:text-xl font-serif tracking-wide transition-all duration-500 relative pb-2 ${
                                    activeCat === cat.id ? "text-rhum-gold opacity-100" : "text-white opacity-25 hover:opacity-100"
                                }`}
                            >
                                {cat.label}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-px bg-rhum-gold"
                                    animate={{ width: activeCat === cat.id ? '100%' : '0%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </button>

                            <div
                                className="relative flex items-center mb-1"
                                onMouseEnter={() => setHoveredInfo(cat.id)}
                                onMouseLeave={() => setHoveredInfo(null)}
                            >
                                <span className="cursor-help text-[10px] w-5 h-5 flex items-center justify-center rounded-full border border-rhum-gold/20 text-rhum-gold/30 hover:text-rhum-gold transition-all italic font-serif">i</span>
                                <AnimatePresence>
                                    {hoveredInfo === cat.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-64 p-5 bg-[#0a1a14] border border-rhum-gold/20 shadow-2xl z-[999] pointer-events-none backdrop-blur-xl"
                                        >
                                            <p className="text-[11px] leading-relaxed text-rhum-cream/80 italic text-center font-sans font-light">
                                                {cat.desc}
                                            </p>
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0a1a14] border-r border-b border-rhum-gold/20 rotate-45 -translate-y-1.5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-3 pt-6 md:pt-0 border-t border-white/5 md:border-t-0">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/30 font-bold font-sans">Trier par</span>
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-transparent text-white/60 text-[11px] uppercase tracking-[0.2em] border-b border-rhum-gold/20 py-2 pr-8 focus:outline-none cursor-pointer appearance-none"
                >
                    <option value="default" className="bg-[#0a1a14]">Ordre Alchimiste</option>
                    <option value="asc" className="bg-[#0a1a14]">Prix croissant</option>
                    <option value="desc" className="bg-[#0a1a14]">Prix décroissant</option>
                </select>
            </div>
        </div>
    );
}