import { motion, AnimatePresence } from 'framer-motion';

// Interface mise à jour pour inclure les nouvelles propriétés des bouteilles
interface CartItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    quantity: number;
    type?: string;
    selectedSize?: {
        price: number;
        capacity: string;
    };
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (id: string | number) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove }: CartDrawerProps) {
    // Calcul du total en vérifiant si le prix est au premier niveau ou dans selectedSize
    const total = items.reduce((sum, item) => {
        const unitPrice = item.price || item.selectedSize?.price || 0;
        return sum + (unitPrice * item.quantity);
    }, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />

                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a1a14] z-[101] shadow-2xl border-l border-rhum-gold/10 flex flex-col">

                        <div className="p-8 border-b border-rhum-gold/10 flex justify-between items-center">
                            <h2 className="text-xl font-serif text-white tracking-widest uppercase">Votre Sélection</h2>
                            <button onClick={onClose} className="text-rhum-gold hover:text-white transition-colors uppercase text-[10px] tracking-widest font-black">Fermer ×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <p className="text-rhum-cream/30 italic font-serif text-lg">"Votre sélection est vide..."</p>
                                </div>
                            ) : (
                                items.map((item) => {
                                    // Détermination du prix unitaire pour l'affichage de la ligne
                                    const itemUnitPrice = item.price || item.selectedSize?.price || 0;

                                    return (
                                        <div key={item.id} className="flex gap-4 group">
                                            <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            {item.type && (
                                                                <span className="text-[7px] uppercase tracking-widest text-rhum-gold/60 mb-1 block">
                                                                    {item.type}
                                                                </span>
                                                            )}
                                                            <h4 className="text-white font-serif text-lg leading-tight">{item.name}</h4>
                                                        </div>
                                                        <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-400 transition-colors p-1" aria-label="Supprimer">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    {/* On affiche la capacité si elle existe (ex: 1 litre) à côté de la quantité */}
                                                    <p className="text-rhum-gold text-[10px] uppercase tracking-widest mt-1">
                                                        {item.selectedSize?.capacity && `${item.selectedSize.capacity} | `}Qté : {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="text-white/60 font-sans text-sm">{itemUnitPrice * item.quantity}€</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/20">
                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-rhum-cream/40 text-[10px] uppercase tracking-[0.3em]">Total estimé</span>
                                    <span className="text-3xl font-serif text-rhum-gold">{total}€</span>
                                </div>
                                <button className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-xl rounded-sm">
                                    Finaliser mon paiement
                                </button>
                                <p className="text-[9px] text-white/20 text-center uppercase tracking-widest mt-6">
                                    Retrait & Ateliers à Compiègne
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}