import { motion, AnimatePresence } from 'framer-motion';
import { Bottle } from '../../data/bottles';

// 1. Mise à jour de l'interface pour inclure onAddToCart
interface ProductCardProps {
    bottle: Bottle;
    quantity: number;
    onUpdateQty: (delta: number) => void;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: () => void; // Ajout de la propriété manquante
}

export default function ProductCard({
                                        bottle,
                                        quantity,
                                        onUpdateQty,
                                        isSelected,
                                        onToggleSelect,
                                        onAddToCart // Récupération de la fonction dans les props
                                    }: ProductCardProps) {
    return (
        <motion.div layout className="group">
            <div className="relative aspect-[3/4] bg-black/40 rounded-sm overflow-hidden mb-8 border border-white/5">
                {/* Zone cliquable pour l'image et la description */}
                <button onClick={onToggleSelect} className="w-full h-full relative block">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/60 to-transparent z-10" />
                    <img
                        src={bottle.image}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={bottle.name}
                    />
                </button>

                {/* Overlay de description */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-[#0a1a14]/95 backdrop-blur-md p-8 flex flex-col justify-center items-center text-center"
                        >
                            <p className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] mb-6 font-bold">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-base md:text-lg leading-relaxed mb-8">
                                "{bottle.desc}"
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                                className="group/close flex flex-col items-center gap-2"
                            >
                                <div className="w-8 h-px bg-rhum-gold/30 group-hover/close:w-12 transition-all duration-500 mb-2" />
                                <span className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] font-black group-hover/close:text-white transition-colors">
                                    Fermer
                                </span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Badges de stock */}
                <div className={`absolute top-6 right-6 z-20 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`text-[8px] uppercase tracking-[0.2em] px-2 py-1 border ${bottle.stock === 'Limité' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-rhum-gold/30 text-rhum-gold bg-black/40'}`}>
                        {bottle.stock}
                    </span>
                </div>
            </div>

            {/* Titre et Prix */}
            <div className="flex justify-between items-baseline mb-6">
                <h3 className="text-2xl md:text-3xl font-serif text-white">{bottle.name}</h3>
                <span className="text-xl md:text-2xl font-serif text-rhum-gold leading-none">{bottle.price}€</span>
            </div>

            {/* Sélecteur de Quantité */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 flex items-center justify-between border border-rhum-gold/20 p-1 rounded-sm bg-black/20">
                    <button
                        onClick={() => onUpdateQty(-1)}
                        className="w-10 h-10 flex items-center justify-center text-rhum-gold hover:bg-rhum-gold/10 transition-colors text-xl font-light"
                    >
                        −
                    </button>
                    <span className="text-white font-sans font-bold text-sm tracking-widest">
                        {quantity.toString().padStart(2, '0')}
                    </span>
                    <button
                        onClick={() => onUpdateQty(1)}
                        className="w-10 h-10 flex items-center justify-center text-rhum-gold hover:bg-rhum-gold/10 transition-colors text-xl font-light"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* 2. BOUTON CONNECTÉ À onAddToCart */}
            <button
                onClick={onAddToCart}
                className="w-full py-5 bg-transparent border border-rhum-gold/40 text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black hover:bg-rhum-gold hover:text-rhum-green transition-all shadow-xl rounded-sm"
            >
                AJOUTER AU PANIER
            </button>
        </motion.div>
    );
}