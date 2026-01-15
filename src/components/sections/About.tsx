import aboutImg from '../../assets/images/image1.jpg';

export default function About() {
    return (
        <section id="about" className="py-16 md:py-24 bg-white text-rhum-green px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

                {/* --- PARTIE IMAGE : Mobile responsive --- */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative z-10 rounded-sm overflow-hidden shadow-xl md:shadow-2xl">
                        <img
                            src={aboutImg}
                            alt="L'équipe de l'Atelier de la Route du Rhum en pleine création"
                            className="w-full h-72 sm:h-96 md:h-[500px] object-cover transition-all duration-500"
                            loading="lazy"
                            width={600}
                            height={500}
                        />
                    </div>
                    <div
                        className="absolute -bottom-4 -left-4 w-48 h-48 md:-bottom-6 md:-left-6 md:w-64 md:h-64 bg-rhum-gold/10 -z-0 rounded-sm"
                        aria-hidden="true"
                    />
                </div>

                {/* --- PARTIE TEXTE : Alignement hybride mobile --- */}
                <article className="w-full md:w-1/2">

                    {/* Header : Toujours centré sur mobile selon votre préférence */}
                    <header className="mb-6 md:mb-8 text-center md:text-left">
                        <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-sm mb-3 md:mb-4 font-bold">
                            L'Antre du Druide
                        </h2>
                        <h3 className="text-2xl md:text-5xl font-serif leading-tight text-rhum-green">
                            Une escale sensorielle au cœur de Compiègne
                        </h3>
                    </header>

                    {/* Contenu : Forcé à gauche sur mobile (text-left) */}
                    <div className="space-y-4 md:space-y-6 text-gray-700 font-sans leading-relaxed text-sm md:text-base text-left">
                        <p>
                            Situé au 12 rue des Cordeliers, L'Atelier de la Route du Rhum est né d'une volonté simple :
                            partager l'art des saveurs exotiques dans un cadre historique et convivial.
                        </p>
                        <p>
                            Sous la houlette de <span className="font-bold text-rhum-green">Nabil Ziani</span>,
                            notre établissement hybride combine une cave spécialisée et un espace de création unique.
                        </p>

                        <blockquote className="border-l-4 border-rhum-gold pl-4 md:pl-6 py-2 italic font-serif text-lg md:text-xl text-rhum-green/80 bg-rhum-gold/5 rounded-r-sm my-6 md:my-8">
                            "Chaque bouteille est une invitation au voyage, un mariage subtil entre la puissance du rhum et la douceur des fruits frais."
                        </blockquote>

                        <p>
                            Que ce soit pour un atelier individuel, un comité d'entreprise ou un événement privé,
                            nous mettons tout notre savoir-faire pour vous offrir une parenthèse inoubliable.
                        </p>
                    </div>

                    <footer className="mt-8 md:mt-10 text-center md:text-left">
                        <a
                            href="#workshops"
                            className="inline-block text-rhum-green font-bold border-b-2 border-rhum-gold pb-1 hover:text-rhum-gold hover:border-rhum-green transition-all duration-300 no-underline text-sm md:text-base uppercase tracking-wider"
                        >
                            En savoir plus sur nos ateliers
                        </a>
                    </footer>
                </article>

            </div>
        </section>
    );
}