import React from 'react';

const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-24 bg-rhum-cream text-rhum-green px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4">
                        Une Question ?
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif">Contactez-nous</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Formulaire de Contact */}
                    <div className="bg-white p-8 md:p-12 shadow-xl rounded-sm border border-gray-100">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Nom</label>
                                    <input type="text" className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent" placeholder="Votre nom" />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold mb-2">Email</label>
                                    <input type="email" className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent" placeholder="votre@email.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Sujet</label>
                                <select className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent">
                                    <option>Réservation Atelier</option>
                                    <option>Privatisation Entreprise</option>
                                    <option>Demande d'information</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold mb-2">Message</label>
                                <textarea rows={4} className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button className="w-full bg-rhum-green text-white py-4 uppercase tracking-[0.2em] font-bold hover:bg-rhum-gold hover:text-rhum-green transition-all duration-300">
                                Envoyer le message
                            </button>
                        </form>
                    </div>

                    {/* Informations de contact et Carte */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-12">
                            <div>
                                <h4 className="font-serif text-2xl mb-6 italic text-rhum-gold">L'Atelier de la Route du Rhum</h4>
                                <div className="space-y-4 font-sans opacity-80">
                                    <p className="flex items-start gap-4">
                                        <span className="text-rhum-gold">📍</span>
                                        12 rue des Cordeliers, 60200 Compiègne
                                    </p>
                                    <p className="flex items-center gap-4">
                                        <span className="text-rhum-gold">📞</span>
                                        06 41 42 00 28
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-serif text-xl mb-6">Horaires de la Cave</h4>
                                <ul className="space-y-2 text-sm opacity-80">
                                    <li className="flex justify-between border-b border-rhum-gold/10 pb-2">
                                        <span>Mardi au Samedi</span>
                                        <span className="font-bold">10h00 – 19h30</span>
                                    </li>
                                    <li className="flex justify-between opacity-40">
                                        <span>Lundi & Dimanche</span>
                                        <span>Fermé</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Simulation de Carte / Google Maps */}
                        <div className="mt-12 h-64 bg-gray-200 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative border border-gray-100 shadow-inner">
                            <div className="absolute inset-0 flex items-center justify-center bg-rhum-green/5">
                                <div className="text-center p-6">
                                    <p className="font-serif italic text-rhum-green mb-2">Au cœur de Compiègne</p>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=12+rue+des+Cordeliers+60200+Compiegne"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs uppercase tracking-widest text-rhum-gold font-bold hover:underline"
                                    >
                                        Ouvrir dans Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;