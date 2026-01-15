import { WORKSHOP_DETAILS, type WorkshopDetail } from '../../../data/workshops';

interface ConceptionCardProps {
    onOpenDetail: (detail: WorkshopDetail) => void;
}

export default function ConceptionCard({ onOpenDetail }: ConceptionCardProps) {
    return (
        <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-12">
            <header className="flex justify-between items-baseline mb-4">
                <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">
                    L'Atelier Conception
                </h4>
                <span className="text-rhum-gold font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">
                    Par Étapes
                </span>
            </header>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                <span>📜 Valable 6 mois après achat</span>
            </div>

            {/* Liste épurée : suppression du prix et de la durée pour plus de clarté */}
            <ul className="space-y-6 flex-grow mb-10">
                {Object.entries(WORKSHOP_DETAILS).map(([key, item], index) => (
                    <li key={key} className="flex justify-between items-center border-b border-white/5 pb-5 group gap-4">
                        <div className="flex items-center gap-3 md:gap-5 min-w-0">
                            <span className="text-rhum-gold font-black text-base md:text-xl opacity-40 flex-shrink-0">
                                {index + 1}.
                            </span>
                            <span className="text-rhum-cream text-base md:text-lg italic truncate font-medium">
                                {item.title.split(': ')[1]}
                            </span>
                        </div>

                        <button
                            onClick={() => onOpenDetail(item)}
                            className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-4 md:px-5 py-2 hover:bg-rhum-gold hover:text-rhum-green transition-all shrink-0"
                        >
                            Détails
                        </button>
                    </li>
                ))}
            </ul>

            <div className="bg-rhum-gold/10 p-5 md:p-6 border border-rhum-gold/30 rounded-sm">
                <p className="text-[9px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                    Progression obligatoire : le niveau précédent doit être validé
                </p>
            </div>
        </article>
    );
}