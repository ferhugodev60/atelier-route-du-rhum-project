import { motion, AnimatePresence } from 'framer-motion';
import { Bottle } from '../../data/bottles';

interface ProductCardProps {
    bottle: Bottle;
    quantity: number;
    onUpdateQty: (delta: number) => void;
    isSelected: boolean;
    onToggleSelect: () => void;
    onAddToCart: () => void;
}

export default function ProductCard({
                                        bottle,
                                        quantity,
                                        onUpdateQty,
                                        isSelected,
                                        onToggleSelect,
                                        onAddToCart
                                    }: ProductCardProps) {
    return (
        <motion.div layout className="group flex flex-col">
            {/* CONTENEUR IMAGE : Ratio fixe 4/5 sur mobile */}
            <div className="relative aspect-[4/5] md:aspect-[3/4] bg-[#0a1a14] rounded-sm overflow-hidden mb-3 md:mb-8 border border-white/5 shadow-2xl">

                {/* Zone cliquable qui remplit tout le conteneur */}
                <button onClick={onToggleSelect} className="absolute inset-0 w-full h-full block z-0">
                    {/* IMAGE : Forcée à remplir tout le cadre */}
                    <img
                        src={bottle.image}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt={bottle.name}
                    />

                    {/* DÉGRADÉS DE LISIBILITÉ : On utilise des opacités plus douces */}
                    {/* Dégradé du bas pour le nom/prix */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14]/90 via-transparent to-transparent z-10" />

                    {/* Dégradé du haut TRÈS SUBTIL pour le badge (plus de h-1/3 qui coupait l'image) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-10 h-20" />
                </button>

                {/* Overlay de description (Modale interne) */}
                <AnimatePresence>
                    {isSelected && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-30 bg-[#0a1a14]/95 backdrop-blur-md p-4 flex flex-col justify-center items-center text-center"
                        >
                            <p className="text-rhum-gold text-[7px] md:text-[8px] uppercase tracking-[0.4em] mb-2 font-bold">Notes de dégustation</p>
                            <p className="text-rhum-cream/90 font-serif italic text-[13px] md:text-lg leading-relaxed mb-4">
                                "{bottle.desc}"
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
                                className="group/close flex flex-col items-center gap-1"
                            >
                                <div className="w-6 h-px bg-rhum-gold/30 mb-1" />
                                <span className="text-rhum-gold text-[8px] uppercase tracking-[0.4em] font-black">
                                    Fermer
                                </span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* BADGE DE STOCK : Positionné précisément sur l'image */}
                <div className={`absolute top-3 right-3 z-20 transition-opacity duration-300 ${isSelected ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`
                        text-[7px] md:text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 border backdrop-blur-md font-bold
                        ${bottle.stock === 'Limité'
                        ? 'border-red-500/60 text-red-400 bg-black/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'border-rhum-gold/60 text-rhum-gold bg-black/60 shadow-[0_0_15px_rgba(197,163,114,0.1)]'}
                    `}>
                        {bottle.stock}
                    </span>
                </div>
            </div>

            {/* TYPOGRAPHIE : Nom et Prix */}
            <div className="flex justify-between items-baseline mb-2 md:mb-6 px-1">
                <h3 className="text-base md:text-2xl font-serif text-white truncate mr-2">{bottle.name}</h3>
                <span className="text-sm md:text-xl font-serif text-rhum-gold shrink-0">{bottle.price}€</span>
            </div>

            {/* CONTRÔLES : Quantité */}
            <div className="flex items-center gap-2 mb-2 md:mb-4">
                <div className="flex-1 flex items-center justify-between border border-rhum-gold/10 p-0.5 rounded-sm bg-black/10">
                    <button
                        onClick={() => onUpdateQty(-1)}
                        className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-rhum-gold text-base"
                    >
                        −
                    </button>
                    <span className="text-white font-sans font-bold text-[10px] md:text-sm">
                        {quantity.toString().padStart(2, '0')}
                    </span>
                    <button
                        onClick={() => onUpdateQty(1)}
                        className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center text-rhum-gold text-base"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                onClick={onAddToCart}
                className="w-full py-2.5 md:py-5 bg-transparent border border-rhum-gold/30 text-rhum-gold text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-black hover:bg-rhum-gold hover:text-rhum-green transition-all rounded-sm"
            >
                AJOUTER AU PANIER
            </button>
        </motion.div>
    );
}