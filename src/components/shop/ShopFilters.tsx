interface ShopFiltersProps {
    categories: string[];
    activeCat: string;
    onCatChange: (cat: string) => void;
    flavors: string[];
    activeFlavor: string;
    onFlavorChange: (f: string) => void;
    onSortChange: (sort: string) => void;
}

export default function ShopFilters({ categories, activeCat, onCatChange, flavors, activeFlavor, onFlavorChange, onSortChange }: ShopFiltersProps) {
    return (
        <div className="flex flex-col gap-6 mb-12 border-y border-rhum-gold/10 py-6 md:py-10 md:flex-row md:justify-between md:items-center">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                {/* Collections : Scroll horizontal sur mobile */}
                <div className="flex flex-col gap-2">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold text-center md:text-left">Collections</span>
                    <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar justify-center md:justify-start">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => onCatChange(cat)}
                                className={`text-[10px] uppercase tracking-[0.2em] whitespace-nowrap pb-1 border-b transition-all ${activeCat === cat ? "border-rhum-gold text-white" : "border-transparent text-white/40"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hidden md:block h-8 w-px bg-white/5" />

                {/* Profils : Plus compact sur mobile */}
                <div className="flex flex-col gap-2">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold text-center md:text-left">Profils</span>
                    <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                        {flavors.map(flavor => (
                            <button
                                key={flavor}
                                onClick={() => onFlavorChange(flavor)}
                                className={`px-2 py-1 text-[8px] uppercase tracking-widest border transition-all ${activeFlavor === flavor ? "bg-rhum-gold/10 border-rhum-gold text-rhum-gold" : "border-white/5 text-white/30"}`}
                            >
                                {flavor}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                <span className="text-[8px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Trier</span>
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-transparent text-white/80 text-[10px] uppercase tracking-widest border-b border-rhum-gold/20 py-1 focus:outline-none"
                >
                    <option value="default" className="bg-[#0a1a14]">Ordre Alchimiste</option>
                    <option value="asc" className="bg-[#0a1a14]">Prix croissant</option>
                    <option value="desc" className="bg-[#0a1a14]">Prix décroissant</option>
                </select>
            </div>
        </div>
    );
}