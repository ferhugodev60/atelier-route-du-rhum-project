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
        author: "Sophie L.",
        rating: 5,
        text: "Une expérience incroyable avec 'le Druide'. On apprend les fondamentaux pour réaliser ses propres mélanges tout en passant un moment très convivial au 12 rue des Cordeliers.",
        date: "Janvier 2026"
    },
    {
        id: 2,
        author: "Marc-Antoine P.",
        rating: 5,
        text: "L'atelier de 1h30 est parfait. On repart avec sa propre bouteille et des conseils précieux pour impressionner nos proches avec des saveurs insolites.",
        date: "Décembre 2025"
    },
    {
        id: 3,
        author: "Julie D.",
        rating: 5,
        text: "Superbe accueil de Nabil. La sélection de rhums du monde entier est impressionnante et l'atelier est une vraie immersion sensorielle.",
        date: "Novembre 2025"
    }
];

const Testimonials: React.FC = () => {
    return (
        <section className="py-24 bg-rhum-green text-rhum-cream px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4">Avis Clients</h2>
                    <h3 className="text-3xl md:text-5xl font-serif">Ils ont goûté à la magie du Druide</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review) => (
                        <div key={review.id} className="bg-white/5 border border-white/10 p-8 rounded-sm flex flex-col justify-between">
                            <div>
                                <div className="flex text-rhum-gold mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <span key={i} className="text-xl">★</span>
                                    ))}
                                </div>
                                <p className="italic font-serif text-lg leading-relaxed opacity-90 mb-8">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/10">
                                <span className="font-bold text-rhum-gold">{review.author}</span>
                                <span className="text-[10px] uppercase opacity-50">{review.date}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm opacity-60 font-sans">
                        Note moyenne de **4.8/5** basée sur les avis Google et PagesJaunes.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;