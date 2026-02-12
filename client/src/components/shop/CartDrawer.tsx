import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance.ts';

interface CartItem {
    cartId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    workshopId?: string;
    volumeId?: string;
    level?: number;
    participants?: { firstName: string; lastName: string; phone: string }[];
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (cartId: string) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove }: CartDrawerProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getItemLabel = (item: CartItem) => {
        if (item.workshopId) {
            return typeof item.level === 'number' && item.level > 0
                ? `FORMATION · NIVEAU ${item.level}`
                : 'INITIATION & DÉGUSTATION';
        }
        return 'SÉLECTION CAVE';
    };

    /**
     * INITIALISATION DU PROCESSUS DE PAIEMENT
     */
    const handleCheckout = async () => {
        if (!hasAcceptedTerms || isSubmitting) return;

        setIsSubmitting(true);
        setOrderError(null);

        try {
            const response = await api.post('/checkout/create-session', {
                items: items.map(item => ({
                    cartId: item.cartId,
                    workshopId: item.workshopId,
                    volumeId: item.volumeId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    participants: item.participants
                }))
            });

            const { url } = response.data;

            if (url) {
                window.location.href = url;
            } else {
                throw new Error("Le serveur n'a pas pu générer l'URL de paiement.");
            }

        } catch (error: any) {
            console.error("Erreur technique de paiement :", error);
            setOrderError(
                error.response?.data?.error ||
                "Une erreur est survenue lors de l'initialisation du paiement. Veuillez réessayer."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />

                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a1a14] z-[101] shadow-2xl border-l border-rhum-gold/10 flex flex-col">

                        <div className="p-8 border-b border-rhum-gold/10 flex justify-between items-center bg-black/20">
                            <h2 className="text-xl font-serif text-white tracking-widest uppercase">Votre Sélection</h2>
                            <button onClick={onClose} className="text-rhum-gold hover:text-white transition-colors uppercase text-[10px] tracking-widest font-black">Fermer ×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <p className="text-rhum-cream italic font-serif text-lg">Votre panier est actuellement vide.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartId} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 pr-4">
                                                        <span className="text-[7px] uppercase tracking-[0.4em] text-rhum-gold/60 mb-1 block font-black italic">
                                                            {getItemLabel(item)}
                                                        </span>
                                                        <h4 className="text-white font-serif text-lg leading-tight uppercase tracking-tighter">
                                                            {item.name || "Article"}
                                                        </h4>
                                                    </div>
                                                    <button onClick={() => onRemove(item.cartId)} className="text-white/10 hover:text-red-400 transition-colors p-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244 2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
                                                    </button>
                                                </div>

                                                <p className="text-rhum-gold/60 text-[9px] uppercase tracking-[0.2em] mt-2 font-bold italic">
                                                    {item.workshopId
                                                        ? `${item.participants?.length || item.quantity} Participant(s)`
                                                        : `Quantité : ${item.quantity}`
                                                    }
                                                </p>
                                            </div>
                                            <p className="text-white/40 font-serif italic text-sm">{item.price * item.quantity}€</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/40">
                                {orderError && (
                                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[9px] uppercase tracking-wider text-center mb-6 bg-red-400/5 py-3 border border-red-400/20 px-4">
                                        {orderError}
                                    </motion.p>
                                )}

                                {/* CASE À COCHER CGV ALIGNÉE */}
                                <div
                                    className="flex items-center gap-3 mb-8 group cursor-pointer"
                                    onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                                >
                                    <div className={`w-4 h-4 border flex-shrink-0 transition-colors flex items-center justify-center ${hasAcceptedTerms ? 'bg-rhum-gold border-rhum-gold' : 'border-white/20 bg-white/5'}`}>
                                        {hasAcceptedTerms && <span className="text-[10px] text-rhum-green font-black">✓</span>}
                                    </div>
                                    <label className="text-[10px] text-white/40 uppercase tracking-widest leading-none pointer-events-none">
                                        J'ai lu et j'accepte les <button className="text-rhum-gold underline hover:text-white transition-colors">Conditions Générales de Vente</button>
                                    </label>
                                </div>

                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-rhum-cream/20 text-[9px] uppercase tracking-[0.4em] font-black">Total de la commande</span>
                                    <span className="text-3xl font-serif text-rhum-gold">{total}€</span>
                                </div>

                                <button
                                    disabled={isSubmitting || !hasAcceptedTerms}
                                    onClick={handleCheckout}
                                    className={`w-full py-5 font-black uppercase tracking-[0.4em] text-[10px] transition-all rounded-sm shadow-2xl ${
                                        (isSubmitting || !hasAcceptedTerms)
                                            ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                            : 'bg-rhum-gold text-rhum-green hover:bg-white active:scale-[0.98]'
                                    }`}
                                >
                                    {isSubmitting ? 'Traitement en cours...' : 'Confirmer et payer'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}