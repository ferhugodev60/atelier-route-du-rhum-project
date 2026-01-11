import React from 'react';

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-rhum-green text-rhum-cream pt-12 md:pt-16 pb-8 px-4 md:px-6 relative">
            {/* Grille principale : centré sur mobile (text-center) et à gauche sur desktop */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-b border-white/10 pb-10 md:pb-12 text-center md:text-left">

                {/* Colonne 1 : À Propos */}
                <div>
                    <h3 className="font-serif text-xl md:text-2xl mb-4 md:mb-6 text-rhum-gold uppercase tracking-wider">
                        L'Atelier de la Route du Rhum
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed opacity-80 font-sans mb-6 italic">
                        Votre cave spécialisée et espace de création de rhum arrangé au cœur du centre historique de Compiègne.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <a
                            href="https://www.instagram.com/atelier.du.rhum/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-rhum-gold transition-colors duration-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Colonne 2 : Nous Trouver */}
                <div>
                    <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6 uppercase">Nous Trouver</h4>
                    <address className="not-italic text-xs md:text-sm opacity-80 space-y-2 md:space-y-3 font-sans">
                        <p>12 rue des Cordeliers</p>
                        <p>60200 Compiègne</p>
                        <p className="pt-1 md:pt-2 font-bold text-rhum-gold/80 italic">Fabrication Artisanale</p>
                    </address>
                </div>

                {/* Colonne 3 : Horaires */}
                <div>
                    <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6 uppercase">Horaires</h4>
                    <ul className="text-xs md:text-sm opacity-80 space-y-3 md:space-y-4 font-sans">
                        <li className="flex justify-between max-w-[250px] mx-auto md:mx-0">
                            <span>Mardi - Samedi :</span>
                            <span className="font-bold text-white">10h00 – 19h30</span>
                        </li>
                        <li className="flex justify-between max-w-[250px] mx-auto md:mx-0 text-rhum-gold/50 italic">
                            <span>Dimanche - Lundi :</span>
                            <span>Fermé</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* BOUTON RETOUR EN HAUT */}
            <div className="relative flex justify-center h-0">
                <button
                    onClick={scrollToTop}
                    className="absolute -top-7 md:-top-8 flex flex-col items-center gap-1 group transition-all duration-300"
                >
                    <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 group-hover:text-rhum-gold transition-all mb-1">
                        Haut
                    </span>
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-rhum-green border border-white/10 rounded-sm flex items-center justify-center group-hover:border-rhum-gold/50 transition-all z-10 shadow-xl shadow-black/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
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

            {/* Bas du Footer : Copyright et Liens Légaux */}
            <div className="max-w-6xl mx-auto pt-10 md:pt-12 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest opacity-40">
                <p className="mb-4 md:mb-0">© 2026 Z.T. RHUM - Tous droits réservés</p>
                <div className="flex gap-4 md:gap-6 font-sans">
                    <a href="#" className="hover:text-rhum-gold transition-colors">Mentions Légales</a>
                    <a href="#" className="hover:text-rhum-gold transition-colors">CGV</a>
                    <a href="#" className="hover:underline">Données</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;