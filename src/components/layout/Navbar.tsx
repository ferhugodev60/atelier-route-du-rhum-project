import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScroll } from '../../hooks/useScroll';
import { LoginModal } from '../ui';

// Définition des types pour les props
interface NavbarProps {
    cartCount: number;
    onOpenCart: () => void;
}

const NAV_LINKS = [
    { name: 'Accueil', href: '/#home', isExternal: false },
    { name: "L'Atelier", href: '/#about', isExternal: false },
    { name: 'Nos Ateliers', href: '/#workshops', isExternal: false },
    { name: 'La Boutique', href: '/boutique', isExternal: true },
    { name: 'Contact', href: '/#contact', isExternal: false },
];

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
    const isScrolled = useScroll(50);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>('FR');

    const toggleLang = () => setCurrentLang(prev => prev === 'FR' ? 'EN' : 'FR');
    const linkStyle = "text-rhum-cream hover:text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold transition-all relative group";

    return (
        <>
            <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 border-b ${isScrolled ? 'bg-rhum-green/95 backdrop-blur-md py-4 shadow-2xl border-white/10' : 'bg-transparent py-8 border-transparent'}`}>
                <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center">

                    <div className="flex-shrink-0">
                        <button onClick={toggleLang} className="text-rhum-cream text-[10px] font-black tracking-widest hover:text-rhum-gold uppercase">
                            {currentLang} <span className="opacity-30 ml-1">/ {currentLang === 'FR' ? 'EN' : 'FR'}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-6 md:gap-10">
                        <div className="hidden lg:flex items-center gap-10">
                            {NAV_LINKS.map((link) => (
                                link.isExternal
                                    ? <Link key={link.name} to={link.href} className={linkStyle}>{link.name}<span className="absolute -bottom-1 left-0 w-0 h-px bg-rhum-gold transition-all group-hover:w-full" /></Link>
                                    : <a key={link.name} href={link.href} className={linkStyle}>{link.name}<span className="absolute -bottom-1 left-0 w-0 h-px bg-rhum-gold transition-all group-hover:w-full" /></a>
                            ))}
                        </div>

                        {/* --- ICÔNE PANIER AVEC BADGE --- */}
                        <button onClick={onOpenCart} className="relative p-2 text-rhum-gold hover:text-white transition-colors">
                            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-0 -right-0 bg-rhum-gold text-rhum-green text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>

                        <button onClick={() => setIsLoginModalOpen(true)} className={`hidden lg:block px-8 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-full ${isScrolled ? 'bg-rhum-gold text-rhum-green hover:bg-white shadow-lg' : 'border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-rhum-green'}`}>
                            SE CONNECTER
                        </button>

                        <button className="lg:hidden text-rhum-gold p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            <div className="space-y-1.5">
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                                <span className={`block w-6 h-0.5 bg-rhum-gold transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="absolute top-full left-0 w-full bg-rhum-green border-t border-white/5 overflow-hidden lg:hidden">
                            <div className="flex flex-col p-10 gap-8 text-center items-center">
                                {NAV_LINKS.map((link) => (
                                    link.isExternal
                                        ? <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold">{link.name}</Link>
                                        : <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-rhum-cream text-[11px] uppercase tracking-[0.4em] font-bold">{link.name}</a>
                                ))}
                                <button onClick={() => {setIsLoginModalOpen(true); setIsMobileMenuOpen(false);}} className="mt-4 w-full max-w-[240px] px-8 py-4 bg-rhum-gold text-rhum-green text-[10px] font-black uppercase tracking-[0.2em] rounded-full">SE CONNECTER</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </>
    );
}