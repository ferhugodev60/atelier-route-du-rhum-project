import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../hooks/useScroll';
import { LoginModal } from '../ui';

const NAV_LINKS = [
    { name: 'Accueil', href: '#home' },
    { name: "L'Atelier", href: '#about' },
    { name: 'Nos Formules', href: '#workshops' },
    { name: 'Avis', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const isScrolled = useScroll(50);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>('FR');

    const toggleLang = () => setCurrentLang(prev => prev === 'FR' ? 'EN' : 'FR');

    // Fonction pour ouvrir la modale et fermer le menu mobile simultanément
    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 border-b ${
                    isScrolled
                        ? 'bg-rhum-green/95 backdrop-blur-md py-4 shadow-2xl border-white/10'
                        : 'bg-transparent py-8 border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center">

                    {/* Langue */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={toggleLang}
                            className="text-rhum-cream text-[10px] font-black tracking-widest hover:text-rhum-gold transition-colors uppercase"
                        >
                            {currentLang} <span className="opacity-30 ml-1">/ {currentLang === 'FR' ? 'EN' : 'FR'}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-10">
                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex items-center gap-10">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-rhum-cream hover:text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-rhum-gold transition-all group-hover:w-full" />
                                </a>
                            ))}
                        </div>

                        {/* --- BOUTON DESKTOP : Uniquement visible sur Large Screen (lg) --- */}
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className={`hidden lg:block px-8 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-full ${
                                isScrolled
                                    ? 'bg-rhum-gold text-rhum-green hover:bg-white shadow-lg'
                                    : 'border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green'
                            }`}
                        >
                            SE CONNECTER
                        </button>

                        {/* Burger Menu Button */}
                        <button
                            className="lg:hidden text-rhum-gold p-2 focus:outline-none"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <div className="space-y-1.5">
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* --- MENU MOBILE --- */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-full left-0 w-full bg-rhum-green border-t border-white/5 overflow-hidden lg:hidden"
                        >
                            <div className="flex flex-col p-10 gap-8 text-center items-center">
                                {NAV_LINKS.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold"
                                    >
                                        {link.name}
                                    </a>
                                ))}

                                {/* --- BOUTON MOBILE : Intégré dans le menu déroulant --- */}
                                <button
                                    onClick={handleLoginClick}
                                    className="mt-4 w-full max-w-[240px] px-8 py-4 bg-rhum-gold text-rhum-green text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl"
                                >
                                    SE CONNECTER
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}