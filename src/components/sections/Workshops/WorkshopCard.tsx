import { IMG_DISCOVERY } from '../../../data/workshops';

interface WorkshopCardProps {
    onReserve: (item: any) => void;
}

export default function WorkshopCard({ onReserve }: WorkshopCardProps) {
    const handleQuickReserve = () => {
        // Transmission de l'objet avec ID unique et prix nettoyable
        onReserve({
            id: "Atelier_Decouverte_" + Date.now(),
            title: "L'Atelier Découverte",
            price: "60€",
            image: IMG_DISCOVERY,
            type: "Atelier"
        });
    };

    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/40 shadow-2xl h-full">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={IMG_DISCOVERY}
                    alt="Session d'initiation à l'Atelier"
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-grow">
                <header className="flex justify-between items-start mb-6 md:mb-8">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight max-w-[60%]">
                        L'Atelier Découverte
                    </h4>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-2xl md:text-4xl font-serif text-rhum-gold leading-none">
                            60€
                        </span>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-rhum-gold/60 mt-1.5">
                            à pré-payer
                        </span>
                    </div>
                </header>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                    <span>⏱ 1h30</span>
                    <span>📜 Valable 30 jours à partir de la date d'achat</span>
                </div>

                <p className="text-rhum-cream/70 italic text-base md:text-lg mb-10 leading-relaxed font-serif">
                    "Explorez notre label lors d’un échange privilégié avec le Druide. Au menu : forum question / réponse et dégustation généreuse d'une demi-palette de notre rhum."
                </p>

                <div className="mt-auto space-y-6">
                    <button
                        onClick={handleQuickReserve}
                        className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                    >
                        RÉSERVER DÈS MAINTENANT
                    </button>

                    <div className="flex justify-center items-center gap-2 text-white/20">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium">
                            Sécurisé via Stripe
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}