import { WORKSHOP_DETAILS, type WorkshopDetail } from '../../../data/workshops';

interface ConceptionCardProps {
    onOpenDetail: (detail: WorkshopDetail) => void;
}

export default function ConceptionCard({ onOpenDetail }: ConceptionCardProps) {
    return (
        <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-10 h-full justify-between">
            <div>
                <header className="flex justify-between items-baseline mb-6 md:mb-12">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">
                        L'Atelier Conception
                    </h4>
                    <span className="text-rhum-gold font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">
                        Par Étapes
                    </span>
                </header>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 md:mb-14 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                    <span>📜 Valable 6 mois après achat</span>
                </div>

                {/* CONTENEUR DE LISTE AVEC FIL D'ARIANE */}
                <div className="relative">
                    {/* Ligne verticale décorative */}
                    <div className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-rhum-gold/0 via-rhum-gold/20 to-rhum-gold/0" />

                    <ul className="space-y-4 md:space-y-6 relative z-10">
                        {Object.entries(WORKSHOP_DETAILS).map(([key, item], index) => (
                            <li
                                key={key}
                                // On définit la couleur de hover ici
                                className="flex justify-between items-center group gap-4 px-3 py-3 md:py-4 -mx-3 rounded-sm hover:bg-white/[0.03] transition-all duration-300"
                            >
                                <div className="flex items-center gap-4 md:gap-7 min-w-0">
                                    {/* NUMÉRO CIRCULAIRE HARMONISÉ */}
                                    <div className="relative flex items-center justify-center shrink-0">
                                        {/* Le cercle du numéro qui masque la ligne verticale */}
                                        <div className={`
                                            w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center z-10 
                                            transition-colors duration-300 border border-transparent
                                            bg-[#081c15] group-hover:bg-[#0f231c] group-hover:border-rhum-gold/30
                                        `}>
                                            <span className="text-rhum-gold font-black text-base md:text-xl transition-all duration-300 group-hover:text-white group-hover:scale-110">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="text-rhum-cream text-base md:text-lg italic truncate font-medium group-hover:text-white transition-colors duration-300">
                                        {item.title.split(': ')[1]}
                                    </span>
                                </div>

                                <button
                                    onClick={() => onOpenDetail(item)}
                                    className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold border border-rhum-gold/30 px-4 md:px-6 py-2.5 hover:bg-rhum-gold hover:text-rhum-green transition-all shrink-0 rounded-sm bg-[#081c15] group-hover:border-rhum-gold/80"
                                >
                                    Détails
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-12 md:mt-16 bg-rhum-gold/10 p-5 md:p-6 border border-rhum-gold/30 rounded-sm">
                <p className="text-[9px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                    Progression obligatoire : le niveau précédent doit être validé
                </p>
            </div>
        </article>
    );
}