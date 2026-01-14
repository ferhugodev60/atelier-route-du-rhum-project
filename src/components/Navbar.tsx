import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('FR');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation regroupée pour l'Atelier au 12 rue des Cordeliers
    const navLinks = [
        { name: 'Accueil', href: '#home' },
        { name: "L'Atelier", href: '#about' },
        { name: 'Nos Formules', href: '#workshops' },
        { name: 'Avis', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <nav
                className={`fixed w-full top-0 left-0 z-50 transition-all duration-700 ${
                    isScrolled
                        ? 'bg-rhum-green/95 backdrop-blur-md py-4 shadow-2xl border-b border-white/5'
                        : 'bg-transparent py-8'
                }`}
            >
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center">

                    {/* --- GAUCHE : SÉLECTEUR DE LANGUE DISCRET --- */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setCurrentLang(currentLang === 'FR' ? 'EN' : 'FR')}
                            className="text-rhum-cream text-[10px] font-black tracking-widest hover:text-rhum-gold transition-colors"
                        >
                            {currentLang} <span className="opacity-30 ml-1">/ {currentLang === 'FR' ? 'EN' : 'FR'}</span>
                        </button>
                    </div>

                    {/* --- DROITE : TOUTE LA NAVIGATION REGROUPÉE --- */}
                    <div className="flex items-center gap-10">
                        {/* Liens Desktop regroupés */}
                        <div className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-rhum-cream hover:text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative group"
                                >
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-rhum-gold transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>

                        {/* Bouton de connexion - Style Pilule */}
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className={`
                                relative overflow-hidden px-8 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-full
                                ${isScrolled
                                ? 'bg-rhum-gold text-rhum-green hover:bg-white shadow-lg'
                                : 'border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green'
                            }
                            `}
                        >
                            SE CONNECTER
                        </button>

                        {/* Mobile Burger (uniquement sur mobile) */}
                        <button
                            className="lg:hidden text-rhum-gold p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="space-y-1.5">
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-rhum-gold ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
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
                            <div className="flex flex-col p-10 gap-8 text-center">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
};

export default Navbar;