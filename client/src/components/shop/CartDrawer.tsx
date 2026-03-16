import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance.ts';
import { Trash2, Users, Gift, Ticket, ChevronDown, ChevronUp, Plus, Wine } from 'lucide-react';
import { CartItem } from '../../types/cart-item';
import { Link } from "react-router-dom";

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

    const [isGiftOpen, setIsGiftOpen] = useState(false);
    const [isTotalDetailsOpen, setIsTotalDetailsOpen] = useState(false);

    const [giftCode, setGiftCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [codeMessage, setCodeMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const subTotal = useMemo(() => {
        return items.reduce((sum, item) => {
            const itemPrice = Number(item.price) || 0;
            return sum + (itemPrice * item.quantity);
        }, 0);
    }, [items]);

    const finalTotal = useMemo(() => {
        return Math.max(0, subTotal - appliedDiscount);
    }, [subTotal, appliedDiscount]);

    const handleApplyCode = async () => {
        if (!giftCode.trim()) return;
        setIsValidatingCode(true);
        setCodeMessage(null);

        try {
            const { data } = await api.post('/gift-cards/validate', { code: giftCode });
            setAppliedDiscount(data.balance);
            setCodeMessage({ text: `Certifié : -${data.balance}€ appliqués.`, type: 'success' });
        } catch (error: any) {
            const msg = error.response?.data?.error || "Code inconnu ou caduc.";
            setCodeMessage({ text: msg, type: 'error' });
            setAppliedDiscount(0);
        } finally {
            setIsValidatingCode(false);
        }
    };

    const handleCheckout = async () => {
        if (!hasAcceptedTerms || isSubmitting) return;
        setIsSubmitting(true);
        setOrderError(null);

        try {
            const payload = {
                items: items.map(item => {
                    const isWorkshop = item.workshopId || item.level !== undefined;
                    const isGiftCard = item.type === 'GIFT_CARD';
                    const isProduct = !isWorkshop && !isGiftCard;
                    return {
                        workshopId: isWorkshop ? (item.workshopId || item.id) : null,
                        volumeId: isProduct ? (item.volumeId || item.id) : null,
                        type: isGiftCard ? 'GIFT_CARD' : (isWorkshop ? 'WORKSHOP' : 'PRODUCT'),
                        price: Number(item.price || 0),
                        quantity: Number(item.quantity) || 1,
                        isBusiness: !!item.isBusiness,
                        participants: item.participants || [],
                        name: item.name
                    };
                }),
                giftCardCode: appliedDiscount > 0 ? giftCode : null
            };
            const response = await api.post('/checkout/create-session', payload);
            if (response.data.url) window.location.href = response.data.url;
        } catch (error: any) {
            setOrderError(error.response?.data?.error || "Échec de synchronisation financière.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-[#0a1a14] z-[101] shadow-2xl border-l border-white/10 flex flex-col font-sans selection:bg-rhum-gold selection:text-black">

                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/40">
                            <h2 className="text-xl font-serif text-white tracking-widest uppercase leading-none">Votre panier</h2>
                            <button
                                onClick={onClose}
                                className="text-rhum-gold/60 hover:text-white transition-colors text-4xl font-extralight leading-none flex items-center justify-center -mt-1 cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <p className="text-white/20 uppercase tracking-[0.3em] font-black text-xs">Votre registre est vide.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartId} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-white/[0.03] border border-white/5 overflow-hidden flex-shrink-0 relative flex items-center justify-center">
                                            {item.type === 'GIFT_CARD' ? <Gift size={24} className="text-rhum-gold" /> : <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="text-white font-serif text-lg leading-tight uppercase tracking-tighter">{item.name}</h4>
                                                </div>
                                                <button onClick={() => onRemove(item.cartId)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                            </div>
                                            <p className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
                                                {item.type === 'GIFT_CARD' ? (
                                                    <Ticket size={10}/>
                                                ) : item.workshopId ? (
                                                    <Users size={12} />
                                                ) : (
                                                    <Wine size={12} />
                                                )}

                                                {/* 🏺 CORRECTION : Intégration de la quantité pour tous les types d'articles */}
                                                {item.type === 'GIFT_CARD'
                                                    ? `${item.quantity} Unité(s) • Valeur : ${item.price}€`
                                                    : `${item.quantity} ${item.workshopId ? 'Participant(s)' : 'bouteille(s)'}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-white/10 bg-black/60 space-y-4">

                                <div className="border-b border-white/5 pb-2">
                                    <button
                                        onClick={() => setIsGiftOpen(!isGiftOpen)}
                                        className="w-full flex items-center justify-between text-[9px] uppercase tracking-[0.3em] font-black text-white hover:text-rhum-gold transition-colors py-2"
                                    >
                                        <span>Vous avez une carte cadeau ?</span>
                                        {isGiftOpen ? <ChevronUp size={12} /> : <Plus size={12} />}
                                    </button>
                                    <AnimatePresence>
                                        {isGiftOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                                <div className="pt-4 pb-2 space-y-3">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={giftCode}
                                                            onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                                                            placeholder="VOTRE CODE"
                                                            className="flex-1 bg-white/[0.03] border border-white/10 text-white px-4 py-3 text-[10px] tracking-widest font-black uppercase outline-none focus:border-rhum-gold transition-all"
                                                        />
                                                        <button onClick={handleApplyCode} disabled={isValidatingCode || !giftCode} className="px-6 bg-rhum-gold text-rhum-green text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30">
                                                            {isValidatingCode ? '...' : 'Valider'}
                                                        </button>
                                                    </div>
                                                    {codeMessage && (
                                                        <p className={`text-[8px] uppercase font-black tracking-widest ${codeMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                            {codeMessage.text}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center group cursor-pointer" onClick={() => setIsTotalDetailsOpen(!isTotalDetailsOpen)}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-rhum-gold text-[10px] uppercase tracking-[0.5em] font-black">Total</span>
                                            {isTotalDetailsOpen ? <ChevronDown size={12} className="text-white/20" /> : <ChevronUp size={12} className="text-white/20" />}
                                        </div>
                                        <span className="text-3xl font-serif text-rhum-gold leading-none tracking-tighter">
                                            {finalTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {isTotalDetailsOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 pt-4 space-y-3">
                                                <div className="flex justify-between items-baseline text-white/40">
                                                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Sous-total</span>
                                                    <span className="text-sm font-serif">{subTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                                                </div>
                                                {appliedDiscount > 0 && (
                                                    <div className="flex justify-between items-baseline text-green-500">
                                                        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Déduction Carte cadeau</span>
                                                        <span className="text-sm font-serif">-{appliedDiscount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="pt-4 space-y-6">
                                    {orderError && (
                                        <p className="text-red-500 text-[8px] uppercase font-black text-center bg-red-500/5 p-3 border border-red-500/10 tracking-widest">{orderError}</p>
                                    )}

                                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}>
                                        <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${hasAcceptedTerms ? 'bg-rhum-gold border-rhum-gold' : 'border-white/20 bg-white/5'}`}>
                                            {hasAcceptedTerms && <span className="text-[10px] text-rhum-green font-black">✓</span>}
                                        </div>
                                        <label className="text-[9px] text-white/50 uppercase tracking-[0.2em] font-black group-hover:text-white transition-colors cursor-pointer">
                                            J'accepte les <Link to="/cgv" onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-rhum-gold underline underline-offset-4 decoration-rhum-gold/30 hover:text-white">conditions générales de vente</Link>
                                        </label>
                                    </div>

                                    <button
                                        disabled={isSubmitting || !hasAcceptedTerms}
                                        onClick={handleCheckout}
                                        className={`w-full py-5 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all ${
                                            (isSubmitting || !hasAcceptedTerms) ? 'bg-white/5 text-white/10 cursor-not-allowed' : 'bg-rhum-gold text-rhum-green hover:bg-white'
                                        }`}
                                    >
                                        {isSubmitting ? 'VERROUILLAGE DU RÉSEAU...' : 'Confirmer et Régler'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}