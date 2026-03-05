import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance.ts';
import { Trash2, Users, ShieldCheck, Gift, Ticket } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { CartItem } from '../../types/cart-item'; // 🏺 L'IMPORT UNIQUE ICI

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onRemove: (cartId: string) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemove }: CartDrawerProps) {
    const { user } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState<string | null>(null);
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

    const [giftCode, setGiftCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [isValidatingCode, setIsValidatingCode] = useState(false);
    const [codeMessage, setCodeMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const isInstitutional = user?.isEmployee || user?.role === 'PRO';

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
            setCodeMessage({ text: `Titre certifié : -${data.balance}€ appliqués.`, type: 'success' });
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
                items: items.map(item => ({
                    type: item.type ? item.type.toUpperCase() : null,
                    amount: Number(item.price || item.amount || 0),
                    workshopId: item.workshopId || (item.type !== 'GIFT_CARD' && !item.volumeId ? item.id : null),
                    volumeId: item.volumeId || null,
                    quantity: Number(item.quantity) || 1,
                    isBusiness: !!item.isBusiness,
                    participants: item.participants || []
                })),
                giftCode: appliedDiscount > 0 ? giftCode : null
            };

            const response = await api.post('/checkout/create-session', payload);

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Échec technique du Registre financier.";
            setOrderError(errorMsg);
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
                            <div>
                                <h2 className="text-xl font-serif text-white tracking-widest uppercase">Registre d'Achat</h2>
                                {isInstitutional && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <ShieldCheck size={10} className="text-rhum-gold" />
                                        <p className="text-[8px] text-rhum-gold uppercase tracking-[0.3em] font-black italic">Avantages Institutionnels Actifs</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={onClose} className="text-rhum-gold hover:text-white transition-colors uppercase text-[10px] tracking-widest font-black">Fermer ×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <p className="text-rhum-cream italic font-serif text-lg">Le registre est vide.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartId} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5 relative flex items-center justify-center">
                                            {item.type === 'GIFT_CARD' ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Gift size={24} className="text-rhum-gold opacity-50" />
                                                    <span className="text-[8px] text-rhum-gold font-black uppercase">Titre</span>
                                                </div>
                                            ) : (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <span className="text-[7px] uppercase tracking-[0.4em] text-rhum-gold/60 mb-1 block font-black italic">
                                                        {item.type === 'GIFT_CARD' ? 'Générosité' : (item.isBusiness ? 'Contrat Pro' : 'Sélection Individuelle')}
                                                    </span>
                                                    <h4 className="text-white font-serif text-lg leading-tight uppercase tracking-tighter">{item.name}</h4>
                                                </div>
                                                <button onClick={() => onRemove(item.cartId)} className="text-white/10 hover:text-red-400 p-1 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <p className="text-rhum-gold/60 text-[9px] uppercase tracking-[0.2em] mt-2 font-bold italic flex items-center gap-2">
                                                {item.type === 'GIFT_CARD' ? <Ticket size={10}/> : <Users size={12} className="opacity-40" />}
                                                {item.type === 'GIFT_CARD' ? `Valeur : ${item.price}€` : `${item.quantity} ${item.workshopId ? 'Places' : 'Unités'}`}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/40 space-y-6">
                                <div className="space-y-3">
                                    <p className="text-[8px] text-white/40 uppercase tracking-[0.3em] font-black">Utiliser un Titre de Cursus</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={giftCode}
                                            onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                                            placeholder="CODE RHUM-XXXX"
                                            className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 text-[10px] tracking-widest font-black uppercase outline-none focus:border-rhum-gold transition-all"
                                        />
                                        <button onClick={handleApplyCode} disabled={isValidatingCode || !giftCode} className="px-6 bg-white/10 text-rhum-gold text-[9px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                                            {isValidatingCode ? '...' : 'Appliquer'}
                                        </button>
                                    </div>
                                    {codeMessage && (
                                        <p className={`text-[8px] uppercase font-black tracking-widest italic ${codeMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {codeMessage.text}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-baseline opacity-40">
                                        <span className="text-[9px] uppercase tracking-[0.4em]">Sous-total</span>
                                        <span className="text-lg font-serif">{subTotal.toLocaleString()} €</span>
                                    </div>
                                    {appliedDiscount > 0 && (
                                        <div className="flex justify-between items-baseline text-green-500">
                                            <span className="text-[9px] uppercase tracking-[0.4em]">Déduction Titre</span>
                                            <span className="text-lg font-serif">-{appliedDiscount.toLocaleString()} €</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-rhum-gold text-[10px] uppercase tracking-[0.5em] font-black">Investissement Final</span>
                                        <span className="text-3xl font-serif text-rhum-gold">{finalTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {orderError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                                            <p className="text-red-400 text-[9px] uppercase tracking-widest font-black text-center">{orderError}</p>
                                        </motion.div>
                                    )}

                                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}>
                                        <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all ${hasAcceptedTerms ? 'bg-rhum-gold border-rhum-gold' : 'border-white/20 bg-white/5'}`}>
                                            {hasAcceptedTerms && <span className="text-[10px] text-rhum-green font-black">✓</span>}
                                        </div>
                                        <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-black italic group-hover:text-white/60 transition-colors">J'accepte les conditions du Registre</label>
                                    </div>

                                    <button
                                        disabled={isSubmitting || !hasAcceptedTerms}
                                        onClick={handleCheckout}
                                        className={`w-full py-5 font-black uppercase tracking-[0.4em] text-[10px] shadow-2xl transition-all ${
                                            (isSubmitting || !hasAcceptedTerms) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-rhum-gold text-rhum-green hover:bg-white hover:text-rhum-dark'
                                        }`}
                                    >
                                        {isSubmitting ? 'SÉCURISATION DU REGISTRE...' : 'Confirmer et Régler'}
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