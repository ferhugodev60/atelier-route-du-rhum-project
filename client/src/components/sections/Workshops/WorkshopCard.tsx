import { Link } from 'react-router-dom';
import { Workshop } from "../../../types/workshop.ts";
import { useAuthStore } from "../../../store/authStore";

interface WorkshopCardProps {
    workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
    const { user } = useAuthStore();

    // 🏺 Identification du privilège institutionnel
    const hasAdvantage = user?.isEmployee || user?.role === 'PRO';
    const displayPrice = hasAdvantage ? workshop.priceInstitutional : workshop.price;

    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/40 shadow-2xl h-full font-sans">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
                />
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-grow">
                <header className="flex justify-between items-start mb-6 md:mb-8">
                    <h4 className="text-xl md:text-3xl font-serif text-white leading-tight max-w-[65%] tracking-tight uppercase">
                        {workshop.title}
                    </h4>
                    <div className="flex flex-col items-end text-right">
                        <span className="text-2xl md:text-4xl font-serif text-rhum-gold leading-none">
                            {displayPrice.toFixed(0)} €
                        </span>
                        <span className="text-[10px] md:text-xs text-rhum-gold font-black mt-1 uppercase tracking-widest">
                            / pers.
                        </span>
                    </div>
                </header>

                <p className="text-white italic text-base md:text-lg mb-10 leading-relaxed font-serif">
                    "{workshop.quote || workshop.description}"
                </p>

                <div className="mt-auto">
                    {/* 🏺 Transition vers la page de détails du Cursus */}
                    <Link
                        to={workshop.level === 0 ? '/ateliers/decouverte' : `/ateliers/conception/${workshop.level}`}
                        className="block w-full text-center bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white transition-all shadow-xl rounded-sm"
                    >
                        En Savoir plus
                    </Link>
                </div>
            </div>
        </article>
    );
}