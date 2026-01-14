import React from 'react';
// Chemin vérifié via votre explorateur de fichiers
import menuImg from '../assets/images/Menu.jpg';

const WorkshopMenu: React.FC = () => {
    return (
        <section id="menu" className="py-24 bg-white text-rhum-green px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-rhum-green">La Carte de l'Atelier</h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Colonne Image */}
                    <div className="w-full lg:w-1/2 lg:sticky lg:top-32">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-rhum-gold/20 rounded-sm blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                            <div className="relative bg-white p-4 shadow-2xl border border-gray-100">
                                <img
                                    src={menuImg}
                                    alt="Menu officiel de l'Atelier de la Route du Rhum"
                                    className="w-full h-auto object-cover transition-all duration-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colonne Contenu Textuel */}
                    <div className="w-full lg:w-1/2 space-y-12">
                        {/* Section Ateliers */}
                        <div>
                            <h4 className="text-2xl font-serif border-b border-rhum-gold/30 pb-2 mb-8 uppercase tracking-wider">
                                Ateliers de Création
                            </h4>
                            <ul className="space-y-8">
                                <li className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h5 className="font-bold text-lg uppercase tracking-wide">L'Atelier Découverte</h5>
                                        <p className="text-sm text-gray-600 font-sans mt-1">
                                            Une initiation parfaite. Valable 30 jours.
                                        </p>
                                        <span className="text-xs text-rhum-gold font-bold uppercase tracking-tighter">Durée : 1h30</span>
                                    </div>
                                    <span className="font-serif text-xl italic whitespace-nowrap">60€</span>
                                </li>

                                <li className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h5 className="font-bold text-lg uppercase tracking-wide">L'Atelier Conception</h5>
                                        <p className="text-sm text-gray-600 font-sans mt-1">
                                            Approfondissez votre savoir-faire. Valable 6 mois.
                                        </p>
                                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                                            <p>• Niveau 1 : L'Atelier Fruits</p>
                                            <p>• Niveau 2 : L'Atelier Épices</p>
                                            <p>• Niveau 3 : L'Atelier Plantes</p>
                                        </div>
                                        <span className="text-xs text-rhum-gold font-bold uppercase tracking-tighter">Durée : 2h30</span>
                                    </div>
                                    <span className="font-serif text-xl italic whitespace-nowrap">140€</span>
                                </li>
                            </ul>
                        </div>

                        {/* Section Vente Directe */}
                        <div className="bg-rhum-cream/30 p-8 border border-rhum-gold/10">
                            <h4 className="text-2xl font-serif mb-6 uppercase tracking-wider">
                                Boutique & Cadeaux
                            </h4>
                            <ul className="space-y-4 text-sm font-sans">
                                <li className="flex items-center gap-3 italic">
                                    <span className="text-rhum-gold">✦</span>
                                    Vente directe de bouteilles de rhum arrangé fabriquées dans l'atelier.
                                </li>
                                <li className="flex items-center gap-3 italic">
                                    <span className="text-rhum-gold">✦</span>
                                    Cartes cadeaux disponibles pour les bouteilles et les ateliers.
                                </li>
                                <li className="flex items-center gap-3 italic">
                                    <span className="text-rhum-gold">✦</span>
                                    Fabrication Artisanale garantie.
                                </li>
                            </ul>
                        </div>

                        <div className="pt-4">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-sans leading-relaxed">
                                * Tarifs en vigueur affichés à l'atelier. <br />
                                Fabrication artisanale française.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkshopMenu;