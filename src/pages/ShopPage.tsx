import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const BOTTLES = [
    { id: 1, name: "L'Alchimiste Vol. 1", price: 45, type: "Rhum Arrangé", flavor: "Fruité", image: "/bottle1.png", stock: "Limité" },
    { id: 2, name: "Épices de la Route", price: 48, type: "Signature", flavor: "Épicé", image: "/bottle2.png", stock: "Disponible" },
    { id: 3, name: "Douceur de Compiègne", price: 42, type: "Rhum Arrangé", flavor: "Suave", image: "/bottle3.png", stock: "Disponible" },
    { id: 4, name: "Héritage Floral", price: 55, type: "Plantes", flavor: "Floral", image: "/bottle4.png", stock: "Nouveauté" },
    { id: 5, name: "Bois Noir", price: 52, type: "Signature", flavor: "Boisé", image: "/bottle5.png", stock: "Disponible" },
];

const CATEGORIES = ["Tous", "Rhum Arrangé", "Signature", "Plantes"];
const FLAVORS = ["Tous", "Fruité", "Épicé", "Suave", "Floral", "Boisé"];

export default function ShopPage() {
    const [activeCat, setActiveCat] = useState("Tous");
    const [activeFlavor, setActiveFlavor] = useState("Tous");
    const [sortOrder, setSortOrder] = useState("default");

    // Scroll en haut de page à l'arrivée
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const processedBottles = useMemo(() => {
        let filtered = BOTTLES.filter(bottle => {
            const matchCat = activeCat === "Tous" || bottle.type === activeCat;
            const matchFlavor = activeFlavor === "Tous" || bottle.flavor === activeFlavor;
            return matchCat && matchFlavor;
        });
        if (sortOrder === "asc") return [...filtered].sort((a, b) => a.price - b.price);
        if (sortOrder === "desc") return [...filtered].sort((a, b) => b.price - a.price);
        return filtered;
    }, [activeCat, activeFlavor, sortOrder]);

    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#0a1a14] pt-24 pb-20 px-6"
        >
            <div className="max-w-7xl mx-auto">

                {/* Navigation de secours */}
                <Link to="/" className="inline-flex items-center gap-2 text-rhum-gold/50 hover:text-rhum-gold text-[10px] uppercase tracking-widest mb-12 transition-colors group">
                    <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour à l'accueil
                </Link>

                {/* Header avec compteur dynamique */}
                <header className="text-center mb-16 relative">
                    <div className="inline-block relative">
                        <h1 className="text-4xl md:text-7xl font-serif text-rhum-gold tracking-[0.2em] uppercase mb-6">
                            NOS BOUTEILLES
                        </h1>
                    </div>
                    <p className="text-rhum-cream/70 font-sans max-w-2xl mx-auto italic text-sm md:text-lg mt-4">
                        "Découvrez nos bouteilles de fabrication artisanale française aux saveurs uniques."
                    </p>
                </header>

                {/* Filtres & Tri */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-20 border-y border-rhum-gold/10 py-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Collections</span>
                            <div className="flex gap-6">
                                {CATEGORIES.map(cat => (
                                    <button key={cat} onClick={() => setActiveCat(cat)} className={`text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all pb-1 border-b ${activeCat === cat ? "border-rhum-gold text-white" : "border-transparent text-white/40 hover:text-white/60"}`}>
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/5 hidden md:block" />
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Profils</span>
                            <div className="flex flex-wrap justify-center gap-2">
                                {FLAVORS.slice(0, 4).map(flavor => (
                                    <button key={flavor} onClick={() => setActiveFlavor(flavor)} className={`px-3 py-1 text-[9px] uppercase tracking-widest transition-all border ${activeFlavor === flavor ? "bg-rhum-gold/10 border-rhum-gold text-rhum-gold" : "border-white/5 text-white/30 hover:border-white/20"}`}>
                                        {flavor}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center lg:items-end gap-3">
                        <span className="text-[9px] uppercase tracking-[0.3em] text-rhum-gold/40 font-bold">Trier</span>
                        <select onChange={(e) => setSortOrder(e.target.value)} className="bg-transparent text-white/80 text-[10px] uppercase tracking-widest border-b border-rhum-gold/20 py-1 focus:outline-none cursor-pointer">
                            <option value="default" className="bg-[#0a1a14]">Ordre Alchimiste</option>
                            <option value="asc" className="bg-[#0a1a14]">Prix croissant</option>
                            <option value="desc" className="bg-[#0a1a14]">Prix décroissant</option>
                        </select>
                    </div>
                </div>

                {/* Grille de Produits */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
                    <AnimatePresence mode="popLayout">
                        {processedBottles.map((bottle) => (
                            <motion.div key={bottle.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="group">
                                <div className="relative aspect-[3/4] bg-black/40 rounded-sm overflow-hidden mb-8 border border-white/5 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] to-transparent opacity-80" />
                                    <img src={bottle.image} className="h-[75%] object-contain transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0" alt={bottle.name} />

                                    {/* Badge de stock */}
                                    <div className="absolute top-6 right-6">
                                        <span className={`text-[8px] uppercase tracking-[0.2em] px-2 py-1 border ${bottle.stock === 'Limité' ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-rhum-gold/30 text-rhum-gold bg-black/40'}`}>
                                            {bottle.stock}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-6 left-6">
                                        <span className="text-[9px] uppercase tracking-widest text-white/40">{bottle.type}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-baseline mb-6">
                                    <h3 className="text-2xl md:text-3xl font-serif text-white">{bottle.name}</h3>
                                    <span className="text-xl md:text-2xl font-serif text-rhum-gold leading-none">{bottle.price}€</span>
                                </div>
                                <button className="w-full py-5 bg-transparent border border-rhum-gold/40 text-rhum-gold text-[10px] uppercase tracking-[0.4em] font-black hover:bg-rhum-gold hover:text-rhum-green transition-all shadow-xl rounded-sm">
                                    AJOUTER AU PANIER
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Réassurance Artisanale */}
                <footer className="mt-40 border-t border-rhum-gold/10 pt-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-4">🇫🇷</span>
                            <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Savoir-Faire Français</h4>
                            <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                                Chaque flacon est une création artisanale conçue à la main au cœur de Compiègne.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-4">🛍️</span>
                            <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Retrait à l'Atelier</h4>
                            <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                                Réservez vos bouteilles en ligne et récupérez-les exclusivement à notre atelier de Compiègne. Pas d'expédition, uniquement du circuit court.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-2xl mb-4">🔒</span>
                            <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Paiement Sécurisé</h4>
                            <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                                Transactions protégées par Stripe. Visa, Mastercard et Apple Pay acceptés.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </motion.main>
    );
}