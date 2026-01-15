import aboutImg from '../../assets/images/image1.jpg';

export default function About() {
    return (
        <section className="py-24 bg-white text-rhum-green px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

                {/* --- PARTIE IMAGE : Performance & A11y --- */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl">
                        <img
                            src={aboutImg}
                            alt="L'équipe de l'Atelier de la Route du Rhum en pleine création"
                            className="w-full h-[500px] object-cover"
                            loading="lazy" // Optimisation : l'image ne se charge que si l'utilisateur scrolle
                            width={600}    // Indiquer les dimensions évite le Layout Shift
                            height={500}
                        />
                    </div>
                    {/* Élément décoratif : masqué pour les lecteurs d'écran */}
                    <div
                        className="absolute -bottom-6 -left-6 w-64 h-64 bg-rhum-gold/10 -z-0"
                        aria-hidden="true"
                    />
                </div>

                {/* --- PARTIE TEXTE : Sémantique SEO --- */}
                <article className="w-full md:w-1/2">
                    <header>
                        <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4 font-bold">
                            L'Antre du Druide
                        </h2>
                        <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight text-rhum-green">
                            Une escale sensorielle au cœur de Compiègne
                        </h3>
                    </header>

                    <div className="space-y-6 text-gray-700 font-sans leading-relaxed">
                        <p>
                            Situé au 12 rue des Cordeliers, L'Atelier de la Route du Rhum est né d'une volonté simple :
                            partager l'art des saveurs exotiques dans un cadre historique et convivial.
                        </p>
                        <p>
                            Sous la houlette de <span className="font-bold text-rhum-green">Nabil Ziani</span>,
                            notre établissement hybride combine une cave spécialisée et un espace de création unique.
                        </p>

                        <blockquote className="border-l-4 border-rhum-gold pl-6 py-2 italic font-serif text-xl text-rhum-green/80 bg-rhum-gold/5">
                            "Chaque bouteille est une invitation au voyage, un mariage subtil entre la puissance du rhum et la douceur des fruits frais."
                        </blockquote>

                        <p>
                            Que ce soit pour un atelier individuel, un comité d'entreprise ou un événement privé,
                            nous mettons tout notre savoir-faire pour vous offrir une parenthèse inoubliable.
                        </p>
                    </div>

                    <footer className="mt-10">
                        <a
                            href="#workshops"
                            className="inline-block text-rhum-green font-bold border-b-2 border-rhum-gold pb-1 hover:text-rhum-gold hover:border-rhum-green transition-all duration-300 no-underline"
                        >
                            En savoir plus sur nos ateliers
                        </a>
                    </footer>
                </article>

            </div>
        </section>
    );
}