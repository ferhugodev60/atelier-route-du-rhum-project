import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useScroll } from '../../hooks/useScroll.ts';
import { useAuthStore } from '../../store/authStore';

import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

interface NavbarProps {
    cartCount: number;
    onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isScrolled = useScroll(50);

    const { user, token } = useAuthStore();
    const isAuthenticated = !!user && !!token;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>('FR');

    const openLogin = () => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); setIsMobileMenuOpen(false); };
    const openRegister = () => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); setIsMobileMenuOpen(false); };

    const navLinks = [
        { name: 'à propos', href: '#about', isAnchor: true },
        { name: 'Nos Ateliers', href: '#workshops', isAnchor: true },
        { name: 'Boutique', href: '/boutique', isAnchor: false },
        { name: 'Contact', href: '#contact', isAnchor: true },
    ];

    const linkStyle = "text-rhum-cream hover:text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative group";

    return (
        <>
            <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 border-b ${
                isScrolled ? 'bg-[#0a1a14]/95 backdrop-blur-md py-4 shadow-2xl border-white/10' : 'bg-transparent py-8 border-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center">

                    {/* LANGUE */}
                    <button onClick={() => setCurrentLang(prev => prev === 'FR' ? 'EN' : 'FR')} className="text-rhum-cream text-[10px] font-black tracking-widest hover:text-rhum-gold uppercase">
                        {currentLang} <span className="opacity-30 ml-1">/ {currentLang === 'FR' ? 'EN' : 'FR'}</span>
                    </button>

                    {/* NAVIGATION & ACTIONS */}
                    <div className="flex items-center gap-10">
                        <div className="hidden lg:flex items-center gap-10">
                            {navLinks.map((link) => (
                                link.isAnchor && location.pathname === "/" ? (
                                    <a key={link.name} href={link.href} className={linkStyle}>{link.name}</a>
                                ) : (
                                    <Link key={link.name} to={link.href.startsWith('#') ? `/${link.href}` : link.href} className={linkStyle}>{link.name}</Link>
                                )
                            ))}
                        </div>

                        {/* PANIER */}
                        <button onClick={onOpenCart} className="relative p-2 text-rhum-gold hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-rhum-gold text-[#0a1a14] text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* AUTHENTIFICATION DESKTOP */}
                        {isAuthenticated ? (
                            <button onClick={() => navigate('/mon-compte')} className="hidden lg:flex items-center px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-rhum-gold/30 hover:border-rhum-gold text-rhum-gold hover:text-white transition-all">
                                Bonjour {user?.firstName} !
                            </button>
                        ) : (
                            <button onClick={openLogin} className="hidden lg:block px-8 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-[#0a1a14] transition-all">
                                SE CONNECTER
                            </button>
                        )}

                        {/* HAMBURGER TRIGGER */}
                        <button className="lg:hidden text-rhum-gold p-2 z-50" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <div className="space-y-1.5">
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU OVERLAY */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-full left-0 w-full bg-[#0a1a14] border-t border-white/5 overflow-hidden lg:hidden z-40 shadow-2xl"
                        >
                            <div className="flex flex-col p-10 gap-8 text-center items-center">
                                {navLinks.map((link) => (
                                    link.isAnchor && location.pathname === "/" ? (
                                        <a
                                            key={link.name}
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold hover:text-rhum-gold transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link
                                            key={link.name}
                                            to={link.href.startsWith('#') ? `/${link.href}` : link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold hover:text-rhum-gold transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    )
                                ))}

                                <div className="h-px w-12 bg-rhum-gold/20 my-2" />

                                {isAuthenticated ? (
                                    <button
                                        onClick={() => { navigate('/mon-compte'); setIsMobileMenuOpen(false); }}
                                        className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-black"
                                    >
                                        Mon Profil ({user?.firstName})
                                    </button>
                                ) : (
                                    <button
                                        onClick={openLogin}
                                        className="w-full max-w-[240px] px-8 py-4 bg-rhum-gold text-[#0a1a14] text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-white transition-colors"
                                    >
                                        Connexion
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToRegister={openRegister} />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onSwitchToLogin={openLogin} />
        </>
    );
}