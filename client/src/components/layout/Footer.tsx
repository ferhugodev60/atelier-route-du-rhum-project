export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="bg-rhum-green text-rhum-cream pt-12 md:pt-16 pb-8 px-4 md:px-6 relative border-t border-white/10">
            <div className="max-w-6xl mx-auto">

                {/* --- GRILLE PRINCIPALE --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 border-b border-white/10 pb-10 md:pb-12 text-center md:text-left">

                    {/* Colonne 1 : À Propos & Réseaux */}
                    <div className="space-y-6">
                        {/* 🏺 Sémantique scellée : Établissement au lieu d'Atelier */}
                        <h3 className="font-serif text-xl md:text-2xl text-rhum-gold uppercase tracking-wider">
                            L'Établissement de la Route du Rhum
                        </h3>
                        <p className="text-xs md:text-sm leading-relaxed text-rhum-cream font-sans max-w-sm mx-auto md:mx-0">
                            Votre espace spécialisé et lieu de création de rhum arrangé au cœur du centre de Compiègne.
                        </p>

                        {/* RÉSEAUX SOCIAUX : Contraste plein */}
                        <div className="flex justify-center md:justify-start gap-6">
                            <a
                                href="https://www.instagram.com/atelier.du.rhum/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-rhum-gold transition-colors duration-300"
                                aria-label="Suivez-nous sur Instagram"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                            </a>

                            <a
                                href="https://www.tiktok.com/@latelier.de.la.ro"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white hover:text-rhum-gold transition-colors duration-300"
                                aria-label="Suivez-nous sur TikTok"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V2h5a4 4 0 0 0-4 4"/></svg>
                            </a>
                        </div>
                    </div>

                    {/* Colonne 2 : Nous Trouver */}
                    <div>
                        <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6 uppercase text-rhum-gold">Nous Trouver</h4>
                        <address className="not-italic text-xs md:text-sm text-rhum-cream space-y-2 font-sans">
                            <p>12 rue des Cordeliers</p>
                            <p>60200 Compiègne</p>
                            <p className="pt-2 font-black text-rhum-gold tracking-[0.2em] uppercase text-[10px]">
                                Nous ne sommes pas un débit de boissons.
                            </p>
                        </address>
                    </div>

                    {/* Colonne 3 : Horaires */}
                    <div>
                        <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6 uppercase text-rhum-gold">Horaires</h4>
                        <ul className="text-xs md:text-sm space-y-4 font-sans text-rhum-cream">
                            <li className="flex justify-between max-w-[250px] mx-auto md:mx-0 border-b border-white/10 pb-2">
                                <span className="font-medium">Mardi - Samedi :</span>
                                <time className="font-black text-white tracking-wide">10h00 – 19h30</time>
                            </li>
                            <li className="flex justify-between max-w-[250px] mx-auto md:mx-0 text-rhum-gold font-bold">
                                <span>Dimanche - Lundi :</span>
                                <span className="uppercase tracking-widest text-[10px]">Fermé</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- BOUTON RETOUR EN HAUT --- */}
                <div className="relative flex justify-center h-0">
                    <button
                        onClick={scrollToTop}
                        aria-label="Retour en haut de page"
                        className="absolute -top-7 md:-top-8 flex flex-col items-center gap-1 group transition-all duration-300"
                    >
                        <span className="text-[8px] uppercase tracking-[0.4em] text-rhum-gold group-hover:text-white transition-all mb-1 font-black">
                            Haut
                        </span>
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-rhum-green border border-rhum-gold/40 rounded-sm flex items-center justify-center group-hover:border-rhum-gold transition-all z-10 shadow-2xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rhum-gold transition-transform group-hover:-translate-y-0.5">
                                <path d="m18 15-6-6-6 6"/>
                            </svg>
                        </div>
                    </button>
                </div>

                {/* --- BAS DU FOOTER --- */}
                <div className="pt-10 md:pt-12 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-rhum-cream/70 gap-4">
                    <p className="font-medium">© {currentYear} L'Établissement de la Route du Rhum — Tous droits réservés</p>
                    <nav className="flex gap-6 md:gap-10 font-sans">
                        <a href="/mentions-legales" className="hover:text-rhum-gold transition-colors font-bold">Mentions Légales</a>
                        <a href="/cgv" className="hover:text-rhum-gold transition-colors font-bold">CGV</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}