import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Product } from '../../types/shop';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Extraction du prix d'appel
    const startingPrice = product.volumes && product.volumes.length > 0
        ? Math.min(...product.volumes.map(v => v.price))
        : 0;

    /**
     * 🏺 CONSTRUCTION DE L'URL SÉMANTIQUE DYNAMIQUE
     * 1. On utilise le slug de la catégorie s'il existe.
     * 2. Sinon, on transforme le nom de la catégorie (minuscules + tirets).
     * 3. Fallback final sur 'boutique' pour éviter une URL cassée.
     */
    const categoryPath = product.category?.slug ||
        product.category?.name?.toLowerCase().trim().replace(/\s+/g, '-') ||
        'boutique';

    // On utilise le slug du produit ou son ID technique
    const productPath = product.slug || product.id;

    const finalUrl = `/boutique/${categoryPath}/${productPath}`;

    return (
        <Link to={finalUrl} className="group flex flex-col font-sans cursor-pointer">
            <div
                className="relative aspect-square sm:aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-8 border border-white/5 shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Badge Offre Entreprise */}
                {product.volumes && product.volumes.some(v => v.isDiscounted) && (
                    <div className="absolute top-4 left-4 z-40">
                        <span className="bg-rhum-gold text-rhum-green text-[7px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-sm flex items-center gap-2">
                            <span className="w-1 h-1 bg-rhum-green rounded-full animate-pulse" />
                            OFFRE ENTREPRISE
                        </span>
                    </div>
                )}

                <img
                    src={product.image || ''}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-transparent to-transparent z-10" />

                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-[#0a1a14]/60 backdrop-blur-sm flex items-center justify-center"
                        >
                            <span className="border border-rhum-gold/40 text-rhum-gold px-6 py-3 text-[9px] tracking-[0.3em] font-black uppercase">
                                Découvrir
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col px-1">
                <p className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] mb-2 font-black">
                    {product.category?.name}
                </p>

                <div className="flex justify-between items-baseline gap-4">
                    <h3 className="text-2xl font-serif text-white uppercase tracking-tight group-hover:text-rhum-gold transition-colors">
                        {product.name}
                    </h3>
                    <span className="font-serif text-xl text-white">
                        {startingPrice.toFixed(2)}€
                    </span>
                </div>
                <div className="mt-4 w-12 h-[1px] bg-rhum-gold/20 group-hover:w-full transition-all duration-700" />
            </div>
        </Link>
    );
}
