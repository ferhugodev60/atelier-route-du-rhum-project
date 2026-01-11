import React from 'react';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-rhum-green text-rhum-cream pt-16 pb-8 px-6 relative">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">

                {/* Colonne 1 : À Propos */}
                <div>
                    <h3 className="font-serif text-2xl mb-6 text-rhum-gold uppercase tracking-wider">
                        L'Atelier de la Route du Rhum
                    </h3>
                    <p className="text-sm leading-relaxed opacity-80 font-sans mb-6 italic">
                        Votre cave spécialisée et espace de création de rhum arrangé au cœur du centre historique de Compiègne.
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://www.instagram.com/atelier.du.rhum/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-rhum-gold transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Colonne 2 : Nous Trouver */}
                <div>
                    <h4 className="font-serif text-xl mb-6 uppercase">Nous Trouver</h4>
                    <address className="not-italic text-sm opacity-80 space-y-3 font-sans">
                        <p>12 rue des Cordeliers</p>
                        <p>60200 Compiègne</p>
                        <p className="pt-2 font-bold text-rhum-gold/80 italic">Fabrication Artisanale</p>
                    </address>
                </div>

                {/* Colonne 3 : Horaires */}
                <div>
                    <h4 className="font-serif text-xl mb-6 uppercase">Horaires</h4>
                    <ul className="text-sm opacity-80 space-y-4 font-sans">
                        <li className="flex justify-between">
                            <span>Mardi - Samedi :</span>
                            <span className="font-bold text-white">10h00 – 19h30</span>
                        </li>
                        <li className="flex justify-between text-rhum-gold/50 italic">
                            <span>Dimanche - Lundi :</span>
                            <span>Fermé</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* BOUTON RETOUR EN HAUT - REPOSITIONNÉ PROPREMENT */}
            <div className="relative flex justify-center h-0">
                <button
                    onClick={scrollToTop}
                    className="absolute -top-8 flex flex-col items-center gap-1 group transition-all duration-300"
                >
        <span className="text-[9px] uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 group-hover:text-rhum-gold transition-all mb-1">
            Haut
        </span>

                    {/* MODIFICATION :
           1. On garde 'bg-rhum-green' en permanence pour bloquer la ligne.
           2. On retire 'group-hover:bg-rhum-gold/5' qui créait la transparence.
           3. On ne change que la bordure et l'icône pour l'effet visuel.
        */}
                    <div className="w-10 h-10 bg-rhum-green border border-white/10 rounded-sm flex items-center justify-center group-hover:border-rhum-gold/50 transition-all z-10 shadow-xl shadow-black/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-rhum-gold transition-transform group-hover:-translate-y-0.5"
                        >
                            <path d="m18 15-6-6-6 6"/>
                        </svg>
                    </div>
                </button>
            </div>

            {/* Bas du Footer */}
            <div className="max-w-6xl mx-auto pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-40">
                <p>© 2026 Z.T. RHUM - Tous droits réservés</p>
                <div className="flex gap-6 mt-4 md:mt-0 font-sans">
                    <a href="#" className="hover:text-rhum-gold transition-colors">Mentions Légales</a>
                    <a href="#" className="hover:text-rhum-gold transition-colors">CGV</a>
                    <a href="#" className="hover:underline">Données</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;