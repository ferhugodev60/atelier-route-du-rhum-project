import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bottle, BottleSize } from '../../data/bottles.ts';

interface ProductCardProps {
    bottle: Bottle;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: (item: any, qty: number) => void;
}

export default function ProductCard({ bottle, isSelected, onToggleSelect, onAddToCart }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [localQuantity, setLocalQuantity] = useState(1);

    const currentSize: BottleSize = bottle.availableSizes[selectedSizeIndex];
    const showDescription = isHovered || isSelected;
    const totalPrice = currentSize.price * localQuantity;
    const qtyOptions = Array.from({ length: currentSize.stock }, (_, i) => i + 1);

    const getStockLabel = (stock: number) => {
        if (stock <= 0) return "Épuisé";
        if (stock <= 5) return "Limité";
        return "Disponible";
    };

    return (
        <motion.div layout className="group flex flex-col">
            {/* CONTENEUR IMAGE : On passe sur un aspect carré sur mobile pour gagner de la place */}
            <div
                className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-2 md:mb-8 border border-white/5 shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button type="button" onClick={onToggleSelect} className="absolute inset-0 w-full h-full block z-0">
                    <img src={bottle.image} alt={bottle.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/90 via-transparent to-transparent z-10" />
                </button>

                <AnimatePresence>
                    {showDescription && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onToggleSelect}
                            className="absolute inset-0 z-30 bg-[#0a1a14]/95 backdrop-blur-md p-4 md:p-6 flex flex-col justify-center items-center text-center cursor-pointer"
                        >
                            <p className="text-rhum-gold text-[6px] md:text-[8px] uppercase tracking-[0.4em] mb-1 md:mb-2 font-bold pointer-events-none">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-[11px] md:text-lg leading-snug md:leading-relaxed mb-4 md:mb-8 pointer-events-none">"{bottle.desc}"</p>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                                className="md:hidden relative z-50 flex flex-col items-center gap-1.5 p-2 active:scale-95 transition-transform"
                            >
                                <div className="w-8 h-px bg-rhum-gold/30" />
                                <span className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] font-black">Fermer</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BADGE DE STOCK : Réduit sur mobile */}
                <div className={`absolute top-2 right-2 md:top-3 md:right-3 z-20 transition-opacity duration-300 ${showDescription ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`text-[6px] md:text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 border backdrop-blur-md font-bold ${currentSize.stock <= 5 ? 'border-red-500/60 text-red-400 bg-black/60' : 'border-rhum-gold/60 text-rhum-gold bg-black/60'}`}>
                        {getStockLabel(currentSize.stock)}
                    </span>
                </div>
            </div>

            {/* NOM ET PRIX : Tailles de texte réduites */}
            <div className="flex justify-between items-baseline mb-1.5 md:mb-6 px-1">
                <h3 className="text-sm md:text-2xl font-serif text-white truncate mr-2">{bottle.name}</h3>
                <span className="text-xs md:text-xl font-serif text-rhum-gold shrink-0">{totalPrice}€</span>
            </div>

            {/* SÉLECTEURS : Moins hauts sur mobile */}
            <div className="flex flex-col md:flex-row items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
                <div className="w-full md:flex-[1.4] relative group/select">
                    <select
                        value={selectedSizeIndex}
                        onChange={(e) => {
                            const newIndex = parseInt(e.target.value);
                            setSelectedSizeIndex(newIndex);
                            const newStock = bottle.availableSizes[newIndex].stock;
                            if (localQuantity > newStock) setLocalQuantity(newStock > 0 ? newStock : 1);
                        }}
                        className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[9px] md:text-[11px] uppercase tracking-widest p-2 md:p-3 outline-none appearance-none cursor-pointer rounded-sm hover:border-rhum-gold/30 transition-colors"
                    >
                        {bottle.availableSizes.map((size, index) => (
                            <option key={size.capacity} value={index} className="bg-[#0a1a14] text-white">
                                {size.capacity}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/40 text-[7px]">▼</div>
                </div>

                <div className="w-full md:flex-1 relative group/select">
                    <select
                        value={localQuantity}
                        onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
                        className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[9px] md:text-[11px] uppercase tracking-widest p-2 md:p-3 outline-none appearance-none cursor-pointer rounded-sm hover:border-rhum-gold/30 transition-colors"
                    >
                        {qtyOptions.map(num => (
                            <option key={num} value={num} className="bg-[#0a1a14] text-white">{num}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/40 text-[7px]">▼</div>
                </div>
            </div>

            {/* BOUTON D'AJOUT : Moins de padding vertical */}
            <button
                disabled={currentSize.stock === 0}
                onClick={() => onAddToCart({
                    ...bottle,
                    price: currentSize.price,
                    selectedSize: currentSize
                }, localQuantity)}
                className={`w-full py-2.5 md:py-5 border border-rhum-gold/30 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm 
                    ${currentSize.stock === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green shadow-xl'}`}
            >
                {currentSize.stock === 0 ? 'RUPTURE DE STOCK' : `AJOUTER AU PANIER`}
            </button>
        </motion.div>
    );
}