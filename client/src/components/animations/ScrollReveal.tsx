import { motion } from 'framer-motion';
import { revealVariants } from '../../utils/animations';
import { PropsWithChildren } from 'react';

interface ScrollRevealProps extends PropsWithChildren {
    delay?: number;
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
                margin: "0px 0px -50px 0px",
                amount: 0.1
            }}
            /* On fusionne le délai avec les variantes sans écraser la durée/ease
               définis dans utils/animations.ts
            */
            transition={{
                delay,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
}