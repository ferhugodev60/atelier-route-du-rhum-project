import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance.ts';
import { Trash2, Briefcase, Users, Info, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

/**
 * 🏺 REGISTRE DE SÉLECTION (PANIER)
 * Gère l'affichage des tarifs préférentiels et le scellage de la commande.
 */

interface CartItem {
    cartId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    workshopId?: string;
    volumeId?: string;
    level?: number;
    isBusiness?: boolean;
    participants?: { firstName: string; lastName: string; phone: string; email: string }[];
}

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

    // 🏺 Détection du Statut Institutionnel pour les avantages boutique
    const isInstitutional = user?.isEmployee || user?.role === 'PRO';

    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [items]);

    const handleCheckout = async () => {
        if (!hasAcceptedTerms || isSubmitting) return;
        setIsSubmitting(true);
        setOrderError(null);

        try {
            // 🏺 Transmission vers le protocole de paiement Stripe
            const response = await api.post('/checkout/create-session', {
                items: items.map(item => ({
                    workshopId: item.workshopId,
                    volumeId: item.volumeId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    isBusiness: item.isBusiness,
                    // 👤 Les participants (identifiés en amont) sont transmis pour le PDF résumé
                    participants: !item.isBusiness ? item.participants : []
                }))
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "Échec technique lors du scellage du registre.";
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
                                        <p className="text-[8px] text-rhum-gold uppercase tracking-[0.3em] font-black italic">Avantages Institutionnels Actifs (-10%)</p>
                                    </div>
                                )}
                            </div>
                            <button onClick={onClose} className="text-rhum-gold hover:text-white transition-colors uppercase text-[10px] tracking-widest font-black">Fermer ×</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <p className="text-rhum-cream italic font-serif text-lg">Le registre est actuellement vide.</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.cartId} className="flex gap-4 group">
                                        <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5 relative">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                            {item.isBusiness && (
                                                <div className="absolute top-0 left-0 bg-rhum-gold p-1 shadow-lg">
                                                    <Briefcase size={10} className="text-rhum-green" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 pr-4">
                                                        <span className="text-[7px] uppercase tracking-[0.4em] text-rhum-gold/60 mb-1 block font-black italic">
                                                            {item.isBusiness ? 'Contrat Institutionnel' : 'Sélection Individuelle'}
                                                        </span>
                                                        <h4 className="text-white font-serif text-lg leading-tight uppercase tracking-tighter">
                                                            {item.name}
                                                        </h4>
                                                    </div>
                                                    <button onClick={() => onRemove(item.cartId)} className="text-white/10 hover:text-red-400 transition-colors p-1">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <p className="text-rhum-gold/60 text-[9px] uppercase tracking-[0.2em] mt-3 font-bold italic flex items-center gap-2">
                                                    <Users size={12} className="opacity-40" />
                                                    {item.quantity} {item.workshopId ? 'Places en Séance' : 'Unités'}
                                                </p>

                                                {/* 🏺 Rappel logistique pour les Professionnels */}
                                                {item.isBusiness && (
                                                    <div className="mt-3 p-2 bg-white/5 border border-rhum-gold/10 rounded-sm flex gap-2 items-start">
                                                        <Info size={10} className="text-rhum-gold mt-0.5 flex-shrink-0" />
                                                        <p className="text-[7px] text-white/40 leading-relaxed uppercase font-black">
                                                            Capacité max : 15 pers / session. Contactez l'Établissement après achat.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-baseline mt-2">
                                                <p className="text-white/40 font-serif italic text-sm">
                                                    {(item.price * item.quantity).toLocaleString('fr-FR')} €
                                                </p>
                                                {isInstitutional && item.volumeId && (
                                                    <span className="text-[7px] text-rhum-gold font-black uppercase tracking-widest border border-rhum-gold/20 px-1 rounded-sm">Tarif Membre</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-8 border-t border-rhum-gold/10 bg-black/40">
                                {orderError && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-sm">
                                        <p className="text-red-400 text-[9px] uppercase tracking-widest font-black text-center">
                                            {orderError}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="flex items-center gap-3 mb-8 group cursor-pointer" onClick={() => setHasAcceptedTerms(!hasAcceptedTerms)}>
                                    <div className={`w-4 h-4 border flex-shrink-0 transition-all flex items-center justify-center ${hasAcceptedTerms ? 'bg-rhum-gold border-rhum-gold' : 'border-white/20 bg-white/5'}`}>
                                        {hasAcceptedTerms && <span className="text-[10px] text-rhum-green font-black">✓</span>}
                                    </div>
                                    <label className="text-[9px] text-white/40 uppercase tracking-[0.2em] leading-none pointer-events-none group-hover:text-white/60 transition-colors">
                                        J'accepte les <span className="text-rhum-gold underline font-black uppercase">Conditions du Registre</span>
                                    </label>
                                </div>

                                <div className="flex justify-between items-baseline mb-8">
                                    <span className="text-rhum-cream/20 text-[9px] uppercase tracking-[0.4em] font-black">Investissement Global</span>
                                    <span className="text-3xl font-serif text-rhum-gold">
                                        {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                    </span>
                                </div>

                                <button
                                    disabled={isSubmitting || !hasAcceptedTerms}
                                    onClick={handleCheckout}
                                    className={`w-full py-5 font-black uppercase tracking-[0.4em] text-[10px] transition-all rounded-sm shadow-2xl ${
                                        (isSubmitting || !hasAcceptedTerms) ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-rhum-gold text-rhum-green hover:bg-white'
                                    }`}
                                >
                                    {isSubmitting ? 'SÉCURISATION DU REGISTRE...' : 'Confirmer et Régler'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}