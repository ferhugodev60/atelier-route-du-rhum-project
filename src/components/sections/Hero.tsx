import { motion } from 'framer-motion';
import { heroVariants, bounceAnimation } from '../../utils/animations';
import logoImg from '../../assets/logo/logo.png';

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaPrimaryLabel?: string;
    ctaSecondaryLabel?: string;
}

export default function Hero({
                                 title = "Devenez l'Alchimiste",
                                 subtitle = "Entrez dans l’antre du Druide à Compiègne. Maîtrisez l’art de l’assemblage et créez votre propre nectar artisanal.",
                                 ctaPrimaryLabel = "Réserver mon atelier",
                                 ctaSecondaryLabel = "Découvrir nos bouteilles",
                             }: HeroProps) {
    return (
        /* Architecture Grid Rows pour un contrôle total de l'espace vertical [cite: 2025-12-08] */
        <section className="relative h-[100dvh] w-full overflow-hidden grid grid-rows-[auto_1fr_auto] bg-radial-dark">
            <div className="absolute inset-0 bg-black/30 z-10" aria-hidden="true" />

            {/* --- LIGNE 1 : ESPACE RÉSERVÉ NAVBAR --- */}
            <div className="h-24 md:h-32 pointer-events-none z-0" />

            {/* --- LIGNE 2 : BLOC CENTRAL ÉLASTIQUE --- */}
            <div className="relative z-20 flex items-center justify-center px-6 overflow-hidden">
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto w-full text-center flex flex-col items-center justify-center max-h-[65vh] md:max-h-full"
                >
                    {/* Logo adaptatif */}
                    <div className="mb-4 md:mb-8 shrink min-h-0">
                        <img
                            src={logoImg}
                            alt="Logo L'Atelier"
                            className="max-h-[12vh] sm:max-h-[18vh] md:max-h-[22vh] w-auto h-auto mx-auto drop-shadow-custom"
                            loading="eager"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 md:gap-4 mb-3 md:mb-6 shrink-0">
                        <div className="h-px w-6 md:w-16 bg-rhum-gold/70" />
                        <p className="text-rhum-gold font-sans tracking-[0.4em] uppercase text-[8px] md:text-xs font-bold">
                            Créateur de Saveurs
                        </p>
                        <div className="h-px w-6 md:w-16 bg-rhum-gold/70" />
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-4 md:mb-8 leading-tight drop-shadow-lg shrink-0">
                        {title}
                    </h1>

                    <p className="text-[13px] sm:text-base md:text-xl text-white/90 font-sans max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed italic px-2 hidden sm:block">
                        {subtitle}
                    </p>

                    {/* --- CTAs EN MAJUSCULES --- */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-6 w-full md:w-auto shrink-0">
                        <a
                            href="#workshops"
                            className="w-full md:w-auto px-8 md:px-14 py-3.5 md:py-4 bg-rhum-gold hover:bg-white text-rhum-green font-black rounded-sm transition-all uppercase tracking-widest text-[9px] md:text-xs text-center shadow-xl"
                        >
                            {ctaPrimaryLabel}
                        </a>
                        <a
                            href="#menu"
                            className="w-full md:w-auto px-8 md:px-14 py-3.5 md:py-4 bg-transparent border border-white/40 text-white font-bold rounded-sm transition-all uppercase tracking-widest text-[9px] md:text-xs text-center backdrop-blur-sm hover:bg-rhum-gold/10 hover:border-rhum-gold"
                        >
                            {ctaSecondaryLabel}
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* --- LIGNE 3 : FOOTER EXPLORER --- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="relative z-30 flex flex-col items-center justify-center py-6 md:py-10"
            >
                <div className="pb-[env(safe-area-inset-bottom)]">
                    <a href="#about" className="group flex flex-col items-center gap-1 md:gap-3 no-underline">
                        <span className="text-rhum-gold/70 text-[8px] md:text-[9px] uppercase tracking-[0.4em] font-bold group-hover:text-rhum-gold transition-colors">
                            Explorer l'atelier
                        </span>
                        <div className="w-9 h-9 md:w-12 md:h-12 rounded-full border border-rhum-gold/30 flex items-center justify-center group-hover:bg-rhum-gold/10 transition-all backdrop-blur-sm">
                            <motion.svg animate={bounceAnimation} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rhum-gold md:w-6 md:h-6">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <polyline points="19 12 12 19 5 12" />
                            </motion.svg>
                        </div>
                    </a>
                </div>
            </motion.div>
        </section>
    );
}