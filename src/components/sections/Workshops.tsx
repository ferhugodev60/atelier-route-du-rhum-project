import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const imgDiscovery = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSysDAq-Q1wZA2OCfAXQEfH2_NoxWxvEJNk1kC3Xs0vf4bXzyHzCWC0mp1_f_6id7V93XTGpG9WNeo2uA9JvegdR9SFR1iVlQ1wFUM0-lqUhzG0JQiyU0Vs9PKE9NvV_n5A2uc6MLX4CiSE=s1360-w1360-h1020-rw";

const Workshops: React.FC = () => {
    const [activeDetail, setActiveDetail] = useState<{
        title: string;
        desc: string;
        fullDesc: string;
        image: string;
        price: string;
        duration: string;
        availability?: string;
    } | null>(null);

    const workshopDetails = {
        fruits: {
            title: "Niveau 1 : L'Atelier Fruits",
            price: "140€",
            duration: "2h30",
            desc: "L'équilibre parfait entre sucre et puissance.",
            fullDesc: "Apprenez à travailler les fruits frais de saison pour créer une macération harmonieuse sous les conseils de Nabil Ziani.",
            image: "https://images.unsplash.com/photo-1613310023042-ad79320c00fc?q=80&w=1000&auto=format&fit=crop"
        },
        epices: {
            title: "Niveau 2 : L'Atelier Épices",
            price: "170€",
            duration: "3h00",
            desc: "Le caractère et la structure de votre nectar.",
            fullDesc: "Plongez dans l'univers des épices rares pour donner une structure unique et boisée à votre rhum.",
            image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1000&auto=format&fit=crop"
        },
        plantes: {
            title: "Niveau 3 : L'Atelier Plantes",
            price: "210€",
            duration: "4h00",
            desc: "L'exploration botanique et florale.",
            fullDesc: "Utilisez des herbes aromatiques et des plantes pour apporter des notes florales complexes à votre signature d'alchimiste.",
            image: "https://images.unsplash.com/photo-1541250848049-b4f71413cc3f?q=80&w=1000&auto=format&fit=crop"
        },
        mixologie: {
            title: "Niveau 4 : L'Atelier XXL Mixologie",
            price: "420€",
            duration: "8h00",
            availability: "Mardi au Jeudi (10h - 20h)",
            desc: "L'art ultime du service et du cocktail.",
            fullDesc: "Une immersion de 8 heures incluant 2h de pause repas pour maîtriser les techniques de bar professionnelles.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
        }
    };

    return (
        <section id="workshops" className="py-16 md:py-24 bg-white px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête principal */}
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4">Nos Formules & Boutique</h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-rhum-green">La Carte de l'Atelier</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-stretch">
                    {/* --- ATELIER DÉCOUVERTE --- */}
                    <div className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/20 shadow-2xl">
                        <div className="relative h-48 md:h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                            <img src={imgDiscovery} alt="Atelier Découverte" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="p-6 md:p-10 flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-4 md:mb-6 gap-2">
                                <h4 className="text-xl md:text-3xl font-serif italic text-rhum-cream leading-tight">L'Atelier Découverte</h4>
                                <span className="text-2xl md:text-4xl font-serif text-rhum-gold whitespace-nowrap">60€</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 md:mb-8 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                                <span>⏱ 1h30</span>
                                <span>📜 Valable 30 jours après achat</span>
                            </div>
                            <p className="text-rhum-cream/70 italic text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
                                Une initiation parfaite pour découvrir les bases de l'assemblage sous les conseils du Druide.
                            </p>
                            <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-lg rounded-sm">
                                Réserver l'atelier
                            </button>
                        </div>
                    </div>

                    {/* --- ATELIER CONCEPTION --- */}
                    <div className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl">
                        <div className="p-6 md:p-12 flex flex-col h-full">
                            <div className="flex justify-between items-baseline mb-6 md:mb-8">
                                <h4 className="text-xl md:text-3xl font-serif italic text-rhum-cream">L'Atelier Conception</h4>
                                <span className="text-rhum-gold font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">Par Étapes</span>
                            </div>
                            <div className="flex gap-4 mb-8 md:mb-10 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                                <span>📜 Valable 6 mois après achat</span>
                            </div>
                            <ul className="space-y-4 mb-8 md:mb-10 flex-grow">
                                {Object.keys(workshopDetails).map((key, index) => {
                                    const item = workshopDetails[key as keyof typeof workshopDetails];
                                    return (
                                        <li key={key} className="flex justify-between items-center border-b border-white/5 pb-3 md:pb-4 group gap-2">
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                                    <span className="text-rhum-gold font-black text-base md:text-lg opacity-50 flex-shrink-0">{index + 1}.</span>
                                                    <span className="text-rhum-cream text-base md:text-lg italic truncate">{item.title.split(': ')[1]}</span>
                                                </div>
                                                <div className="text-[9px] md:text-[10px] text-rhum-gold/60 uppercase tracking-widest ml-6 md:ml-10">
                                                    {item.duration} — {item.price}
                                                </div>
                                            </div>
                                            <button onClick={() => setActiveDetail(item)} className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-3 md:px-4 py-1.5 md:py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all flex-shrink-0">
                                                Détails
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="bg-rhum-gold/10 p-4 md:p-6 border border-rhum-gold/30 rounded-sm">
                                <p className="text-[8px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] leading-relaxed text-center">
                                    Progression obligatoire : le niveau précédent doit être validé
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECTION BOUTIQUE & CADEAUX --- */}
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
                        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90 mb-8 md:mb-10 leading-relaxed font-sans px-2">
                            Découvrez nos bouteilles de rhum arrangé de fabrication artisanale et nos cartes cadeaux directement à l'atelier de Compiègne.
                            Idéal pour offrir ou prolonger l'expérience sensorielle du Druide chez vous.
                        </p>

                        {/* Nouveau bouton de consultation de la boutique */}
                        <div className="flex flex-col items-center gap-8">
                            <button className="px-10 md:px-14 py-4 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                                Consulter la boutique
                            </button>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-x-12 text-[9px] md:text-[10px] uppercase tracking-[0.25em] font-bold text-rhum-gold">
                                <span className="flex items-center gap-2">✦ Fabrication artisanale française</span>
                                <span className="flex items-center gap-2">✦ Vente directe en boutique</span>
                                <span className="flex items-center gap-2">✦ Cartes Cadeaux Disponibles</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- MODAL MOBILE-READY --- */}
                <AnimatePresence>
                    {activeDetail && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-12 backdrop-blur-md">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveDetail(null)} className="absolute inset-0 bg-black/95" />
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-[#0a1a14] border border-rhum-gold/30 max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row">
                                <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-rhum-gold/20">
                                    <img src={activeDetail.image} alt={activeDetail.title} className="w-full h-full object-cover opacity-70" />
                                </div>
                                <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col">
                                    <button onClick={() => setActiveDetail(null)} className="absolute top-4 right-6 text-rhum-gold text-2xl md:text-3xl hover:scale-110">×</button>
                                    <h5 className="text-xl md:text-5xl font-serif italic text-white mb-4 md:mb-6 leading-tight">{activeDetail.title}</h5>
                                    <div className="flex flex-wrap gap-4 md:gap-8 text-rhum-gold font-serif text-lg md:text-2xl mb-6 md:mb-8">
                                        <span>Tarif : {activeDetail.price}</span>
                                        <span>Durée : {activeDetail.duration}</span>
                                    </div>
                                    {activeDetail.availability && (
                                        <p className="text-rhum-gold/80 text-[10px] font-bold mb-6 italic">📅 {activeDetail.availability}</p>
                                    )}
                                    <div className="w-12 h-px bg-rhum-gold/30 mb-6" />
                                    <p className="text-rhum-cream/90 text-sm md:text-lg italic font-sans mb-8">"{activeDetail.fullDesc}"</p>
                                    <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl">
                                        Réserver cette étape
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Workshops;