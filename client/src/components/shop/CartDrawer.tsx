import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance.ts';
import { Trash2 } from 'lucide-react'; // Utilisation de lucide pour la cohérence

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

    // 🏺 Calcul précis du total institutionnel
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [items]);

    const handleCheckout = async () => {
        if (!hasAcceptedTerms || isSubmitting) return;
        setIsSubmitting(true);
        setOrderError(null);

        try {
            const response = await api.post('/checkout/create-session', {
                items: items.map(item => ({
                    workshopId: item.workshopId,
                    volumeId: item.volumeId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    participants: item.participants
                }))
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                throw new Error("Échec de la passerelle de paiement.");
            }
        } catch (error: any) {
            // 🏺 Utilisation de setOrderError pour informer le client
            setOrderError(error.response?.data?.error || "Une erreur technique est survenue lors du paiement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a1a14] z-[101] shadow-2xl border-l border-rhum-gold/10 flex flex-col font-sans">

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
                                                            {item.workshopId ? 'FORMATION TECHNIQUE' : 'SÉLECTION CAVE'}
                                                        </span>
                                                        <h4 className="text-white font-serif text-lg leading-tight uppercase tracking-tighter">
                                                            {item.name || "Article"}
                                                        </h4>
                                                    </div>
                                                    <button onClick={() => onRemove(item.cartId)} className="text-white/10 hover:text-red-400 transition-colors p-1">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-rhum-gold/60 text-[9px] uppercase tracking-[0.2em] mt-2 font-bold italic">
                                                    Quantité : {item.quantity}
                                                </p>
                                            </div>
                                            <p className="text-white/40 font-serif italic text-sm">
                                                {(item.price * item.quantity).toLocaleString('fr-FR')} €
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/40">
                                {/* 🏺 Affichage de l'erreur si elle existe */}
                                {orderError && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                                        <p className="text-red-400 text-[9px] uppercase tracking-widest font-black text-center">{orderError}</p>
                                    </motion.div>
                                )}

                                {/* 🏺 Case à cocher pour l'acceptation des CGV */}
                                <div
                                    className="flex items-center gap-3 mb-8 group cursor-pointer"
                                    onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}
                                >
                                    <div className={`w-4 h-4 border flex-shrink-0 transition-all flex items-center justify-center ${hasAcceptedTerms ? 'bg-rhum-gold border-rhum-gold' : 'border-white/20 bg-white/5'}`}>
                                        {hasAcceptedTerms && <span className="text-[10px] text-rhum-green font-black">✓</span>}
                                    </div>
                                    <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-none pointer-events-none group-hover:text-white/60 transition-colors">
                                        J'accepte les <span className="text-rhum-gold underline">Conditions Générales de Vente</span>
                                    </label>
                                </div>

                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-rhum-cream/20 text-[9px] uppercase tracking-[0.4em] font-black">Total de la sélection</span>
                                    <span className="text-3xl font-serif text-rhum-gold">
                                        {total.toLocaleString('fr-FR')} €
                                    </span>
                                </div>

                                <button
                                    disabled={isSubmitting || !hasAcceptedTerms}
                                    onClick={handleCheckout}
                                    className={`w-full py-5 font-black uppercase tracking-[0.4em] text-[10px] transition-all rounded-sm shadow-2xl ${
                                        (isSubmitting || !hasAcceptedTerms) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-rhum-gold text-rhum-green hover:bg-white'
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