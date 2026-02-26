import { Workshop } from "../../../types/workshop.ts";
import { useAuthStore } from "../../../store/authStore";
import { Check, Lock } from "lucide-react";

interface ConceptionCardProps {
    workshops: Workshop[];
    onOpenDetail: (detail: Workshop) => void;
}

export default function ConceptionCard({ workshops, onOpenDetail }: ConceptionCardProps) {
    const { user } = useAuthStore();
    const currentLevel = user?.conceptionLevel ?? 0;

    return (
        <article className="flex flex-col bg-[#081c15] rounded-sm border border-rhum-gold/40 shadow-2xl p-6 md:p-10 h-full justify-between font-sans">
            <div>
                <header className="flex flex-col items-center mb-6 md:mb-12 text-center">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight uppercase tracking-tight">
                        L'Atelier Conception
                    </h4>
                    <span className="text-rhum-gold font-sans text-[9px] uppercase tracking-widest font-black opacity-60 mt-2">
                        En 4 niveaux
                    </span>
                </header>

                <div className="relative">
                    <ul className="space-y-4 md:space-y-6 relative z-10">
                        {workshops.map((item) => {
                            const isMastered = item.level <= currentLevel;
                            const isLocked = item.level > currentLevel + 1;

                            return (
                                <li key={item.id} className="flex justify-between items-center group gap-4 px-3 py-3 md:py-4 -mx-3 rounded-sm transition-all duration-300 hover:bg-white/[0.03]">
                                    <div className="flex items-center gap-4 md:gap-7 min-w-0">
                                        <div
                                            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border border-rhum-gold/20 flex-shrink-0"
                                            style={{ backgroundColor: isMastered ? '#c4a468' : (isLocked ? 'transparent' : `${item.color}30`) }}
                                        >
                                            {isMastered ? (
                                                <Check size={16} className="text-rhum-green" />
                                            ) : isLocked ? (
                                                <Lock size={14} className="text-rhum-gold/30" />
                                            ) : (
                                                <span className="text-rhum-gold font-black text-base md:text-xl">{item.level}</span>
                                            )}
                                        </div>
                                        <span className={`text-rhum-cream text-base md:text-lg truncate font-medium transition-colors ${!isLocked ? 'group-hover:text-white' : 'opacity-80'}`}>
                                            {item.title.replace("(Séminaire)", "").trim()}
                                        </span>
                                    </div>

                                    <button
                                        disabled={isLocked}
                                        onClick={() => !isLocked && onOpenDetail(item)}
                                        className={`text-[8px] md:text-[9px] uppercase tracking-widest px-4 md:px-6 py-2.5 transition-all rounded-sm font-black border
                                            ${isLocked
                                            ? 'text-rhum-gold/20 border-white/5 cursor-not-allowed'
                                            : 'text-rhum-gold border-rhum-gold/30 hover:bg-rhum-gold hover:text-rhum-green cursor-pointer'
                                        }`}
                                    >
                                        {isLocked ? 'Verrouillé' : 'Détails'}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <div className="mt-12 bg-rhum-gold/10 p-5 border border-rhum-gold/30 rounded-sm">
                <p className="text-[9px] text-rhum-gold font-black uppercase tracking-[0.2em] leading-relaxed text-center">
                    Validation obligatoire du niveau précédent pour progresser
                </p>
            </div>
        </article>
    );
}