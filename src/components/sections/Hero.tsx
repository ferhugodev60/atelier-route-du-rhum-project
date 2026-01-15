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
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-radial-dark">
            {/* Overlay de profondeur */}
            <div className="absolute inset-0 bg-black/20 z-10" aria-hidden="true" />

            <div className="relative z-20 px-4 max-w-4xl mx-auto mt-0 md:mt-[-20px]">
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Logo optimisé avec priorité de chargement via le navigateur */}
                    <div className="mb-8 md:mb-12">
                        <img
                            src={logoImg}
                            alt="Logo L'Atelier de la Route du Rhum"
                            className="h-32 md:h-56 mx-auto drop-shadow-custom"
                            loading="eager"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="h-px w-6 md:w-16 bg-rhum-gold/70" />
                        <p className="text-rhum-gold font-sans tracking-[0.4em] uppercase text-[9px] md:text-xs font-bold">
                            Créateur de Saveurs
                        </p>
                        <div className="h-px w-6 md:w-16 bg-rhum-gold/70" />
                    </div>

                    <h1 className="text-3xl md:text-7xl font-serif text-white mb-6 md:mb-8 leading-tight drop-shadow-lg">
                        {title}
                    </h1>

                    <p className="text-base md:text-xl text-white/85 font-sans max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed italic px-2">
                        {subtitle}
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
                        <a
                            href="#workshops"
                            className="w-full md:w-auto px-10 md:px-14 py-3.5 md:py-4 bg-rhum-gold hover:bg-white text-rhum-green font-black rounded-sm transition-all duration-300 uppercase tracking-widest text-[10px] md:text-xs text-center"
                        >
                            {ctaPrimaryLabel}
                        </a>

                        <a
                            href="#menu"
                            className="w-full md:w-auto px-10 md:px-14 py-3.5 md:py-4 bg-transparent border border-white/50 hover:border-rhum-gold hover:bg-rhum-gold/10 text-white font-bold rounded-sm transition-all duration-300 uppercase tracking-widest text-[10px] md:text-xs backdrop-blur-sm text-center"
                        >
                            {ctaSecondaryLabel}
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Bouton Explorer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30"
            >
                <a href="#about" className="group flex flex-col items-center gap-2 md:gap-3 no-underline">
          <span className="text-rhum-gold/70 text-[8px] md:text-[9px] uppercase tracking-[0.5em] font-bold group-hover:text-rhum-gold transition-colors">
            Explorer l'atelier
          </span>

                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-rhum-gold/30 flex items-center justify-center group-hover:bg-rhum-gold/10 group-hover:border-rhum-gold/60 transition-all duration-300 backdrop-blur-sm">
                        <motion.svg
                            animate={{ y: [0, 6, 0] }}
                            transition={bounceAnimation}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-rhum-gold md:w-6 md:h-6"
                        >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <polyline points="19 12 12 19 5 12" />
                        </motion.svg>
                    </div>
                </a>
            </motion.div>
        </section>
    );
}