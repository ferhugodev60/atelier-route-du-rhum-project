import React from 'react';

// Interface pour typer un témoignage
interface Testimonial {
    id: number;
    author: string;
    rating: number;
    text: string;
    date: string;
}

// Données basées sur l'expérience client certifiée de l'établissement
const REVIEWS: Testimonial[] = [
    {
        id: 1,
        author: "Alexane B.",
        rating: 5,
        text: "Un très bon moment de découverte ! Atelier decouverte animé par Nabil, un passionné qui nous fait découvrir et comprendre les bases du rhum arrangé avec beaucoup de pédagogie. Nous avons participé à différentes dégustations, à la fois savoureuses et surprenantes. Le tout dans une ambiance simple et sympathique. Je recommande sans hésiter.",
        date: "Septembre 2025"
    },
    {
        id: 2,
        author: "Nicolas B.",
        rating: 5,
        text: "Nous avons passé un agréable moment d’échange et d’apprentissage autour du rhum arrangé. Expérience très enrichissante accompagné du maître en la matière Nabil qui a su nous amener sur la découverte des saveurs et bienfaits de ce breuvage oh combien complexe ! Vivement le niveaux 2 😉",
        date: "Janvier 2026"
    },
    {
        id: 3,
        author: "Maxime K.",
        rating: 5,
        text: "Atelier très enrichissant et patron super agréable. Nabil est un vrai passionné, et ça se ressent. Superbe après-midi passée.",
        date: "Septembre 2025"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section id="testimonials" className="py-16 md:py-24 bg-rhum-green text-rhum-cream px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                {/* En-tête de section réduit sur mobile */}
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-sm mb-3 md:mb-4">
                        Avis Clients
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-serif">Ils ont goûté à la magie du Druide</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {REVIEWS.map((review) => (
                        <div key={review.id} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between">
                            <div>
                                {/* Taille des étoiles ajustée */}
                                <div className="flex text-rhum-gold mb-4 md:mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="text-lg md:text-xl">★</span>
                                    ))}
                                </div>
                                {/* Texte réduit de text-lg à text-base sur mobile */}
                                <p className="italic font-serif text-base md:text-lg leading-relaxed opacity-90 mb-6 md:mb-8">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-white/10">
                                <span className="font-bold text-rhum-gold text-xs md:text-sm">{review.author}</span>
                                <span className="text-[9px] md:text-[10px] uppercase opacity-50 tracking-widest">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Note globale plus discrète sur mobile */}
                <div className="mt-12 md:mt-16 text-center">
                    <p className="text-[11px] md:text-sm opacity-60 font-sans tracking-wide">
                        Note moyenne de 4.9/5 basée sur les avis Google.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;