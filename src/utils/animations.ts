import { Variants } from 'framer-motion';

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

// Version optimisée du bounce (Typage strict 2026)
export const bounceAnimation: Variants = {
    animate: {
        y: [0, 6, 0],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeOut"
        }
    }
};