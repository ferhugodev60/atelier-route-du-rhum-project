import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import logo from '../assets/logo/logo.png';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('FR');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Accueil', href: '#home' },
        { name: "L'Atelier", href: '#about' },
        { name: 'Expériences', href: '#workshops' },
        { name: 'Avis', href: '#testimonials' },
        { name: 'Contact', href: '#contact' },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2,
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -15 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 }
        },
        exit: { opacity: 0, x: -10 }
    };

    return (
        <>
            <div className="fixed w-full z-50 px-4 py-4 md:px-8 pointer-events-none">
                <nav
                    className={`
                        relative max-w-7xl mx-auto flex items-center justify-between
                        transition-all duration-500 ease-in-out pointer-events-auto
                        ${isScrolled
                        ? 'bg-rhum-green/80 backdrop-blur-xl py-3 px-6 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-white/5'
                        : 'bg-transparent py-5 px-4 border border-transparent shadow-none'
                    }
                    `}
                >
                    {/* --- MOBILE : BURGER (À GAUCHE) --- */}
                    <div className="flex lg:hidden flex-1 justify-start">
                        <button
                            className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none z-[70]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Menu"
                        >
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 8, backgroundColor: "#D4AF37" } : { rotate: 0, y: 0, backgroundColor: "#D4AF37" }}
                                className="w-6 h-0.5 block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                                className="w-6 h-0.5 bg-rhum-gold block"
                            />
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -8, backgroundColor: "#D4AF37" } : { rotate: 0, y: 0, backgroundColor: "#D4AF37" }}
                                className="w-6 h-0.5 block"
                            />
                        </button>
                    </div>

                    {/* --- LOGO (CENTRE SUR MOBILE / GAUCHE SUR DESKTOP) --- */}
                    <a
                        href="#home"
                        className={`
                            group flex-shrink-0 z-10 transition-all duration-500
                            absolute left-1/2 -translate-x-1/2 
                            lg:static lg:translate-x-0
                        `}
                    >
                        <div className="absolute -inset-3 bg-rhum-gold/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"></div>
                        <img
                            src={logo}
                            alt="Logo L'Atelier de la Route du Rhum"
                            className={`relative transition-all duration-500 transform ${
                                isScrolled ? 'h-14 md:h-16' : 'h-20 md:h-28'
                            } w-auto group-hover:scale-105`}
                        />
                    </a>

                    {/* --- DESKTOP : NAVIGATION CENTRALE --- */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 text-rhum-cream hover:text-rhum-gold text-[11px] uppercase tracking-[0.2em] transition-all font-bold"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* --- ACTIONS DROITE (DESKTOP & MOBILE ACCOUNT) --- */}
                    <div className="flex flex-1 lg:flex-none justify-end items-center gap-6">
                        {/* Desktop Only */}
                        <button
                            onClick={() => setCurrentLang(currentLang === 'FR' ? 'EN' : 'FR')}
                            className="hidden lg:block text-rhum-cream text-[10px] font-bold tracking-tighter hover:text-rhum-gold transition-colors border-b border-rhum-gold/30 pb-0.5"
                        >
                            {currentLang}
                        </button>

                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className={`
                                hidden lg:block relative overflow-hidden px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300
                                ${isScrolled
                                ? 'bg-rhum-gold text-rhum-green hover:bg-white rounded-sm shadow-sm'
                                : 'border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green rounded-sm shadow-none'
                            }
                            `}
                        >
                            <span className="relative z-10">SE CONNECTER</span>
                        </button>

                        {/* MOBILE ONLY : ICÔNE ACCOUNT (À DROITE) */}
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="lg:hidden text-rhum-gold p-1 hover:scale-110 transition-transform"
                            aria-label="Mon compte"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                    </div>

                    {/* --- MENU MOBILE DÉROULANT --- */}
                    <AnimatePresence mode="wait">
                        {isMobileMenuOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[55] lg:hidden pointer-events-auto"
                                />

                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="absolute top-full left-0 right-0 mt-3 px-2 lg:hidden pointer-events-auto z-[60]"
                                >
                                    <div className="bg-rhum-green border border-white/10 rounded-sm p-8 shadow-2xl flex flex-col gap-6 text-center">
                                        {navLinks.map((link) => (
                                            <motion.a
                                                variants={itemVariants}
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-rhum-cream text-[11px] uppercase tracking-[0.3em] font-bold hover:text-rhum-gold transition-colors"
                                            >
                                                {link.name}
                                            </motion.a>
                                        ))}

                                        <motion.div variants={itemVariants} className="flex justify-center items-center gap-8 py-4 border-t border-white/5 mt-2">
                                            <button
                                                onClick={() => setCurrentLang('FR')}
                                                className={`text-[10px] font-bold tracking-widest transition-colors ${currentLang === 'FR' ? 'text-rhum-gold border-b border-rhum-gold' : 'text-rhum-cream opacity-40'}`}
                                            >
                                                FR
                                            </button>
                                            <button
                                                onClick={() => setCurrentLang('EN')}
                                                className={`text-[10px] font-bold tracking-widest transition-colors ${currentLang === 'EN' ? 'text-rhum-gold border-b border-rhum-gold' : 'text-rhum-cream opacity-40'}`}
                                            >
                                                EN
                                            </button>
                                        </motion.div>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => {
                                                setIsLoginModalOpen(true);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="bg-rhum-gold text-rhum-green py-4 text-[10px] font-black uppercase tracking-widest rounded-sm active:scale-95 transition-transform shadow-lg"
                                        >
                                            Se connecter
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </nav>
            </div>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
};

export default Navbar;