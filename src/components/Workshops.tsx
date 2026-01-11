import React from 'react';
import { motion } from 'framer-motion';

// Images d'illustration
const imgDiscovery = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSysDAq-Q1wZA2OCfAXQEfH2_NoxWxvEJNk1kC3Xs0vf4bXzyHzCWC0mp1_f_6id7V93XTGpG9WNeo2uA9JvegdR9SFR1iVlQ1wFUM0-lqUhzG0JQiyU0Vs9PKE9NvV_n5A2uc6MLX4CiSE=s1360-w1360-h1020-rw";
const imgConception = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxesaujZl4ZPCbrFQ6D9xN13gsc3OkfKD7G2B65yb1q3EGK4GC7b0Hutcl6uuho7h83cBVFUkTSWYg5xc6A0bNBvxpHS_DY_WMLD60FEGeuJs49MKmz2yM3lsFpFDwrpml9qpPxD2SwqU=s1360-w1360-h1020-rw";

const Workshops: React.FC = () => {
    return (
        <section id="workshops" className="py-16 md:py-24 bg-white px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête de section */}
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-serif text-rhum-green">La Carte de l'Atelier</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24">
                    {/* --- Carte Atelier Découverte --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative bg-[#081c15] rounded-sm overflow-hidden flex flex-col shadow-xl shadow-rhum-gold/5 hover:shadow-rhum-gold/20 transition-all duration-500"
                    >
                        <div className="relative h-48 md:h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-[#081c15]/60 to-transparent z-10"></div>
                            <img
                                src={imgDiscovery}
                                alt="Ambiance Atelier Découverte"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 z-20">
                                <span className="text-3xl md:text-4xl font-serif text-rhum-gold drop-shadow-lg">60€</span>
                            </div>
                        </div>

                        {/* Padding réduit sur mobile (p-6 vs p-10) */}
                        <div className="p-6 md:p-10 flex flex-col flex-grow justify-between relative z-20">
                            <div>
                                {/* Taille de texte réduite sur mobile (text-2xl vs text-3xl) */}
                                <h4 className="text-2xl md:text-3xl font-serif italic text-rhum-cream mb-4 md:mb-6">L'Atelier Découverte</h4>

                                <div className="flex gap-4 md:gap-6 mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.15em] font-bold text-rhum-gold/80">
                                    <p className="flex items-center gap-2">
                                        <span className="text-base md:text-lg">⏱</span> 1h30
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-base md:text-lg">📜</span> Valable 30 jours
                                    </p>
                                </div>
                                {/* Taille de texte réduite sur mobile (text-base vs text-lg) */}
                                <p className="text-rhum-cream/80 mb-6 md:mb-8 font-sans leading-relaxed italic text-base md:text-lg">
                                    Une initiation parfaite pour découvrir les bases de l'assemblage et repartez avec votre création, sous les conseils du Druide.
                                </p>
                            </div>
                            <button className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-300 shadow-sm rounded-sm text-xs">
                                Réserver dès maintenant
                            </button>
                        </div>
                    </motion.div>

                    {/* --- Carte Atelier Conception --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="group relative bg-[#081c15] rounded-sm overflow-hidden flex flex-col shadow-xl shadow-rhum-gold/5 hover:shadow-rhum-gold/20 transition-all duration-500"
                    >
                        <div className="relative h-48 md:h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-[#081c15]/60 to-transparent z-10"></div>
                            <img
                                src={imgConception}
                                alt="Ambiance Atelier Conception"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute bottom-4 right-6 md:bottom-6 md:right-8 z-20 flex flex-col items-end leading-none">
                                <span className="text-3xl md:text-4xl font-serif text-rhum-gold drop-shadow-lg">120€</span>
                                <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-rhum-gold font-bold mt-1 opacity-90">par atelier</span>
                            </div>
                        </div>

                        {/* Padding réduit sur mobile (p-6 vs p-10) */}
                        <div className="p-6 md:p-10 flex flex-col flex-grow justify-between relative z-20">
                            <div>
                                <h4 className="text-2xl md:text-3xl font-serif italic text-rhum-cream mb-4 md:mb-6">L'Atelier Conception</h4>

                                <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.15em] font-bold">
                                    <p className="flex items-center gap-2 text-rhum-gold/80">
                                        <span className="text-base md:text-lg">⏱</span> 2h30 (par atelier)
                                    </p>
                                    <p className="flex items-center gap-2 text-rhum-gold/80">
                                        <span className="text-base md:text-lg">📜</span> Valable 6 mois
                                    </p>
                                </div>

                                <p className="text-rhum-cream/90 mb-4 md:mb-6 font-sans text-base md:text-lg">
                                    Approfondissez votre savoir-faire à travers nos thématiques :
                                </p>

                                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 font-sans pl-2">
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-3 md:gap-4 text-sm md:text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-lg md:text-xl">1.</span> L'Atelier Fruits
                                        </span>
                                    </li>
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-3 md:gap-4 text-sm md:text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-lg md:text-xl">2.</span> L'Atelier Épices
                                        </span>
                                    </li>
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-3 md:gap-4 text-sm md:text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-lg md:text-xl">3.</span> L'Atelier Plantes
                                        </span>
                                    </li>
                                </ul>

                                <div className="bg-rhum-gold/10 p-3 md:p-4 border-l-2 border-rhum-gold">
                                    <p className="text-[9px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-wider leading-relaxed">
                                        * Important : La validation du niveau 1 est impérative pour accéder au niveau 2.
                                    </p>
                                </div>
                            </div>

                            <button className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-300 mt-6 md:mt-8 shadow-sm rounded-sm text-xs">
                                Réserver dès maintenant
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Section Boutique & Cadeaux optimisée */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-rhum-green text-white p-8 md:p-16 text-center relative overflow-hidden rounded-sm shadow-2xl"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-rhum-gold/5 blur-3xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="font-serif text-2xl md:text-3xl mb-4 md:mb-6 italic text-rhum-gold uppercase tracking-widest">Boutique & Cadeaux</h4>
                        <div className="w-16 md:w-24 h-px bg-rhum-gold/30 mx-auto mb-6 md:mb-8"></div>
                        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90 mb-8 md:mb-10 leading-relaxed font-sans">
                            Vente directe de cartes cadeaux et de nos rhums arrangés artisanaux de Compiègne.
                        </p>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-x-12 text-[10px] md:text-xs uppercase tracking-[0.25em] font-bold text-rhum-gold">
                            <span className="flex items-center gap-2 md:gap-3">✦ Fabrication Artisanale</span>
                            <span className="flex items-center gap-2 md:gap-3">✦ Vente Directe</span>
                            <span className="flex items-center gap-2 md:gap-3">✦ Cartes Cadeaux</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Workshops;