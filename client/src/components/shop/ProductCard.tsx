import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductVolume } from '../../types/shop';

interface ProductCardProps {
    product: Product;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: (product: Product, volume: ProductVolume, qty: number) => void;
}

export default function ProductCard({ product, isSelected, onToggleSelect, onAddToCart }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // 🛡️ PROTECTION CRITIQUE : Empêche le crash si volumes est undefined
    const hasVolumes = product?.volumes && product.volumes.length > 0;

    const [selectedVolumeId, setSelectedVolumeId] = useState<string>("");
    const [localQuantity, setLocalQuantity] = useState(1);

    // Initialisation sécurisée de l'ID du volume
    useEffect(() => {
        if (hasVolumes) {
            setSelectedVolumeId(product.volumes[0].id);
        }
    }, [product, hasVolumes]);

    if (!product || !hasVolumes) return null;

    const currentVolume = product.volumes.find(v => v.id === selectedVolumeId) || product.volumes[0];
    const showDescription = isHovered || isSelected;
    const totalPrice = currentVolume.price * localQuantity;
    const qtyOptions = Array.from({ length: Math.min(currentVolume.stock, 10) }, (_, i) => i + 1);

    return (
        <motion.div layout className="group flex flex-col">
            <div
                className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-2 md:mb-8 border border-white/5 shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button type="button" onClick={onToggleSelect} className="absolute inset-0 w-full h-full block z-0">
                    <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
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
                            <p className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] mb-2 font-bold">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-[11px] md:text-lg leading-snug">"{product.description}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`absolute top-2 right-2 z-20 transition-opacity ${showDescription ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 border backdrop-blur-md font-bold ${currentVolume.stock <= 5 ? 'border-red-500/60 text-red-400 bg-black/60' : 'border-rhum-gold/60 text-rhum-gold bg-black/60'}`}>
                        {currentVolume.stock <= 0 ? "Épuisé" : currentVolume.stock <= 5 ? "Limité" : "Disponible"}
                    </span>
                </div>
            </div>

            <div className="flex justify-between items-baseline mb-4 px-1">
                <h3 className="text-sm md:text-2xl font-serif text-white truncate mr-2">{product.name}</h3>
                <span className="text-xs md:text-xl font-serif text-rhum-gold shrink-0">{totalPrice}€</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
                <div className="w-full md:flex-[1.4] relative">
                    <select
                        value={selectedVolumeId}
                        onChange={(e) => {
                            setSelectedVolumeId(e.target.value);
                            setLocalQuantity(1);
                        }}
                        className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[11px] uppercase p-3 outline-none appearance-none cursor-pointer rounded-sm"
                    >
                        {product.volumes.map((vol) => (
                            <option key={vol.id} value={vol.id} className="bg-[#0a1a14] text-white">
                                {vol.size}{vol.unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:flex-1 relative">
                    <select
                        value={localQuantity}
                        onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
                        disabled={qtyOptions.length === 0}
                        className="w-full bg-black/20 border border-rhum-gold/10 text-rhum-gold text-[11px] uppercase p-3 outline-none appearance-none cursor-pointer rounded-sm"
                    >
                        {qtyOptions.length > 0 ? qtyOptions.map(num => (
                            <option key={num} value={num} className="bg-[#0a1a14] text-white">{num}</option>
                        )) : <option value="0">0</option>}
                    </select>
                </div>
            </div>

            <button
                disabled={currentVolume.stock === 0}
                onClick={() => onAddToCart(product, currentVolume, localQuantity)}
                className={`w-full py-4 border border-rhum-gold/30 text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-sm 
                    ${currentVolume.stock === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green shadow-xl'}`}
            >
                {currentVolume.stock === 0 ? 'RUPTURE DE STOCK' : `AJOUTER AU PANIER`}
            </button>
        </motion.div>
    );
}