import { Variants, TargetAndTransition } from 'framer-motion';

/**
 * Variantes pour les révélations au scroll (ScrollReveal)
 *
 */
export const revealVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: 'blur(10px)'
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        }
    }
};

/**
 * Variantes spécifiques pour le Hero (entrée immédiate)
 *
 */
export const heroVariants: Variants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay: 0.2,
            ease: "easeOut"
        }
    }
};

/**
 * Animation de rebond (Bounce)
 * Typage TargetAndTransition pour éviter l'erreur TS2339 en 2026
 */
export const bounceAnimation: TargetAndTransition = {
    y: [0, 6, 0],
    transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeOut"
    }
};