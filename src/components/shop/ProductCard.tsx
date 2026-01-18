import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bottle, BottleSize } from '../../data/bottles';

interface ProductCardProps {
    bottle: Bottle;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: (item: any) => void;
}

export default function ProductCard({ bottle, isSelected, onToggleSelect, onAddToCart }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
    const [localQuantity, setLocalQuantity] = useState(1);

    const currentSize: BottleSize = bottle.availableSizes[selectedSizeIndex];
    const showDescription = isHovered || isSelected;
    const totalPrice = currentSize.price * localQuantity;

    // Le dropdown respecte maintenant le stock réel
    const qtyOptions = Array.from({ length: currentSize.stock }, (_, i) => i + 1);

    const getStockLabel = (stock: number) => {
        if (stock <= 0) return "Épuisé";
        if (stock <= 5) return "Limité";
        return "Disponible";
    };

    return (
        <motion.div layout className="group flex flex-col">
            <div className="relative aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-3 md:mb-8 border border-white/5 shadow-2xl"
                 onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

                <button type="button" onClick={onToggleSelect} className="absolute inset-0 w-full h-full block z-0">
                    <img src={bottle.image} alt={bottle.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/90 via-transparent to-transparent z-10" />
                </button>

                <AnimatePresence>
                    {showDescription && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={onToggleSelect}
                                    className="absolute inset-0 z-30 bg-[#0a1a14]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center cursor-pointer">
                            <p className="text-rhum-gold text-[7px] md:text-[8px] uppercase tracking-[0.4em] mb-2 font-bold pointer-events-none">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-[13px] md:text-lg leading-relaxed mb-8 pointer-events-none">"{bottle.desc}"</p>
                            <button type="button" onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                                    className="md:hidden relative z-50 flex flex-col items-center gap-2 p-4 active:scale-95 transition-transform">
                                <div className="w-12 h-px bg-rhum-gold/30" />
                                <span className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black">Fermer</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`absolute top-3 right-3 z-20 transition-opacity duration-300 ${showDescription ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`text-[7px] md:text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 border backdrop-blur-md font-bold ${currentSize.stock <= 5 ? 'border-red-500/60 text-red-400 bg-black/60' : 'border-rhum-gold/60 text-rhum-gold bg-black/60'}`}>
                        {getStockLabel(currentSize.stock)}
                    </span>
                </div>
            </div>

            <div className="mb-2 px-1">
                <span className={`text-[7px] uppercase tracking-[0.2em] font-bold ${bottle.category === 'Fruité' ? 'text-green-400' : 'text-rhum-gold/40'}`}>
                    {bottle.category === 'Fruité' ? '● Rempotable à l\'infini' : `● ${bottle.category}`}
                </span>
            </div>

            <div className="flex justify-between items-baseline mb-2 md:mb-6 px-1">
                <h3 className="text-base md:text-2xl font-serif text-white truncate mr-2">{bottle.name}</h3>
                <span className="text-sm md:text-xl font-serif text-rhum-gold shrink-0">{totalPrice}€</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mb-2 md:mb-4">
                <div className="w-full md:flex-[1.4] relative group/select">
                    <select value={selectedSizeIndex} onChange={(e) => {
                        const newIndex = parseInt(e.target.value);
                        setSelectedSizeIndex(newIndex);
                        const newStock = bottle.availableSizes[newIndex].stock;
                        if (localQuantity > newStock) setLocalQuantity(newStock > 0 ? newStock : 1);
                    }} className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[10px] md:text-[11px] uppercase tracking-widest p-3 outline-none appearance-none cursor-pointer rounded-sm">
                        {bottle.availableSizes.map((size, index) => (
                            <option key={size.capacity} value={index} className="bg-[#0a1a14] text-white">{size.capacity}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/40 text-[8px]">▼</div>
                </div>

                <div className="w-full md:flex-1 relative group/select">
                    <select value={localQuantity} onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
                            className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[10px] md:text-[11px] uppercase tracking-widest p-3 outline-none appearance-none cursor-pointer rounded-sm">
                        {qtyOptions.map(num => (
                            <option key={num} value={num} className="bg-[#0a1a14] text-white">{num}</option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/40 text-[8px]">▼</div>
                </div>
            </div>

            <button disabled={currentSize.stock === 0} onClick={() => onAddToCart({ ...bottle, selectedSize: currentSize, quantity: localQuantity, totalPrice: totalPrice })}
                    className={`w-full py-3 md:py-5 border border-rhum-gold/30 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm ${currentSize.stock === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green shadow-xl'}`}>
                {currentSize.stock === 0 ? 'RUPTURE DE STOCK' : `AJOUTER AU PANIER`}
            </button>
        </motion.div>
    );
}