import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
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
        addToast(`${quantity} Titre(s) ajouté(s) au Registre.`);
        navigate('/boutique');
    };

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            /* 🏺 pt-32 à pt-48 pour garantir que le retour soit bien dégagé de la Navbar */
            className="min-h-screen bg-[#0a1a14] pt-32 sm:pt-40 md:pt-48 pb-20 md:pb-32 font-sans selection:bg-rhum-gold/30 overflow-x-hidden"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

                {/* 1. NAVIGATION : Dégagée de la Navbar fixe */}
                <Link to="/" className="group inline-flex items-center gap-2 text-white/40 hover:text-rhum-gold transition-colors text-[11px] font-black uppercase tracking-[0.4em] mb-12">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Retour
                </Link>

                <header className="text-center mb-12 md:mb-20">
                    <span className="text-rhum-gold text-[10px] md:text-[11px] font-black uppercase tracking-[0.6em] mb-3 block">Nos Prestations</span>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-white uppercase tracking-tighter leading-tight">
                        Carte <span className="text-rhum-gold">Cadeau</span>
                    </h1>
                    <div className="w-16 md:w-24 h-px bg-rhum-gold/30 mx-auto mt-6 md:mt-10" />
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-stretch">

                    {/* --- 🏺 LE CONFIGURATEUR (Seul visible sur Mobile) --- */}
                    <div className="flex flex-col gap-10 max-w-xl mx-auto lg:mx-0 w-full">
                        <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-sm space-y-10 md:space-y-12 flex flex-col justify-between h-full">

                            <div className="space-y-10 md:space-y-12">
                                {/* Étape 1 : Valeur */}
                                <div className="space-y-6">
                                    <label className="text-rhum-gold text-[12px] font-black uppercase tracking-[0.4em] block border-b border-white/5 pb-4">
                                        1. Valeur de la Carte
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {presets.map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setAmount(p)}
                                                className={`py-4 md:py-5 text-[11px] md:text-[12px] font-black transition-all border ${
                                                    amount === p
                                                        ? 'bg-rhum-gold text-rhum-green border-rhum-gold shadow-xl'
                                                        : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                {p}€
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative border-b-2 border-white/10 focus-within:border-rhum-gold transition-colors pt-4">
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
                                            className="w-full bg-transparent text-white py-4 text-4xl md:text-5xl outline-none font-serif text-center"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                {/* Étape 2 : Quantité */}
                                <div className="space-y-6">
                                    <label className="text-rhum-gold text-[12px] font-black uppercase tracking-[0.4em] block border-b border-white/5 pb-4">
                                        2. Nombre de Carte(s)
                                    </label>
                                    <div className="flex items-center justify-between py-6">
                                        <div className="flex items-center gap-10">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white transition-colors bg-white/5 p-4 rounded-full">
                                                <Minus size={24}/>
                                            </button>
                                            <span className="text-5xl font-serif text-white w-12 text-center leading-none">{quantity}</span>
                                            <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white transition-colors bg-white/5 p-4 rounded-full">
                                                <Plus size={24}/>
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[11px] text-white/40 uppercase tracking-widest font-black mb-1">Total</span>
                                            <span className="text-4xl md:text-5xl font-serif text-rhum-gold">{amount * quantity}€</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton d'action */}
                            <div className="space-y-6 pt-6">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-rhum-gold text-rhum-green py-7 font-black uppercase tracking-[0.5em] text-[13px] hover:bg-white transition-all shadow-xl flex items-center justify-center gap-4 group rounded-sm"
                                >
                                    Ajouter au panier
                                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="flex items-center justify-center gap-3 text-white/50">
                                    <ShieldCheck size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Transaction Sécurisée</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 🏺 LA CARTE (Affichée uniquement sur Desktop / Écrans larges) --- */}
                    <div className="hidden lg:flex flex-col">
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0 bg-rhum-gold/10 blur-[100px] rounded-full opacity-20 pointer-events-none" />

                            <motion.div
                                whileHover={{ rotateY: 1, rotateX: -1 }}
                                className="relative z-10 w-full h-full bg-gradient-to-br from-[#122b22] to-[#0a1a14] border border-white/10 rounded-sm shadow-2xl overflow-hidden flex flex-col items-center justify-center p-16 min-h-[500px]"
                            >
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
                                <div className="absolute top-8 left-8 w-10 h-10 border-t border-l border-rhum-gold/30" />
                                <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r border-rhum-gold/30" />

                                <div className="text-center space-y-8 w-full">
                                    <img
                                        src={Logo}
                                        alt="Logo L'Établissement"
                                        className="w-40 h-40 object-contain mx-auto opacity-90 drop-shadow-2xl"
                                    />
                                    <div className="space-y-1">
                                        <span className="block text-rhum-gold text-[12px] font-black uppercase tracking-[0.5em]">L'Établissement</span>
                                        <h2 className="text-3xl font-serif text-white uppercase tracking-[0.2em]">Carte Cadeau</h2>
                                    </div>
                                    <div className="h-px w-20 bg-rhum-gold/20 mx-auto" />
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={amount}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-9xl font-serif text-white flex items-center justify-center gap-4 leading-none"
                                        >
                                            {amount}<span className="text-5xl text-rhum-gold italic">€</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.main>
    );
}