import { motion } from 'framer-motion';
import { heroVariants, bounceAnimation } from '../../utils/animations.ts';
import logoImg from '../../assets/logo/logo.webp';
import { Link } from "react-router-dom";

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaPrimaryLabel?: string;
    ctaSecondaryLabel?: string;
}

export default function Hero({
                                 title = "Devenez l'Alchimiste",
                                 subtitle = "Entrez dans l’univers de l'Établissement à Compiègne. Maîtrisez l’art de l’assemblage et créez votre propre nectar artisanal.",
                                 ctaPrimaryLabel = "Réserver mon atelier",
                                 ctaSecondaryLabel = "Découvrir nos bouteilles",
                             }: HeroProps) {
    return (
        /* 🏺 Grid adaptatif : Auto sur mobile pour la sécurité, VH sur Desktop pour l'élégance */
        <section className="relative h-[100dvh] w-full overflow-hidden grid grid-rows-[80px_1fr_100px] md:grid-rows-[7vh_1fr_12vh] bg-radial-dark font-sans">
            <div className="absolute inset-0 bg-black/30 z-10" aria-hidden="true" />

            {/* --- LIGNE 1 : ESPACE NAVBAR --- */}
            <div className="pointer-events-none z-0" />

            {/* --- LIGNE 2 : CŒUR DE PAGE --- */}
            <div className="relative z-20 flex items-center justify-center px-6 min-h-0">
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    /* 🏺 Gaps fixes sur mobile, élastiques sur desktop */
                    className="max-w-6xl mx-auto w-full text-center flex flex-col items-center justify-center gap-4 md:gap-[clamp(1.5rem,2.5vh,2.5rem)]"
                >
                    {/* Logo : Taille sécurisée sur mobile, VH sur Mac */}
                    <div className="shrink-0">
                        <img
                            src={logoImg}
                            alt="Logo Prestige"
                            className="h-[60px] sm:h-[80px] md:h-[clamp(100px,15vh,150px)] w-auto mx-auto drop-shadow-custom"
                            loading="eager"
                        />
                    </div>

                    {/* Tagline */}
                    <div className="flex items-center justify-center gap-3 md:gap-4 shrink-0">
                        <div className="h-px w-6 md:w-12 bg-rhum-gold/60" />
                        <p className="text-rhum-gold tracking-[0.4em] uppercase text-[8px] md:text-[clamp(9px,1vh,11px)] font-black">
                            Créateur de Saveurs
                        </p>
                        <div className="h-px w-6 md:w-12 bg-rhum-gold/60" />
                    </div>

                    {/* Titre : Taille fixe mobile pour éviter le débordement, Clamp VH pour le Mac */}
                    <h1 className="text-4xl sm:text-5xl md:text-[clamp(3rem,8vh,5rem)] font-serif text-white leading-[1.1] drop-shadow-lg shrink-0 uppercase tracking-tighter">
                        {title}
                    </h1>

                    {/* Sous-titre : Clamp de sécurité pour la lecture */}
                    <p className="block text-[11px] sm:text-base md:text-[clamp(0.9rem,1.8vh,1.1rem)] text-white/80 max-w-xl mx-auto leading-relaxed px-4 font-light">
                        {subtitle}
                    </p>

                    {/* CTAs : Paddings stables sur mobile, VH sur desktop */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-3 md:gap-8 w-full md:w-auto mt-2 md:mt-[1.5vh]">
                        <a
                            href="#workshops"
                            className="w-full md:w-auto px-10 md:px-14 py-3.5 md:py-[clamp(12px,2vh,18px)] bg-rhum-gold hover:bg-white text-rhum-green font-black rounded-sm transition-all uppercase tracking-[0.25em] text-[10px] md:text-[clamp(10px,1.2vh,12px)] text-center shadow-2xl"
                        >
                            {ctaPrimaryLabel}
                        </a>
                        <Link
                            to="/boutique"
                            className="w-full md:w-auto px-10 md:px-14 py-3.5 md:py-[clamp(12px,2vh,18px)] bg-transparent border border-white/20 text-white font-bold rounded-sm transition-all uppercase tracking-[0.25em] text-[10px] md:text-[clamp(10px,1.2vh,12px)] text-center backdrop-blur-md hover:bg-rhum-gold/10 hover:border-rhum-gold"
                        >
                            {ctaSecondaryLabel}
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* --- LIGNE 3 : PIED DE PAGE --- */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="relative z-30 flex flex-col items-center justify-center shrink-0"
            >
                <a href="#about" className="group flex flex-col items-center gap-1 no-underline">
                    <span className="text-rhum-gold/60 text-[8px] md:text-[clamp(8px,1vh,10px)] uppercase tracking-[0.4em] font-black group-hover:text-rhum-gold transition-colors">
                        Explorer l'Atelier
                    </span>
                    <div className="w-8 h-8 md:w-[clamp(35px,4.5vh,50px)] md:h-[clamp(35px,4.5vh,50px)] rounded-full border border-rhum-gold/20 flex items-center justify-center group-hover:bg-rhum-gold/5 transition-all backdrop-blur-sm">
                        <motion.svg animate={bounceAnimation} className="text-rhum-gold w-4 h-4 md:w-[1.8vh] md:h-[1.8vh]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </motion.svg>
                    </div>
                </a>
            </motion.div>
        </section>
    );
}