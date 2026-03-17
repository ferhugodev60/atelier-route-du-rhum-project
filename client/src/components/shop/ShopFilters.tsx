import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom'; // 🏺 Importation du protocole de navigation
import CategoryInfoModal from './CategoryInfoModal';

interface ShopFiltersProps {
    categories: any[];
    activeCat: string;
    onCatChange: (cat: string) => void;
    onSortChange: (sort: string) => void;
}

export default function ShopFilters({ categories, activeCat, onCatChange, onSortChange }: ShopFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const allCategories = [
        {
            id: "default-all",
            name: "TOUS",
            slug: "tous",
            description: "",
            image: ""
        },
        ...categories
    ];

    /**
     * 🏺 SCELLAGE DE L'URL
     * Met à jour le paramètre 'collection' lors du changement de catégorie.
     */
    const handleCategoryClick = (cat: any) => {
        if (cat.name === "TOUS") {
            searchParams.delete('collection');
        } else {
            // On privilégie le slug pour une URL sémantique propre
            searchParams.set('collection', cat.slug || cat.name.toLowerCase());
        }

        setSearchParams(searchParams);
        onCatChange(cat.name);
    };

    /**
     * 🏺 SYNCHRONISATION INITIALE
     * Si l'URL contient déjà une collection (ex: via un lien partagé),
     * on aligne l'état du filtre au chargement.
     */
    useEffect(() => {
        const urlCatSlug = searchParams.get('collection');
        if (urlCatSlug) {
            const matchedCat = allCategories.find(c => (c.slug === urlCatSlug || c.name.toLowerCase() === urlCatSlug));
            if (matchedCat && matchedCat.name !== activeCat) {
                onCatChange(matchedCat.name);
            }
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col gap-8 mb-10 md:mb-14 py-8 md:flex-row md:justify-between md:items-end font-sans">

            {/* COLLECTIONS DYNAMIQUES */}
            <div className="flex flex-col gap-5 items-center md:items-start">
                <span className="text-[10px] uppercase tracking-[0.4em] text-rhum-gold font-black md:ml-1 text-center">
                    Collections de la Maison
                </span>

                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-5 md:gap-x-12">
                    {allCategories.map((cat) => (
                        <div key={cat.id} className="flex items-center gap-4">
                            <button
                                onClick={() => handleCategoryClick(cat)}
                                className={`text-base md:text-xl font-serif tracking-wide transition-all duration-500 relative pb-1 ${
                                    activeCat === cat.name ? "text-rhum-gold" : "text-white hover:text-rhum-gold"
                                }`}
                            >
                                {cat.name === "TOUS" ? "Tous" : cat.name}
                                <motion.div
                                    className="absolute bottom-0 left-0 h-[2px] bg-rhum-gold"
                                    animate={{ width: activeCat === cat.name ? '100%' : '0%' }}
                                    transition={{ duration: 0.4 }}
                                />
                            </button>

                            {cat.name !== "TOUS" && (
                                <button
                                    onClick={() => setSelectedCategory(cat)}
                                    className="w-5 h-5 flex items-center justify-center rounded-full border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green transition-all italic font-serif text-[11px] cursor-pointer"
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
            <div className="flex items-center justify-between md:flex-col md:items-end gap-4 pt-6 border-t border-white/10 md:border-t-0 md:pt-0">
                <span className="text-[10px] uppercase tracking-[0.4em] text-rhum-gold font-black">
                    Ordonner par
                </span>

                <div className="relative">
                    <select
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-transparent text-white text-[11px] font-bold uppercase tracking-[0.2em] border-b border-white/20 py-2 pr-10 focus:outline-none cursor-pointer appearance-none hover:border-rhum-gold transition-colors"
                    >
                        <option value="default" className="bg-[#0a1a14]">SÉLECTIONNER</option>
                        <option value="asc" className="bg-[#0a1a14]">PRIX CROISSANT</option>
                        <option value="desc" className="bg-[#0a1a14]">PRIX DÉCROISSANT</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-rhum-gold text-[10px] pointer-events-none">▼</span>
                </div>
            </div>

            {/* Modal de Collection */}
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