import React from 'react';
import { motion } from 'framer-motion';

// Images d'illustration
const imgDiscovery = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSysDAq-Q1wZA2OCfAXQEfH2_NoxWxvEJNk1kC3Xs0vf4bXzyHzCWC0mp1_f_6id7V93XTGpG9WNeo2uA9JvegdR9SFR1iVlQ1wFUM0-lqUhzG0JQiyU0Vs9PKE9NvV_n5A2uc6MLX4CiSE=s1360-w1360-h1020-rw";
const imgConception = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxxesaujZl4ZPCbrFQ6D9xN13gsc3OkfKD7G2B65yb1q3EGK4GC7b0Hutcl6uuho7h83cBVFUkTSWYg5xc6A0bNBvxpHS_DY_WMLD60FEGeuJs49MKmz2yM3lsFpFDwrpml9qpPxD2SwqU=s1360-w1360-h1020-rw";

const Workshops: React.FC = () => {
    return (
        <section id="workshops" className="py-24 bg-white px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête de section */}
                <div className="text-center mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-rhum-green">La Carte de l'Atelier</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    {/* --- Carte Atelier Découverte --- */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="group relative bg-[#081c15] border border-rhum-gold/30 rounded-sm overflow-hidden flex flex-col shadow-xl shadow-rhum-gold/5 hover:shadow-rhum-gold/20 transition-all duration-500"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-[#081c15]/60 to-transparent z-10"></div>
                            <img
                                src={imgDiscovery}
                                alt="Ambiance Atelier Découverte"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute bottom-6 right-8 z-20">
                                <span className="text-4xl font-serif text-rhum-gold drop-shadow-lg">60€</span>
                            </div>
                        </div>

                        <div className="p-10 flex flex-col flex-grow justify-between relative z-20">
                            <div>
                                <h4 className="text-3xl font-serif italic text-rhum-cream mb-6">L'Atelier Découverte</h4>
                                <div className="flex gap-6 mb-8 text-xs uppercase tracking-[0.15em] font-bold text-rhum-gold/80">
                                    <p className="flex items-center gap-2">
                                        <span className="text-lg">⏱</span> 1h30
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="text-lg">📜</span> Valable 30 jours
                                    </p>
                                </div>
                                <p className="text-rhum-cream/80 mb-8 font-sans leading-relaxed italic text-lg">
                                    Une initiation parfaite pour découvrir les bases de l'assemblage et repartez avec votre création, sous les conseils du Druide.
                                </p>
                            </div>
                            <button className="w-full bg-rhum-gold text-rhum-green py-5 uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-300 mt-auto shadow-sm rounded-sm">
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
                        className="group relative bg-[#081c15] border border-rhum-gold/30 rounded-sm overflow-hidden flex flex-col shadow-xl shadow-rhum-gold/5 hover:shadow-rhum-gold/20 transition-all duration-500"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-[#081c15]/60 to-transparent z-10"></div>
                            <img
                                src={imgConception}
                                alt="Ambiance Atelier Conception"
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            {/* SEULE MENTION DU PRIX : Claire et imposante */}
                            <div className="absolute bottom-6 right-8 z-20 flex flex-col items-end leading-none">
                                <span className="text-4xl font-serif text-rhum-gold drop-shadow-lg">120€</span>
                                <span className="text-[10px] uppercase tracking-widest text-rhum-gold font-bold mt-1 opacity-90">par atelier</span>
                            </div>
                        </div>

                        <div className="p-10 flex flex-col flex-grow justify-between relative z-20">
                            <div>
                                <h4 className="text-3xl font-serif italic text-rhum-cream mb-6">L'Atelier Conception</h4>

                                <div className="flex flex-wrap gap-6 mb-8 text-xs uppercase tracking-[0.15em] font-bold">
                                    <p className="flex items-center gap-2 text-rhum-gold/80">
                                        <span className="text-lg">⏱</span> 2h30 (par atelier)
                                    </p>
                                    <p className="flex items-center gap-2 text-rhum-gold/80">
                                        <span className="text-lg">📜</span> Valable 6 mois
                                    </p>
                                </div>

                                <p className="text-rhum-cream/90 mb-6 font-sans text-lg">
                                    Approfondissez votre savoir-faire à travers nos trois niveaux thématiques :
                                </p>

                                <ul className="space-y-4 mb-8 font-sans pl-2">
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-4 text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-xl">1.</span> L'Atelier Fruits
                                        </span>
                                    </li>
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-4 text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-xl">2.</span> L'Atelier Épices
                                        </span>
                                    </li>
                                    <li className="flex items-center border-b border-white/5 pb-2">
                                        <span className="flex items-center gap-4 text-base italic text-rhum-cream/80">
                                            <span className="text-rhum-gold font-black text-xl">3.</span> L'Atelier Plantes
                                        </span>
                                    </li>
                                </ul>

                                <div className="bg-rhum-gold/10 p-4 border-l-2 border-rhum-gold">
                                    <p className="text-[10px] text-rhum-gold font-bold uppercase tracking-wider leading-relaxed">
                                        * Important : La validation du niveau 1 est impérative pour accéder au niveau 2, et ainsi de suite.
                                    </p>
                                </div>
                            </div>

                            <button className="w-full bg-rhum-gold text-rhum-green py-5 uppercase tracking-[0.2em] font-black hover:bg-white transition-colors duration-300 mt-8 shadow-sm rounded-sm">
                                Réserver dès maintenant
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Section Boutique & Cadeaux */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-rhum-green text-white p-12 md:p-16 text-center relative overflow-hidden rounded-sm shadow-2xl"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-rhum-gold/5 blur-3xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <h4 className="font-serif text-3xl mb-6 italic text-rhum-gold uppercase tracking-widest">Boutique & Cadeaux</h4>
                        <div className="w-24 h-px bg-rhum-gold/30 mx-auto mb-8"></div>
                        <p className="max-w-3xl mx-auto text-base opacity-90 mb-10 leading-relaxed font-sans">
                            Vente en directe des cartes cadeaux pour les ateliers ou les bouteilles.
                            Découvrez également notre sélection de rhums arrangés fabriqués artisanalement dans notre atelier de Compiègne.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs uppercase tracking-[0.25em] font-bold text-rhum-gold">
                            <span className="flex items-center gap-3"><span className="text-xl">✦</span> Fabrication Artisanale</span>
                            <span className="flex items-center gap-3"><span className="text-xl">✦</span> Vente Directe</span>
                            <span className="flex items-center gap-3"><span className="text-xl">✦</span> Cartes Cadeaux</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Workshops;