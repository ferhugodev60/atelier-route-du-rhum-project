import React from 'react';

const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-16 md:py-24 bg-rhum-cream text-rhum-green px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête avec texte réduit sur mobile */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-sm mb-3 md:mb-4">
                        Une Question ?
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-serif">Contactez-nous</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                    {/* Formulaire de Contact */}
                    <div className="bg-white p-6 md:p-12 shadow-xl rounded-sm border border-gray-100">
                        <form className="space-y-5 md:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                <div>
                                    <label className="block text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 md:mb-2">Nom</label>
                                    <input type="text" className="w-full border-b border-gray-300 py-1.5 md:py-2 text-sm md:text-base focus:border-rhum-gold outline-none transition-colors bg-transparent" placeholder="Votre nom" />
                                </div>
                                <div>
                                    <label className="block text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 md:mb-2">Email</label>
                                    <input type="email" className="w-full border-b border-gray-300 py-1.5 md:py-2 text-sm md:text-base focus:border-rhum-gold outline-none transition-colors bg-transparent" placeholder="votre@email.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 md:mb-2">Sujet</label>
                                <select className="w-full border-b border-gray-300 py-1.5 md:py-2 text-sm md:text-base focus:border-rhum-gold outline-none transition-colors bg-transparent">
                                    <option>Réservation Atelier</option>
                                    <option>Privatisation Entreprise</option>
                                    <option>Demande d'information</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 md:mb-2">Message</label>
                                <textarea rows={3} className="w-full border-b border-gray-300 py-1.5 md:py-2 text-sm md:text-base focus:border-rhum-gold outline-none transition-colors bg-transparent resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                            </div>
                            <button className="w-full bg-rhum-green text-white py-3.5 md:py-4 uppercase tracking-[0.2em] font-bold text-xs md:text-sm hover:bg-rhum-gold hover:text-rhum-green transition-all duration-300 shadow-md">
                                Envoyer le message
                            </button>
                        </form>
                    </div>

                    {/* Informations de contact */}
                    <div className="flex flex-col justify-between">
                        <div className="space-y-8 md:space-y-12">
                            <div>
                                <h4 className="font-serif text-xl md:text-2xl mb-4 md:mb-6 italic text-rhum-gold">L'Atelier de la Route du Rhum</h4>
                                <div className="space-y-3 md:space-y-4 font-sans opacity-80 text-sm">
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
                                <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6">Horaires de la Cave</h4>
                                <ul className="space-y-2 text-xs md:text-sm opacity-80">
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

                        {/* Carte avec Marqueur (Flèche) */}
                        <div className="mt-10 md:mt-12 h-48 md:h-64 bg-gray-200 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative border border-gray-100 shadow-inner">
                            <iframe
                                // URL d'intégration exacte pour l'Atelier de la Route du Rhum
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2596.5056637482813!2d2.82351537682285!3d49.41629486111162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e7d73eb355563f%3A0xbe537f8688f1e389!2sAtelier%20de%20la%20Route%20du%20Rhum!5e0!3m2!1sfr!2sfr!4v1736618581024!5m2!1sfr!2sfr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localisation de l'Atelier de la Route du Rhum à Compiègne"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;