import {Workshop} from "../../../types/workshop.ts";

interface WorkshopCardProps {
    workshop: Workshop;
    onReserve: (item: Workshop) => void;
}

export default function WorkshopCard({ workshop, onReserve }: WorkshopCardProps) {
    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/40 shadow-2xl h-full">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-grow">
                <header className="flex justify-between items-start mb-6 md:mb-8">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight max-w-[60%]">
                        {workshop.title}
                    </h4>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-2xl md:text-4xl font-serif text-rhum-gold leading-none">
                            {workshop.price}€
                        </span>
                    </div>
                </header>

                <p className="text-rhum-cream/70 italic text-base md:text-lg mb-10 leading-relaxed font-serif">
                    "{workshop.quote}"
                </p>

                <div className="mt-auto">
                    <button
                        onClick={() => onReserve(workshop)}
                        className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                    >
                        RÉSERVER DÈS MAINTENANT
                    </button>
                </div>
            </div>
        </article>
    );
}