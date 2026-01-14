import React from 'react';
import aboutImg from '../assets/images/image1.jpg';
import menuImg from "../assets/images/Menu.webp";

const About: React.FC = () => {
    return (
        <section className="py-24 bg-white text-rhum-green px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

                {/* Partie Image : L'ambiance de l'atelier */}
                <div className="w-full md:w-1/2 relative">
                    <div className="relative z-10 rounded-sm overflow-hidden shadow-2xl">
                        <img
                            src={aboutImg}
                            alt="Photo de l equipe de l'Atelier de la Route du Rhum"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    {/* Élément décoratif asymétrique */}
                    <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-rhum-gold/10 -z-0"></div>
                </div>

                {/* Partie Texte : L'histoire */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-sm mb-4">
                        L'Antre du Druide
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                        Une escale sensorielle au cœur de Compiègne
                    </h3>

                    <div className="space-y-6 text-gray-700 font-sans leading-relaxed">
                        <p>
                            Situé au 12 rue des Cordeliers, L'Atelier de la Route du Rhum est né d'une volonté simple : partager l'art des saveurs exotiques dans un cadre historique et convivial.
                        </p>
                        <p>
                            Sous la houlette de Nabil Ziani, notre établissement hybride combine une cave spécialisée et un espace de création unique. Ici, nous ne nous contentons pas de vendre du rhum ; nous vous invitons à devenir l'acteur de vos propres découvertes gustatives.
                        </p>
                        <blockquote className="border-l-4 border-rhum-gold pl-6 py-2 italic font-serif text-xl text-rhum-green/80">
                            "Chaque bouteille est une invitation au voyage, un mariage subtil entre la puissance du rhum et la douceur des fruits frais."
                        </blockquote>
                        <p>
                            Que ce soit pour un atelier individuel, un comité d'entreprise ou un événement privé, nous mettons tout notre savoir-faire pour vous offrir une parenthèse inoubliable de partage et de créativité.
                        </p>
                    </div>

                    <div className="mt-10">
                        {/* Lien de redirection vers la section #workshops */}
                        <a
                            href="#workshops"
                            className="inline-block text-rhum-green font-bold border-b-2 border-rhum-gold pb-1 hover:text-rhum-gold transition-colors duration-300 no-underline"
                        >
                            En savoir plus sur nos ateliers
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;