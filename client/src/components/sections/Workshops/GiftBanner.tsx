// server/src/components/Workshops/GiftBanner.tsx
import { motion } from 'framer-motion';

interface GiftBannerProps {
    onOpenModal: () => void;
}

export default function GiftBanner({ onOpenModal }: GiftBannerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 p-8 md:p-16 border border-rhum-gold/20 bg-white/40 backdrop-blur-md rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
            <div className="text-center md:text-left relative z-10">
                <span className="text-rhum-gold text-[10px] font-black uppercase tracking-[0.4em]">Générosité & Cursus</span>
                <h4 className="text-3xl md:text-5xl font-serif text-[#0a1a14] mt-3 uppercase leading-tight">Envie de faire un cadeau ?</h4>
                <p className="text-sm text-gray-600 mt-4 max-w-lg font-light leading-relaxed">
                    Offrez la liberté de choisir parmi nos séances techniques ou nos flacons de prestige avec un Titre de Cursus au porteur.
                </p>
            </div>

            <button
                onClick={onOpenModal}
                className="group relative overflow-hidden bg-[#0a1a14] text-rhum-gold px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl hover:bg-rhum-gold hover:text-[#0a1a14]"
            >
                <span className="relative z-10">Offrir un Titre</span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
        </motion.div>
    );
}