import { REVIEWS } from '../../data/testimonials.ts';

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-16 md:py-24 bg-rhum-green text-rhum-cream px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                {/* En-tête sémantique */}
                <header className="text-center mb-10 md:mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-sm mb-3 md:mb-4 font-bold">
                        Avis Clients
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-serif">
                        Ils ont goûté à la magie du Druide
                    </h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {REVIEWS.map((review) => (
                        <article
                            key={review.id}
                            className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-sm flex flex-col justify-between h-full" // Ajout de h-full pour s'assurer que l'article prend toute la hauteur de la grille
                        >
                            <figure className="m-0 flex flex-col h-full"> {/* Figure devient aussi une flex column qui prend toute la hauteur */}

                                <div className="flex-grow">
                                    <div
                                        className="flex text-rhum-gold mb-4 md:mb-6"
                                        role="img"
                                        aria-label={`Note de ${review.rating} sur 5 étoiles`}
                                    >
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-lg md:text-xl" aria-hidden="true">★</span>
                                        ))}
                                    </div>

                                    <blockquote className="m-0 italic font-serif text-base md:text-lg leading-relaxed opacity-90 mb-6 md:mb-8">
                                        "{review.text}"
                                    </blockquote>
                                </div>
                                {/* --- FIN DE LA MODIFICATION --- */}

                                <footer className="flex justify-between items-center pt-4 md:pt-6 border-t border-white/10 mt-auto"> {/* mt-auto est une sécurité supplémentaire */}
                                    <cite className="not-italic font-bold text-rhum-gold text-xs md:text-sm">
                                        {review.author}
                                    </cite>
                                    <time
                                        dateTime={review.date}
                                        className="text-[9px] md:text-[10px] uppercase opacity-50 tracking-widest"
                                    >
                                        {review.date}
                                    </time>
                                </footer>
                            </figure>
                        </article>
                    ))}
                </div>

                {/* Note globale discrète */}
                <footer className="mt-12 md:mt-16 text-center">
                    <p className="text-[11px] md:text-sm opacity-60 font-sans tracking-wide">
                        Note moyenne de 4.9/5 basée sur les avis Google certifiés.
                    </p>
                </footer>
            </div>
        </section>
    );
}