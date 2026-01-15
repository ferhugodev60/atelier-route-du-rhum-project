import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WORKSHOP_DETAILS, IMG_DISCOVERY, type WorkshopDetail } from '../../data/workshops';

export default function Workshops() {
    const [activeDetail, setActiveDetail] = useState<WorkshopDetail | null>(null);

    return (
        <section id="workshops" className="py-16 md:py-24 bg-white px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4 font-bold">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-rhum-green">
                        La Carte de l'Atelier
                    </h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-stretch">

                    {/* --- CARTE : ATELIER DÉCOUVERTE --- */}
                    <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/20 shadow-2xl">
                        <div className="relative h-48 md:h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                            <img
                                src={IMG_DISCOVERY}
                                alt="Session d'initiation"
                                className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="p-6 md:p-10 flex flex-col flex-grow">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h4 className="text-xl md:text-3xl font-serif italic text-rhum-cream leading-tight">L'Atelier Découverte</h4>
                                <span className="text-2xl md:text-4xl font-serif text-rhum-gold">60€</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                                <span>⏱ 1h30</span>
                                <span>📜 Valable 30 jours après achat</span>
                            </div>
                            <p className="text-rhum-cream/70 italic text-base md:text-lg mb-8 leading-relaxed">
                                Une initiation parfaite pour découvrir les bases de l'assemblage sous les conseils du Druide.
                            </p>
                            <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-lg rounded-sm">
                                Réserver l'atelier
                            </button>
                        </div>
                    </article>

                    {/* --- CARTE : ATELIER CONCEPTION --- */}
                    <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-12">
                        <header className="flex justify-between items-baseline mb-8">
                            <h4 className="text-xl md:text-3xl font-serif italic text-rhum-cream">L'Atelier Conception</h4>
                            <span className="text-rhum-gold font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">Par Étapes</span>
                        </header>

                        <ul className="space-y-4 flex-grow mb-10">
                            {Object.entries(WORKSHOP_DETAILS).map(([key, item], index) => (
                                <li key={key} className="flex justify-between items-center border-b border-white/5 pb-4 group gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-center gap-2 md:gap-4">
                                            <span className="text-rhum-gold font-black text-base md:text-lg opacity-50 flex-shrink-0">{index + 1}.</span>
                                            <span className="text-rhum-cream text-base md:text-lg italic truncate">{item.title.split(': ')[1]}</span>
                                        </div>
                                        <div className="text-[9px] text-rhum-gold/60 uppercase tracking-widest ml-6 md:ml-10">
                                            {item.duration} — {item.price}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveDetail(item)}
                                        className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-3 md:px-4 py-1.5 md:py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all"
                                    >
                                        Détails
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* BLOC DE PROGRESSION OBLIGATOIRE RÉINTÉGRÉ */}
                        <div className="bg-rhum-gold/10 p-4 md:p-6 border border-rhum-gold/30 rounded-sm">
                            <p className="text-[8px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                                Progression obligatoire : le niveau précédent doit être validé
                            </p>
                        </div>
                    </article>
                </div>

                {/* --- SECTION BOUTIQUE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-rhum-green text-white p-8 md:p-16 text-center relative overflow-hidden rounded-sm shadow-2xl"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-rhum-gold/5 blur-3xl pointer-events-none" />
                    <div className="relative z-10">
                        <h4 className="font-serif text-2xl md:text-3xl mb-6 italic text-rhum-gold uppercase tracking-widest">Boutique & Cadeaux</h4>
                        <div className="w-16 md:w-24 h-px bg-rhum-gold/30 mx-auto mb-8" />
                        <p className="max-w-3xl mx-auto text-sm md:text-base opacity-90 mb-10 leading-relaxed">
                            Découvrez nos bouteilles artisanales et nos cartes cadeaux.
                        </p>
                        <button className="px-10 md:px-14 py-4 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm">
                            Consulter la boutique
                        </button>
                    </div>
                </motion.div>

                {/* --- MODAL --- */}
                <AnimatePresence>
                    {activeDetail && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-12 backdrop-blur-md" role="dialog" aria-modal="true">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveDetail(null)} className="absolute inset-0 bg-black/95" />
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-[#0a1a14] border border-rhum-gold/30 max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row">
                                <button onClick={() => setActiveDetail(null)} className="absolute top-4 right-6 text-rhum-gold text-3xl hover:scale-110">×</button>
                                <div className="w-full md:w-1/2 h-48 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-rhum-gold/20">
                                    <img src={activeDetail.image} alt="" className="w-full h-full object-cover opacity-70" />
                                </div>
                                <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col">
                                    <h5 className="text-xl md:text-5xl font-serif italic text-white mb-6">{activeDetail.title}</h5>
                                    <p className="text-rhum-gold text-xl md:text-2xl mb-8">Tarif : {activeDetail.price} — {activeDetail.duration}</p>
                                    <p className="text-rhum-cream/90 italic text-lg mb-10">"{activeDetail.fullDesc}"</p>
                                    <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 font-black uppercase tracking-widest text-xs hover:bg-white transition-all">
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
}