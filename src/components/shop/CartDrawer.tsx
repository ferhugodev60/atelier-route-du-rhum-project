import { motion, AnimatePresence } from 'framer-motion';
import { Bottle } from '../../data/bottles';

interface CartItem extends Bottle {
    quantity: number;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: number) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove }: CartDrawerProps) {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay sombre */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Panneau latéral */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a1a14] z-[101] shadow-2xl border-l border-rhum-gold/10 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-rhum-gold/10 flex justify-between items-center">
                            <h2 className="text-xl font-serif text-white tracking-widest uppercase">
                                Votre Sélection
                            </h2>
                            <button onClick={onClose} className="text-rhum-gold hover:text-white transition-colors uppercase text-[10px] tracking-widest font-black">
                                Fermer ×
                            </button>
                        </div>

                        {/* Liste des produits */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <p className="text-rhum-cream/30 italic font-serif text-lg">"Votre panier est vide..."</p>
                                    <button onClick={onClose} className="mt-4 text-rhum-gold text-[10px] uppercase tracking-widest underline">Explorer la cave</button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h4 className="text-white font-serif text-lg leading-tight">{item.name}</h4>
                                                    <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-400 transition-colors text-xs">Supprimer</button>
                                                </div>
                                                <p className="text-rhum-gold text-[10px] uppercase tracking-widest mt-1">Qté : {item.quantity}</p>
                                            </div>
                                            <p className="text-white/60 font-sans text-sm">{item.price * item.quantity}€</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer avec Total */}
                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/20">
                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-rhum-cream/40 text-[10px] uppercase tracking-[0.3em]">Total estimé</span>
                                    <span className="text-3xl font-serif text-rhum-gold">{total}€</span>
                                </div>
                                <button className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-xl rounded-sm">
                                    Valider ma réservation
                                </button>
                                <p className="text-[9px] text-white/20 text-center uppercase tracking-widest mt-6">
                                    Retrait exclusif à l'atelier de Compiègne
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}