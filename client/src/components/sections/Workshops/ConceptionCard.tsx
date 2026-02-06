import {Workshop} from "../../../types/workshop.ts";

interface ConceptionCardProps {
    workshops: Workshop[];
    onOpenDetail: (detail: Workshop) => void;
}

export default function ConceptionCard({ workshops, onOpenDetail }: ConceptionCardProps) {
    return (
        <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-10 h-full justify-between">
            <div>
                <header className="flex justify-between items-baseline mb-6 md:mb-12">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">L'Atelier Conception</h4>
                    <span className="text-rhum-gold font-sans text-[9px] uppercase tracking-widest font-bold opacity-60">Par Étapes</span>
                </header>

                <div className="relative">
                    <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-rhum-gold/10" />

                    <ul className="space-y-4 md:space-y-6 relative z-10">
                        {workshops.map((item) => (
                            <li key={item.id} className="flex justify-between items-center group gap-4 px-3 py-3 md:py-4 -mx-3 rounded-sm transition-all duration-300 hover:bg-white/[0.03]">
                                <div className="flex items-center gap-4 md:gap-7 min-w-0">
                                    <div
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-rhum-gold/20"
                                        style={{ backgroundColor: `${item.color}20` }} // Opacité 20%
                                    >
                                        <span className="text-rhum-gold font-black text-base md:text-xl">{item.level}</span>
                                    </div>
                                    <span className="text-rhum-cream text-base md:text-lg italic truncate font-medium group-hover:text-white">
                                        {item.title.includes(':') ? item.title.split(': ')[1] : item.title}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onOpenDetail(item)}
                                    className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-4 md:px-6 py-2.5 hover:bg-rhum-gold hover:text-rhum-green transition-all rounded-sm"
                                >
                                    Détails
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-12 bg-rhum-gold/10 p-5 border border-rhum-gold/30 rounded-sm">
                <p className="text-[9px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                    Progression obligatoire : le niveau précédent doit être validé
                </p>
            </div>
        </article>
    );
}