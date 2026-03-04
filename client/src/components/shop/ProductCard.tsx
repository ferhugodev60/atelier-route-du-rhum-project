import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductVolume } from '../../types/shop';

interface ProductCardProps {
    product: Product;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: (product: Product, volume: ProductVolume, qty: number) => void;
    currentCart?: any[];
}

export default function ProductCard({
                                        product,
                                        isSelected,
                                        onToggleSelect,
                                        onAddToCart,
                                        currentCart = []
                                    }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hasVolumes = product?.volumes && product.volumes.length > 0;
    const [selectedVolumeId, setSelectedVolumeId] = useState<string>("");
    const [localQuantity, setLocalQuantity] = useState(1);

    useEffect(() => {
        if (hasVolumes) setSelectedVolumeId(product.volumes[0].id);
    }, [product, hasVolumes]);

    if (!product || !hasVolumes) return null;

    const currentVolume = product.volumes.find(v => v.id === selectedVolumeId) || product.volumes[0];
    const showDescription = isHovered || isSelected;

    /**
     * 🏺 SCELLAGE DU TARIF ADAPTÉ
     * Le prix affiché correspond au montant final calculé par le Registre.
     */
    const totalPrice = currentVolume.price * localQuantity;
    const isDiscounted = currentVolume.isDiscounted; // État certifié par le Registre

    // 🏺 CALCUL DU STOCK DISPONIBLE RÉEL
    const availableStock = useMemo(() => {
        const itemInCart = currentCart?.find(item => item.volumeId === currentVolume.id);
        const qtyInCart = itemInCart ? itemInCart.quantity : 0;
        return currentVolume.stock - qtyInCart;
    }, [currentVolume, currentCart]);

    const qtyOptions = Array.from({ length: Math.min(availableStock, 10) }, (_, i) => i + 1);

    useEffect(() => {
        if (localQuantity > availableStock && availableStock > 0) {
            setLocalQuantity(1);
        }
    }, [availableStock]);

    return (
        <motion.div layout className="group flex flex-col font-sans">
            <div
                className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-8 border border-white/5 shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* 🏺 BADGE DE CERTIFICATION : OFFRE ENTREPRISE */}
                {isDiscounted && (
                    <div className="absolute top-4 left-4 z-40">
                        <span className="bg-rhum-gold text-rhum-green text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm shadow-xl flex items-center gap-2">
                            <span className="w-1 h-1 bg-rhum-green rounded-full animate-pulse" />
                            OFFRE ENTREPRISE
                        </span>
                    </div>
                )}

                <button type="button" onClick={onToggleSelect} className="absolute inset-0 w-full h-full block z-0">
                    <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/90 via-transparent to-transparent z-10" />
                </button>

                <AnimatePresence>
                    {showDescription && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onToggleSelect} className="absolute inset-0 z-30 bg-[#0a1a14]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center cursor-pointer">
                            <p className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] mb-4 font-black">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-lg leading-relaxed px-2">"{product.description}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col mb-6 px-1">
                <div className="flex justify-between items-baseline gap-4 mb-2">
                    <h3 className="text-2xl font-serif text-white uppercase tracking-tight truncate">{product.name}</h3>

                    <div className="flex flex-col items-end shrink-0">
                        {/* 🏺 AFFICHAGE UNIQUE DU PRIX ADAPTÉ */}
                        <span className={`font-serif text-xl ${isDiscounted ? 'text-rhum-gold' : 'text-white'}`}>
                            {totalPrice.toLocaleString('fr-FR')} €
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 mb-6">
                <div className="w-full md:flex-[2] relative">
                    <select
                        value={selectedVolumeId}
                        onChange={(e) => { setSelectedVolumeId(e.target.value); setLocalQuantity(1); }}
                        className="w-full bg-white/5 border border-white/10 text-rhum-gold text-[10px] font-black uppercase tracking-widest p-4 outline-none appearance-none cursor-pointer hover:border-rhum-gold/40 transition-all rounded-sm"
                    >
                        {product.volumes.map((vol) => (
                            <option key={vol.id} value={vol.id} className="bg-[#0a1a14] text-white">
                                {vol.size} {vol.unit}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/20 text-[8px]">▼</div>
                </div>

                <div className="w-full md:flex-1 relative">
                    <select
                        value={localQuantity}
                        onChange={(e) => setLocalQuantity(parseInt(e.target.value))}
                        disabled={qtyOptions.length === 0}
                        className="w-full bg-white/5 border border-white/10 text-rhum-gold text-[10px] font-black uppercase tracking-widest p-4 outline-none appearance-none cursor-pointer hover:border-rhum-gold/40 transition-all rounded-sm"
                    >
                        {qtyOptions.length > 0 ? qtyOptions.map(num => (
                            <option key={num} value={num} className="bg-[#0a1a14] text-white">{num}</option>
                        )) : <option value="0" className="bg-[#0a1a14] text-white">0</option>}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-rhum-gold/20 text-[8px]">▼</div>
                </div>
            </div>

            <button
                disabled={availableStock <= 0}
                onClick={() => onAddToCart(product, currentVolume, localQuantity)}
                className={`w-full py-5 border text-[9px] uppercase tracking-[0.3em] font-black transition-all rounded-sm shadow-2xl
                    ${availableStock <= 0
                    ? 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed'
                    : 'border-rhum-gold/20 text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green hover:border-rhum-gold'}`}
            >
                {availableStock <= 0 ? 'Stock Indisponible' : `Ajouter à ma sélection`}
            </button>
        </motion.div>
    );
}