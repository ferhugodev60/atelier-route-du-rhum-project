// src/utils/animations.ts
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
            ease: [0.22, 1, 0.36, 1], // Cubic-bezier pour un mouvement plus organique
        }
    }
};