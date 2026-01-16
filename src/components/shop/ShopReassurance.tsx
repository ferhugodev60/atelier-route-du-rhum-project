export default function ShopReassurance() {
    return (
        <footer className="mt-40 border-t border-rhum-gold/10 pt-20 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center mb-20">

                {/* Savoir-faire */}
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-5">🇫🇷</span>
                    <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Savoir-Faire Français</h4>
                    <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                        Chaque flacon est une création artisanale conçue à la main au cœur de Compiègne.
                    </p>
                </div>

                {/* Retrait - Icône Bouteille SVG */}
                <div className="flex flex-col items-center">
                    <svg className="w-8 h-8 mb-5 text-rhum-gold opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 3h6v3a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V3z" />
                        <path d="M7 11.5a4.5 4.5 0 0 1 4.5-4.5h1a4.5 4.5 0 0 1 4.5 4.5V21H7v-9.5z" />
                        <line x1="7" y1="15" x2="17" y2="15" />
                    </svg>
                    <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Retrait à l'Atelier</h4>
                    <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                        Réservez vos bouteilles en ligne et récupérez-les exclusivement à notre atelier. Pas d'expédition postale.
                    </p>
                </div>

                {/* Sécurité */}
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-5">🔒</span>
                    <h4 className="text-rhum-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4">Paiement Sécurisé</h4>
                    <p className="text-white/40 text-xs font-sans leading-relaxed px-4">
                        Transactions protégées par Stripe. Votre flacon est mis de côté dès validation du paiement.
                    </p>
                </div>
            </div>

            {/* Mention légale obligatoire */}
            <p className="text-center text-[9px] text-white/20 uppercase tracking-[0.4em]">
                L'abus d'alcool est dangereux pour la santé — À consommer avec modération
            </p>
        </footer>
    );
}