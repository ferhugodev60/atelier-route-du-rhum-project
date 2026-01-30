import { motion } from 'framer-motion';

interface BusinessWorkshopCardProps {
    onContact: () => void;
}

export default function BusinessWorkshopCard({ onContact }: BusinessWorkshopCardProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mb-24 p-8 md:p-12 border border-rhum-gold/30 bg-white/[0.02] rounded-sm overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-rhum-gold/5 rounded-full blur-3xl group-hover:bg-rhum-gold/10 transition-colors duration-700 pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl text-center lg:text-left">
                    <span className="text-rhum-gold font-sans tracking-[0.4em] uppercase text-[10px] font-black mb-3 block">Offre entreprise</span>
                    <h4 className="text-2xl md:text-4xl font-serif text-white mb-4">Événements & Cohésion d'équipe</h4>
                    <p className="text-rhum-cream/60 font-serif italic text-base md:text-lg leading-relaxed">"La même exigence, la même immersion : retrouvez nos ateliers signatures pour vos événements d’entreprise."</p>
                </div>
                <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
                    <div className="text-center lg:text-right">
                        <span className="text-white font-sans font-bold text-xl md:text-2xl block">Minimum 25 places</span>
                        <span className="text-rhum-gold/60 text-[10px] uppercase tracking-widest font-bold block mt-1">Tarif dégressif disponible</span>
                    </div>
                    <button onClick={onContact} className="px-8 py-4 bg-transparent border border-rhum-gold text-rhum-gold font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rhum-gold hover:text-rhum-green transition-all shadow-xl rounded-sm active:scale-95">Réserver dès maintenant</button>
                </div>
            </div>
        </motion.div>
    );
}