import { useContactForm } from '../../hooks/useContact';

export default function Contact() {
    const { state, formAction, isPending } = useContactForm();

    return (
        <section id="contact" className="py-16 md:py-24 bg-rhum-cream text-rhum-green px-4 md:px-6">
            <div className="max-w-6xl mx-auto">

                <header className="text-center mb-10 md:mb-16">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-[10px] md:text-sm mb-3 md:mb-4 font-bold">
                        Une Question ?
                    </h2>
                    <h3 className="text-2xl md:text-5xl font-serif">Contactez-nous</h3>
                </header>

                {/* items-stretch force les deux colonnes à avoir la même hauteur */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-stretch">

                    {/* --- COLONNE GAUCHE : FORMULAIRE --- */}
                    <div className="bg-white p-6 md:p-12 shadow-xl rounded-sm border border-gray-100 flex flex-col">

                        {/* Le formulaire occupe toute la hauteur pour permettre l'alignement */}
                        <form action={formAction} className="flex flex-col h-full">

                            {/* flex-grow consomme tout l'espace disponible et pousse le bouton en bas */}
                            <div className="flex-grow space-y-5 md:space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                                    <div className="space-y-1">
                                        <label htmlFor="nom" className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">Nom</label>
                                        <input
                                            id="nom"
                                            name="nom"
                                            type="text"
                                            required
                                            className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label htmlFor="email" className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="sujet" className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">Sujet</label>
                                    <select
                                        id="sujet"
                                        name="sujet"
                                        className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent"
                                    >
                                        <option>Réservation Atelier</option>
                                        <option>Privatisation Entreprise</option>
                                        <option>Demande d'information</option>
                                        <option>Autre</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="message" className="block text-[10px] md:text-xs uppercase tracking-widest font-bold">Message</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        required
                                        className="w-full border-b border-gray-300 py-2 focus:border-rhum-gold outline-none transition-colors bg-transparent resize-none"
                                        placeholder="Comment pouvons-nous vous aider ?"
                                    />
                                </div>
                            </div>

                            {/* Bloc de validation et bouton ancré en bas */}
                            <div className="mt-8">
                                {state?.success && (
                                    <p className="text-green-600 text-xs font-bold uppercase tracking-wider text-center mb-4 animate-fadeIn">
                                        {state.message}
                                    </p>
                                )}
                                <button
                                    disabled={isPending}
                                    className="w-full bg-rhum-green text-white py-4 uppercase tracking-[0.2em] font-bold text-xs md:text-sm hover:bg-rhum-gold hover:text-rhum-green transition-all duration-300 shadow-md disabled:opacity-50"
                                >
                                    {isPending ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- COLONNE DROITE : INFOS & CARTE --- */}
                    <div className="flex flex-col justify-between">
                        <address className="not-italic space-y-8 md:space-y-12">
                            <div>
                                <h4 className="font-serif text-xl md:text-2xl mb-4 md:mb-6 italic text-rhum-gold">L'Atelier de la Route du Rhum</h4>
                                <div className="space-y-3 md:space-y-4 font-sans opacity-80 text-sm">
                                    <p className="flex items-start gap-4">
                                        <span aria-hidden="true">📍</span>
                                        12 rue des Cordeliers, 60200 Compiègne
                                    </p>
                                    <p className="flex items-center gap-4">
                                        <span aria-hidden="true">📞</span>
                                        <a href="tel:+33641420028" className="hover:text-rhum-gold transition-colors">06 41 42 00 28</a>
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-serif text-lg md:text-xl mb-4 md:mb-6">Horaires de la Cave</h4>
                                <ul className="space-y-2 text-xs md:text-sm opacity-80">
                                    <li className="flex justify-between border-b border-rhum-gold/10 pb-2">
                                        <span>Mardi au Samedi</span>
                                        <time className="font-bold">10h00 – 19h30</time>
                                    </li>
                                    <li className="flex justify-between opacity-40">
                                        <span>Lundi & Dimanche</span>
                                        <span>Fermé</span>
                                    </li>
                                </ul>
                            </div>
                        </address>

                        <div className="mt-10 md:mt-12 h-48 md:h-64 bg-gray-100 rounded-sm grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden relative border border-gray-100 shadow-inner">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2595.6164412276808!2d2.822981877684047!3d49.416158771413116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e7d73eb355563f%3A0xbe537fe688f1e389!2sAtelier%20de%20la%20Route%20du%20Rhum!5e0!3m2!1sfr!2sfr!4v1768493474694!5m2!1sfr!2sfr"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Localisation de l'Atelier"
                                className="absolute inset-0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}