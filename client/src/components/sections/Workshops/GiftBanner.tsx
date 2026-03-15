import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function GiftBanner() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 p-8 md:p-16 border border-rhum-gold/20 bg-white/5 backdrop-blur-md rounded-sm flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
            <div className="text-center md:text-left relative z-10">
                <span className="text-rhum-gold text-[10px] font-black uppercase tracking-[0.4em]">Achat de carte cadeau</span>
                <h4 className="text-3xl md:text-5xl font-serif text-white mt-3 uppercase leading-tight">Envie de faire un cadeau ?</h4>
                <p className="text-sm text-white/60 mt-4 max-w-lg font-light leading-relaxed">
                    Offrez la liberté de choisir parmi nos ateliers ou nos bouteilles de prestige via une carte cadeau.
                </p>
            </div>

            <button
                onClick={() => navigate('/carte-cadeau')}
                className="group relative overflow-hidden bg-rhum-gold text-rhum-green px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl hover:bg-white"
            >
                <span className="relative z-10 font-black">Consulter</span>
            </button>
        </motion.div>
    );
}