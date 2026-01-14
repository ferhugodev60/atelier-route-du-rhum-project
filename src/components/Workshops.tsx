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
            fullDesc: "Dans cette première étape cruciale, vous apprenez à travailler les fruits frais de saison. Sous les conseils de Nabil Ziani, vous découvrirez comment la sucrosité naturelle interagit avec le rhum pour créer une macération harmonieuse.",
            image: "https://images.unsplash.com/photo-1613310023042-ad79320c00fc?q=80&w=1000&auto=format&fit=crop"
        },
        epices: {
            title: "Niveau 2 : L'Atelier Épices",
            price: "170€",
            duration: "3h00",
            desc: "Le caractère et la structure de votre nectar.",
            fullDesc: "Une fois le niveau 1 validé, plongez dans l'univers des épices rares. Apprenez à doser la chaleur, le boisé et le caractère pour donner une structure unique à votre rhum.",
            image: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1000&auto=format&fit=crop"
        },
        plantes: {
            title: "Niveau 3 : L'Atelier Plantes",
            price: "210€",
            duration: "4h00",
            desc: "L'exploration botanique et florale.",
            fullDesc: "Le troisième palier vous ouvre les portes de la botanique. Utilisez des herbes aromatiques et des plantes pour apporter des notes florales ou médicinales complexes.",
            image: "https://images.unsplash.com/photo-1541250848049-b4f71413cc3f?q=80&w=1000&auto=format&fit=crop"
        },
        mixologie: {
            title: "Niveau 4 : L'Atelier Mixologie",
            price: "420€",
            duration: "8h00",
            availability: "Uniquement du Mardi au Jeudi (10h - 20h)",
            desc: "L'art ultime du service et du cocktail.",
            fullDesc: "Une immersion totale de 8 heures (de 10h à 20h, incluant 2h de pause repas). Maîtrisez les techniques de bar professionnelles, les textures et la présentation pour transformer vos rhums en cocktails d'exception. Attention : cet atelier XXL est réservable uniquement du mardi au jeudi.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop"
        }
    };

    return (
        <section id="workshops" className="py-24 bg-white px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-sm mb-4 font-bold">Nos Formules</h2>
                    <h3 className="text-4xl md:text-5xl font-serif text-rhum-green italic">La Carte de l'Atelier</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

                    {/* --- ATELIER DÉCOUVERTE --- */}
                    <div className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/20 shadow-2xl">
                        <div className="relative h-64 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                            <img src={imgDiscovery} alt="Atelier Découverte" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="p-10 flex flex-col flex-grow">
                            {/* Prix aligné face au titre */}
                            <div className="flex justify-between items-baseline mb-6">
                                <h4 className="text-3xl font-serif italic text-rhum-cream">L'Atelier Découverte</h4>
                                <span className="text-4xl font-serif text-rhum-gold">60€</span>
                            </div>
                            <div className="flex gap-6 mb-8 text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                                <span>⏱ 1h30</span>
                                <span>📜 Valable 30 jours après achat</span>
                            </div>
                            <p className="text-rhum-cream/70 italic text-lg mb-10 leading-relaxed">
                                Une initiation parfaite pour découvrir les bases de l'assemblage sous les conseils du Druide de Compiègne.
                            </p>
                            <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg">
                                Réserver l'atelier
                            </button>
                        </div>
                    </div>

                    {/* --- ATELIER CONCEPTION --- */}
                    <div className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl">
                        <div className="p-10 md:p-12 flex flex-col h-full">
                            <div className="flex justify-between items-baseline mb-8">
                                <h4 className="text-3xl font-serif italic text-rhum-cream">L'Atelier Conception</h4>
                                <span className="text-rhum-gold font-sans text-[10px] uppercase tracking-widest font-bold opacity-60">Par Étapes</span>
                            </div>

                            <div className="flex gap-6 mb-10 text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                                <span>📜 Valable 6 mois après achat</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-grow">
                                {Object.keys(workshopDetails).map((key, index) => {
                                    // On récupère l'objet correspondant à la clé
                                    const item = workshopDetails[key as keyof typeof workshopDetails];

                                    return (
                                        <li key={key} className="flex justify-between items-center border-b border-white/5 pb-4 group">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-rhum-gold font-black text-lg opacity-50">{index + 1}.</span>
                                                    {/* On extrait le nom après le ":" */}
                                                    <span className="text-rhum-cream text-lg italic">{item.title.split(': ')[1]}</span>
                                                </div>
                                                <div className="text-[10px] text-rhum-gold/60 uppercase tracking-widest ml-10">
                                                    {item.duration} — {item.price}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveDetail(item)}
                                                className="text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-4 py-2 hover:bg-rhum-gold/10 transition-all"
                                            >
                                                Détails
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="bg-rhum-gold/10 p-6 border border-rhum-gold/30 rounded-sm">
                                <p className="text-[10px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                                    ✦ Progression obligatoire : le niveau précédent doit être validé pour accéder au suivant ✦
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- GRANDE MODAL --- */}
                <AnimatePresence>
                    {activeDetail && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 backdrop-blur-md">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveDetail(null)} className="absolute inset-0 bg-black/95" />
                            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="relative bg-[#0a1a14] border border-rhum-gold/30 max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl flex flex-col md:flex-row">
                                <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden border-b md:border-b-0 md:border-r border-rhum-gold/20">
                                    <img src={activeDetail.image} alt={activeDetail.title} className="w-full h-full object-cover opacity-70" />
                                </div>
                                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col">
                                    <button onClick={() => setActiveDetail(null)} className="absolute top-6 right-8 text-rhum-gold text-3xl">×</button>
                                    <h5 className="text-3xl md:text-5xl font-serif italic text-white mb-6 leading-tight">{activeDetail.title}</h5>

                                    <div className="flex flex-col gap-2 mb-8">
                                        <div className="flex gap-8 text-rhum-gold font-serif text-2xl">
                                            <span>Tarif : {activeDetail.price}</span>
                                            <span>Durée : {activeDetail.duration}</span>
                                        </div>
                                        {/* Affichage de la disponibilité spécifique si elle existe */}
                                        {activeDetail.availability && (
                                            <p className="text-rhum-gold/80 text-[11px] uppercase tracking-widest font-bold">
                                                📅 {activeDetail.availability}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-16 h-px bg-rhum-gold/30 mb-8" />
                                    <p className="text-rhum-cream/90 text-lg leading-relaxed mb-10 italic font-sans">"{activeDetail.fullDesc}"</p>
                                    <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl">
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