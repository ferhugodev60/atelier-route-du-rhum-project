import { IMG_DISCOVERY } from '../../../data/workshops';

export default function WorkshopCard() {
    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/20 shadow-2xl">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={IMG_DISCOVERY}
                    alt="Session d'initiation"
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">L'Atelier Découverte</h4>
                    <span className="text-2xl md:text-4xl font-serif text-rhum-gold">60€</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                    <span>⏱ 1h30</span>
                    <span>📜 Valable 30 jours après achat</span>
                </div>
                <p className="text-rhum-cream/70 italic text-base md:text-lg mb-8 leading-relaxed">
                    "Une initiation parfaite pour découvrir les bases de l'assemblage sous les conseils du Druide."
                </p>
                <button className="mt-auto w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-lg rounded-sm">
                    RÉSERVER L'ATELIER
                </button>
            </div>
        </article>
    );
}