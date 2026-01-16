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
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-20 border-y border-rhum-gold/10 py-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex flex-col items-center md:items-start gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Collections</span>
                    <div className="flex gap-6">
                        {categories.map(cat => (
                            <button key={cat} onClick={() => onCatChange(cat)} className={`text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all pb-1 border-b ${activeCat === cat ? "border-rhum-gold text-white" : "border-transparent text-white/40 hover:text-white/60"}`}>{cat}</button>
                        ))}
                    </div>
                </div>
                <div className="h-10 w-px bg-white/5 hidden md:block" />
                <div className="flex flex-col items-center md:items-start gap-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Profils</span>
                    <div className="flex flex-wrap justify-center gap-2">
                        {flavors.map(flavor => (
                            <button key={flavor} onClick={() => onFlavorChange(flavor)} className={`px-3 py-1 text-[9px] uppercase tracking-widest transition-all border ${activeFlavor === flavor ? "bg-rhum-gold/10 border-rhum-gold text-rhum-gold" : "border-white/5 text-white/30 hover:border-white/20"}`}>{flavor}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-3">
                <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Trier</span>
                <select onChange={(e) => onSortChange(e.target.value)} className="bg-transparent text-white/80 text-[10px] uppercase tracking-widest border-b border-rhum-gold/20 py-1 focus:outline-none">
                    <option value="default" className="bg-[#0a1a14]">Ordre Alchimiste</option>
                    <option value="asc" className="bg-[#0a1a14]">Prix croissant</option>
                    <option value="desc" className="bg-[#0a1a14]">Prix décroissant</option>
                </select>
            </div>
        </div>
    );
}