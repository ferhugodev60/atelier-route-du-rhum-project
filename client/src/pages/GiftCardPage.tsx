import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

import Logo from '../assets/logo/logo.webp';

export default function GiftCardPage() {
    const navigate = useNavigate();
    const { addItem } = useCartStore();
    const { addToast } = useToastStore();

    const [amount, setAmount] = useState<number>(50);
    const [quantity, setQuantity] = useState<number>(1);
    const presets = [50, 100, 150, 250];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleAddToCart = () => {
        const giftItem = {
            id: `gift-${amount}-${Date.now()}`,
            name: `Carte Cadeau - Titre de ${amount}€`,
            price: amount,
            quantity: quantity,
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1470&auto=format&fit=crop",
            type: 'GIFT_CARD'
        };

        addItem(null, giftItem, quantity);
        addToast(`${quantity} Carte(s) cadeau(x) ajoutée(s) au panier.`);
        navigate('/boutique');
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* 🏺 pt-32 sur desktop pour remonter le tout sans toucher la navbar */
            className="min-h-screen bg-[#0a1a14] pt-28 md:pt-32 lg:pt-40 pb-12 font-sans selection:bg-rhum-gold/30 overflow-x-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

                <header className="text-center mb-10 lg:mb-16">
                    <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif text-white uppercase tracking-tighter leading-tight">
                        Carte <span className="text-rhum-gold">Cadeau</span>
                    </h1>
                    <div className="w-12 lg:w-16 h-px bg-rhum-gold/30 mx-auto mt-4 lg:mt-6" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch max-w-6xl mx-auto">

                    {/* --- 🏺 GAUCHE : LA CARTE (Format ajusté pour 13") --- */}
                    <div className="hidden lg:flex flex-col">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-rhum-gold/5 blur-[80px] rounded-full opacity-20 pointer-events-none" />

                            <motion.div
                                whileHover={{ rotateY: 1, rotateX: -1 }}
                                className="relative z-10 w-full h-full bg-gradient-to-br from-[#122b22] to-[#0a1a14] border border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col items-center justify-center p-10 lg:p-12 min-h-[450px]"
                            >
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
                                <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-rhum-gold/30" />
                                <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-rhum-gold/30" />

                                <div className="text-center space-y-6 w-full">
                                    <img
                                        src={Logo}
                                        alt="Logo L'Établissement"
                                        className="w-36 h-36 lg:w-60 lg:h-60 object-contain mx-auto opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                                    />
                                    <div className="space-y-1">
                                        <h2 className="text-xl lg:text-2xl font-serif text-white uppercase tracking-[0.2em]">Carte Cadeau</h2>
                                    </div>
                                    <div className="h-px w-16 bg-rhum-gold/20 mx-auto" />
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={amount}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-7xl lg:text-8xl font-serif text-white flex items-center justify-center gap-3 leading-none"
                                        >
                                            {amount}<span className="text-3xl lg:text-4xl text-rhum-gold italic">€</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* --- 🏺 DROITE : LE CONFIGURATEUR (Compressé & Précis) --- */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="bg-white/[0.02] border border-white/5 rounded-sm overflow-hidden h-full flex flex-col">

                            {/* Section 01 : Montant (Padding réduit) */}
                            <div className="bg-white/[0.03] p-6 lg:p-10 border-b border-white/5">
                                <h3 className="text-rhum-gold text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em] mb-6 lg:mb-8">1. Valeur de la carte</h3>

                                <div className="grid grid-cols-4 gap-2 mb-8">
                                    {presets.map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setAmount(p)}
                                            className={`py-4 text-[12px] font-black transition-all border ${
                                                amount === p
                                                    ? 'bg-rhum-gold text-rhum-green border-rhum-gold shadow-lg scale-[1.03]'
                                                    : 'bg-white/5 text-white/40 border-white/5 hover:border-rhum-gold/30 hover:text-white'
                                            }`}
                                        >
                                            {p}€
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-6 border-t border-white/5 text-center">
                                    <span className="text-[9px] text-white uppercase font-black tracking-widest block mb-4">Ou Saisie Libre</span>
                                    <div className="flex items-center justify-center gap-3">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                                            className="bg-transparent text-white text-5xl lg:text-6xl outline-none font-serif text-center w-32 focus:text-rhum-gold transition-colors"
                                            placeholder="0"
                                        />
                                        <span className="text-2xl text-rhum-gold font-serif italic">€</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 02 : Quantité (Ajustement chirurgical) */}
                            <div className="p-6 lg:p-10 flex-1 flex flex-col justify-between">
                                <div className="space-y-8">
                                    <h3 className="text-rhum-gold text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">2. Nombre de carte(s)</h3>

                                    <div className="flex items-center justify-between py-6 px-6 bg-white/[0.02] border border-white/5 rounded-sm">
                                        <div className="flex items-center gap-6 lg:gap-8">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-rhum-gold hover:text-white transition-all bg-white/5"
                                            >
                                                <Minus size={18}/>
                                            </button>
                                            <span className="text-4xl lg:text-5xl font-serif text-white w-10 text-center tabular-nums leading-none">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-rhum-gold hover:text-white transition-all bg-white/5"
                                            >
                                                <Plus size={18}/>
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[9px] text-white/30 uppercase tracking-[0.3em] font-black mb-1">Total</span>
                                            <span className="text-3xl lg:text-4xl font-serif text-rhum-gold">{amount * quantity}€</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bouton d'action (Plus compact) */}
                                <div className="space-y-5 pt-8">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-rhum-gold text-rhum-green py-5 lg:py-6 font-black uppercase tracking-[0.3em] text-[12px] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 group"
                                    >
                                        Ajouter au panier
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <div className="flex items-center justify-center gap-3 text-white/30">
                                        <ShieldCheck size={16} />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">Paiement sécurisé via Stripe</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-white text-[11px] lg:text-[12px] leading-relaxed font-light italic px-4 border-l border-rhum-gold/20">
                            Valable 12 mois après l'achat pour l'ensemble des prestations de l'Atelier.
                        </p>
                    </div>

                </div>
            </div>
        </motion.main>
    );
}