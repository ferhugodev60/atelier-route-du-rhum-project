import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useScroll } from '../../hooks/useScroll.ts';
import { useAuthStore } from '../../store/authStore';
import { ChevronDown, ShoppingBag, User, Menu, X, Globe } from 'lucide-react';

interface NavbarProps {
    cartCount: number;
    onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const isScrolled = useScroll(50);

    const { user, token, setLoginOpen } = useAuthStore();
    const isAuthenticated = !!user && !!token;

    const isAdmin = user?.role === 'ADMIN';
    const isPro = user?.role === 'PRO';
    const profilePath = isAdmin ? '/admin/dashboard' : '/mon-compte';

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPrestationsHovered, setIsPrestationsHovered] = useState(false);
    const [currentLang, setCurrentLang] = useState<'FR' | 'EN'>('FR');

    // 🏺 LOGIQUE DE FIXATION DU BODY
    useEffect(() => {
        if (isMobileMenuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.overflowY = '';
        };
    }, [isMobileMenuOpen]);

    // 🏺 FONCTION DE NAVIGATION POUR LES ANCRES (#)
    const handleAnchorClick = (e: React.MouseEvent, target: string) => {
        setIsMobileMenuOpen(false);

        // Si on est déjà sur l'accueil, on scroll en douceur
        if (location.pathname === '/') {
            e.preventDefault();
            const id = target.split('#')[1];
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // Sinon, le Link to="/#contact" fera la redirection vers l'accueil
    };

    const handleOpenLogin = () => {
        setIsMobileMenuOpen(false);
        setLoginOpen(true);
    };

    const prestationLinks = [
        { name: 'Atelier Découverte', href: '/ateliers/decouverte' },
        { name: 'Atelier Conception', href: '/atelier-conception' },
        { name: 'Achat de bouteilles', href: '/boutique' },
        { name: 'Carte Cadeau', href: '/carte-cadeau' },
    ];

    const getLinkStyle = (path: string) => {
        const isActive = location.pathname === path;
        return `text-[10px] uppercase tracking-[0.3em] font-black transition-all relative group flex items-center gap-1 ${
            isActive ? 'text-rhum-gold' : 'text-rhum-cream hover:text-rhum-gold'
        }`;
    };

    const secondaryLinkStyle = "text-xl sm:text-2xl font-serif text-white/60 uppercase tracking-[0.1em] active:text-rhum-gold transition-colors";

    return (
        <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 border-b ${
            isScrolled ? 'bg-[#0a1a14]/95 backdrop-blur-md py-4 shadow-2xl border-white/10' : 'bg-transparent py-8 border-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between font-sans">

                <button className="lg:hidden text-rhum-gold p-2 z-[70] transition-transform active:scale-90" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <div className="hidden lg:flex items-center gap-12">
                    <button onClick={() => setCurrentLang(prev => prev === 'FR' ? 'EN' : 'FR')} className="text-rhum-cream text-[10px] font-black tracking-widest hover:text-rhum-gold uppercase min-w-[60px] text-left">
                        {currentLang} <span className="opacity-30 ml-1 text-[8px]">/ {currentLang === 'FR' ? 'EN' : 'FR'}</span>
                    </button>
                    <div className="flex items-center gap-10">
                        <Link to="/" className={getLinkStyle('/')}>Accueil</Link>

                        <div className="relative" onMouseEnter={() => setIsPrestationsHovered(true)} onMouseLeave={() => setIsPrestationsHovered(false)}>
                            <button className={getLinkStyle('/prestations')}>
                                Nos Prestations <ChevronDown size={10} className={`transition-transform ${isPrestationsHovered ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {isPrestationsHovered && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 w-64 pt-6">
                                        <div className="bg-[#0d1f18] border border-white/10 p-4 shadow-2xl backdrop-blur-xl">
                                            <div className="space-y-1">
                                                {prestationLinks.map((subLink) => (
                                                    <Link key={subLink.name} to={subLink.href} className={`block px-4 py-3 text-[9px] uppercase tracking-[0.2em] font-black border-l border-transparent transition-all ${location.pathname === subLink.href ? 'text-rhum-gold border-rhum-gold bg-white/5' : 'text-rhum-cream hover:text-rhum-gold hover:bg-white/5'}`}>
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link to="/boutique" className={getLinkStyle('/boutique')}>Boutique</Link>

                        {/* 🏺 CORRECTION ICI : Utilisation de Link + handleAnchorClick */}
                        <Link to="/#contact" onClick={(e) => handleAnchorClick(e, '/#contact')} className={getLinkStyle('/#contact')}>
                            Contact
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:block">
                        {isAuthenticated ? (
                            <button onClick={() => navigate(profilePath)} className="flex items-center gap-3 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-rhum-gold/30 hover:border-rhum-gold text-rhum-gold hover:text-white transition-all bg-white/5">
                                <User size={14} />
                                {isAdmin ? 'ADMIN' : isPro ? user?.companyName : user?.firstName}
                            </button>
                        ) : (
                            <button onClick={handleOpenLogin} className="px-10 py-3.5 text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-rhum-gold text-rhum-gold hover:bg-rhum-gold hover:text-[#0a1a14] transition-all">
                                SE CONNECTER
                            </button>
                        )}
                    </div>
                    <button onClick={onOpenCart} className="relative p-2 text-rhum-gold hover:text-white">
                        <ShoppingBag size={24} strokeWidth={1.5} />
                        {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-rhum-gold text-[#0a1a14] text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-[#0a1a14] shadow-lg">{cartCount}</span>}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '-100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '-100%' }}
                        transition={{ type: 'tween', duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed inset-0 h-[100dvh] w-full bg-[#0a1a14] z-[60] lg:hidden flex flex-col p-6 sm:p-10 overflow-hidden"
                    >
                        <div className="pt-20 pb-8 flex justify-center shrink-0">
                            <button onClick={() => setCurrentLang(prev => prev === 'FR' ? 'EN' : 'FR')} className="flex items-center gap-4 px-6 py-2.5 border border-white/5 rounded-full text-rhum-cream text-[10px] font-black tracking-[0.3em] bg-white/5 uppercase">
                                <Globe size={12} className="text-rhum-gold" />
                                <span>{currentLang}</span>
                                <span className="opacity-10 text-white">|</span>
                                <span className="opacity-30 text-white">{currentLang === 'FR' ? 'EN' : 'FR'}</span>
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center gap-[5vh] min-h-0 overflow-y-auto text-center py-4">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={secondaryLinkStyle}>Accueil</Link>

                            <div className="space-y-8 bg-white/[0.02] py-8 border-y border-white/5">
                                <span className="text-rhum-gold text-[10px] font-black uppercase tracking-[0.6em] block">Nos Prestations</span>
                                <div className="flex flex-col gap-6">
                                    {prestationLinks.map((link) => (
                                        <Link key={link.name} to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="text-white text-[15px] sm:text-[17px] uppercase tracking-[0.3em] font-black active:text-rhum-gold">
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-[5vh]">
                                <Link to="/boutique" onClick={() => setIsMobileMenuOpen(false)} className={secondaryLinkStyle}>Boutique</Link>

                                {/* 🏺 CORRECTION ICI POUR MOBILE AUSSI */}
                                <Link to="/#contact" onClick={(e) => handleAnchorClick(e, '/#contact')} className={secondaryLinkStyle}>
                                    Contact
                                </Link>
                            </div>
                        </div>

                        <div className="pt-8 pb-6 shrink-0">
                            <button
                                onClick={isAuthenticated ? () => {navigate(profilePath); setIsMobileMenuOpen(false)} : handleOpenLogin}
                                className="w-full py-6 bg-rhum-gold text-[#0a1a14] text-[11px] font-black uppercase tracking-[0.4em] rounded-sm shadow-2xl active:scale-95 transition-all"
                            >
                                {isAuthenticated ? `Profil (${user?.firstName})` : 'Se connecter'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}