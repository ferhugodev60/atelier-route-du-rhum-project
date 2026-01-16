import { motion } from 'framer-motion';
import boutiqueImg from '../../../assets/images/boutique.webp';

export default function ShopBanner() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative min-h-[350px] md:min-h-[450px] flex items-center justify-center text-center overflow-hidden rounded-sm shadow-2xl border border-rhum-gold/10"
        >
            {/* --- IMAGE DE FOND AVEC FILTRE DE LUMINOSITÉ --- */}
            <img
                src={boutiqueImg}
                className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.6] transition-transform duration-[3000ms] hover:scale-110"
                alt="Boutique de l'Atelier"
                loading="lazy"
            />

            {/* --- OVERLAY PLUS SOMBRE ET PROFOND --- */}
            {/* Passage de /80 à /92 pour un contraste maximal avec le texte blanc/gold */}
            <div className="absolute inset-0 bg-rhum-green/92 backdrop-blur-[2px] z-10" aria-hidden="true" />

            <div className="relative z-20 p-8 md:p-16 max-w-4xl">
                <header>
                    <h4 className="font-serif text-2xl md:text-4xl mb-6 italic text-rhum-gold uppercase tracking-[0.3em] drop-shadow-md">
                        ACHAT DE BOUTEILLES
                    </h4>
                    <div className="w-16 md:w-24 h-px bg-rhum-gold/40 mx-auto mb-8" />
                </header>

                <p className="max-w-2xl mx-auto text-sm md:text-lg text-white font-sans opacity-100 mb-10 leading-relaxed tracking-wide">
                    Découvrez nos bouteilles de fabrication artisanale française aux saveurs uniques.
                </p>

                {/* CTA en majuscules avec tracking renforcé */}
                <button className="px-10 md:px-14 py-4 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white hover:text-rhum-green transition-all shadow-2xl active:scale-95 rounded-sm">
                    Découvrir la collection
                </button>
            </div>

            {/* Dégradé de finition pour l'immersion */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-15 pointer-events-none" />
        </motion.div>
    );
}