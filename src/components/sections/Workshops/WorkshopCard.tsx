import { IMG_DISCOVERY } from '../../../data/workshops';

export default function WorkshopCard() {
    return (
        <article className="group flex flex-col bg-[#081c15] rounded-sm overflow-hidden border border-rhum-gold/20 shadow-2xl">
            <div className="relative h-48 md:h-64 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#081c15] via-transparent to-transparent z-10" />
                <img
                    src={IMG_DISCOVERY}
                    alt="Session d'initiation"
                    className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            <div className="p-6 md:p-10 flex flex-col flex-grow">
                <header className="flex justify-between items-center mb-4 md:mb-6">
                    <h4 className="text-xl md:text-3xl font-serif text-rhum-cream leading-tight">L'Atelier Découverte</h4>
                    <span className="text-2xl md:text-4xl font-serif text-rhum-gold">60€</span>
                </header>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 text-[9px] md:text-[10px] uppercase font-bold text-rhum-gold/80 tracking-widest">
                    <span>⏱ 1h30</span>
                    <span>📜 Valable 30 jours après achat</span>
                </div>

                <p className="text-rhum-cream/70 italic text-base md:text-lg mb-8 leading-relaxed">
                    "Une initiation parfaite pour découvrir les bases de l'assemblage sous les conseils du Druide."
                </p>

                {/* --- ZONE D'ACTION ET PAIEMENT SÉCURISÉ --- */}
                <div className="mt-auto space-y-6">
                    <button className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-white transition-all shadow-lg rounded-sm">
                        RÉSERVER DÈS MAINTENANT
                    </button>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-white/30">
                            <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                            </svg>
                            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-medium">
                                Paiement 100% sécurisé via Stripe
                            </span>
                        </div>

                        {/* Logos de paiement minimalistes identiques à la modale */}
                        <div className="flex items-center gap-5 opacity-20 grayscale">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3 md:h-3.5 invert" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-2.5 md:h-3 invert" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 md:h-6 invert" />
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}