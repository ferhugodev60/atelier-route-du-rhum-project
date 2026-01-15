import { motion } from 'framer-motion';
import { revealVariants } from '../../utils/animations';
import { PropsWithChildren } from 'react';

interface ScrollRevealProps extends PropsWithChildren {
    delay?: number; // Permet de décaler l'apparition si besoin
    width?: "fit-content" | "100%";
}

export default function ScrollReveal({
                                         children,
                                         delay = 0,
                                         width = "100%"
                                     }: ScrollRevealProps) {
    return (
        <motion.div
            variants={revealVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                margin: "-100px",
                amount: 0.2
            }}
            transition={{ delay }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
}