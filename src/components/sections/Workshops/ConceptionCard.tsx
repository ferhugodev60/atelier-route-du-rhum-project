import { WORKSHOP_DETAILS, type WorkshopDetail } from '../../../data/workshops';

interface ConceptionCardProps {
    onOpenDetail: (detail: WorkshopDetail) => void;
}

export default function ConceptionCard({ onOpenDetail }: ConceptionCardProps) {
    return (
        /* Retour à un padding plus raisonnable pour éviter l'effet "vide" */
        <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-10 h-full justify-between">

            <div>
                {/* Header : Taille originale conservée, marge ajustée */}
                <header className="flex justify-between items-baseline mb-6 md:mb-10">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">
                        L'Atelier Conception
                    </h4>
                    <span className="text-rhum-gold font-sans text-[9px] md:text-[10px] uppercase tracking-widest font-bold opacity-60">
                        Par Étapes
                    </span>
                </header>

                {/* Info Validité : Taille originale */}
                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-10 md:mb-14 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                    <span>📜 Valable 6 mois après achat</span>
                </div>

                {/* Liste : On utilise flex-grow pour remplir l'espace central sans forcer de grosses marges */}
                <ul className="space-y-4 md:space-y-6">
                    {Object.entries(WORKSHOP_DETAILS).map(([key, item], index) => (
                        /* py-4 pour donner de la hauteur à la ligne sans toucher au texte */
                        <li key={key} className="flex justify-between items-center border-b border-white/5 py-4 md:py-6 group gap-4 transition-colors hover:border-rhum-gold/20">
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
            </div>

            {/* Footer : Placé tout en bas grâce au flexbox justify-between */}
            <div className="mt-12 md:mt-16 bg-rhum-gold/10 p-5 md:p-6 border border-rhum-gold/30 rounded-sm">
                <p className="text-[9px] md:text-[10px] text-rhum-gold font-bold uppercase tracking-[0.2em] leading-relaxed text-center">
                    Progression obligatoire : le niveau précédent doit être validé
                </p>
            </div>
        </article>
    );
}