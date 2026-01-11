import React from 'react';
import { motion, Transition } from 'framer-motion';

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaPrimaryLabel?: string;
    ctaSecondaryLabel?: string;
    backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
                                       title = "Devenez l'Alchimiste",
                                       subtitle = "Entrez dans l’antre du Druide à Compiègne. Maîtrisez l’art de l’assemblage et créez votre propre nectar artisanal.",
                                       ctaPrimaryLabel = "Réserver mon atelier",
                                       backgroundImage = "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzteO5ijNpJCeICoy4tQK3Tf8L2B6IZfOmM8Df-zzLV_GkK149i1JfrKdbV8uXc__7WXcBI78LRir2WRu8j9zlfxRoIp1-7x_mSxfh1SbpFnwIY-MZ6HqwrlZ93F1dZn79B60A=s1360-w1360-h1020-rw"
                                   }) => {

    const bounceTransition: Transition = {
        y: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut"
        }
    };

    return (
        <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-rhum-green">
            <div className="absolute inset-0 bg-black/75 z-10" />

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />

            <div className="relative z-20 px-4 max-w-4xl mx-auto mt-0 md:mt-[-60px]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
                        <div className="h-px w-6 md:w-16 bg-rhum-gold opacity-70"></div>
                        <p className="text-rhum-gold font-sans tracking-[0.3em] md:tracking-[0.4em] uppercase text-[9px] md:text-xs font-bold">
                            Créateur de Saveurs
                        </p>
                        <div className="h-px w-6 md:w-16 bg-rhum-gold opacity-70"></div>
                    </div>

                    <h1 className="text-3xl md:text-7xl font-serif text-white mb-6 md:mb-8 leading-tight drop-shadow-lg">
                        {title}
                    </h1>

                    <p className="text-base md:text-xl text-white/85 font-sans max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed italic px-2">
                        {subtitle}
                    </p>

                    <div className="flex justify-center items-center">
                        <a href="#workshops" className="no-underline">
                            {/* CTA AJUSTÉ : Suppression du w-full, ajout de px-12 pour une largeur contenue */}
                            <button className="px-12 md:px-14 py-3.5 md:py-4 bg-rhum-gold hover:bg-white text-rhum-green font-black rounded-sm transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.4)] uppercase tracking-widest text-[10px] md:text-xs transform hover:-translate-y-1">
                                {ctaPrimaryLabel}
                            </button>
                        </a>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-30"
            >
                <a href="#about" className="group flex flex-col items-center gap-2 md:gap-3 no-underline">
                    <span className="text-rhum-gold/70 text-[8px] md:text-[9px] uppercase tracking-[0.5em] font-bold group-hover:text-rhum-gold transition-colors">
                        Explorer
                    </span>

                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-rhum-gold/30 flex items-center justify-center group-hover:bg-rhum-gold/10 group-hover:border-rhum-gold/60 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-black/20">
                        <motion.svg
                            animate={{ y: [0, 6, 0] }}
                            transition={bounceTransition}
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-rhum-gold md:w-6 md:h-6"
                        >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                        </motion.svg>
                    </div>
                </a>
            </motion.div>
        </section>
    );
};

export default Hero;