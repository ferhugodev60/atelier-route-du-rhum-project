import { Link } from 'react-router-dom';
import { Workshop } from "../../../types/workshop.ts";

interface ConceptionCardProps {
    workshops: Workshop[];
}

export default function ConceptionCard({ workshops }: ConceptionCardProps) {
    // 🏺 On extrait uniquement l'image du premier niveau pour le visuel
    const firstLevel = workshops[0];

    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/40 shadow-2xl h-full font-sans">

            {/* --- ZONE IMAGE --- */}
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={firstLevel?.image}
                    alt="Cursus Conception"
                    className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                />
            </div>

            {/* --- ZONE CONTENU --- */}
            <div className="p-6 md:p-10 flex flex-col flex-grow">

                <header className="mb-6 md:mb-8">
                    <div className="flex flex-col">
                        <h4 className="text-xl md:text-3xl font-serif text-white leading-tight tracking-tight uppercase">
                            L'Atelier Conception
                        </h4>
                        <span className="text-rhum-gold text-[9px] font-black uppercase tracking-[0.2em] mt-1">
                            Parcours en 4 Niveaux
                        </span>
                    </div>
                </header>

                {/* Description Pédagogique */}
                <p className="text-white italic text-base md:text-lg mb-10 leading-relaxed font-serif">
                    "Maîtrisez l'art de l'assemblage à travers un voyage technique scellé en quatre niveaux d'expertise."
                </p>

                <div className="mt-auto">
                    {/* 🏺 Lien vers la page de progression Cursus */}
                    <Link
                        to="/atelier-conception"
                        className="block w-full text-center bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                    >
                        En savoir plus
                    </Link>
                </div>
            </div>
        </article>
    );
}