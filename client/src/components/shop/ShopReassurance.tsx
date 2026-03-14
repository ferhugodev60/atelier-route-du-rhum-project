import { Award, Store, ShieldCheck } from 'lucide-react'; // 🏺 Icônes institutionnelles

export default function ShopReassurance() {
    return (
        <footer className="mt-40 border-t border-rhum-gold/20 pt-24 pb-12 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center mb-24 max-w-6xl mx-auto">

                {/* Savoir-faire */}
                <div className="flex flex-col items-center">
                    <Award className="w-8 h-8 mb-6 text-rhum-gold" strokeWidth={1.5} />
                    <h4 className="text-rhum-gold text-[11px] uppercase tracking-[0.4em] font-black mb-5">
                        Savoir-Faire Français
                    </h4>
                    {/* 🏺 Correction : Texte en Blanc pur pour lisibilité sur Mac/Mobile */}
                    <p className="text-white text-[11px] md:text-xs leading-relaxed px-6 font-medium">
                        Chaque flacon est une création artisanale scellée à la main dans notre <span className="text-rhum-gold">Établissement</span> au cœur de Compiègne.
                    </p>
                </div>

                {/* Retrait - Icône Boutique */}
                <div className="flex flex-col items-center">
                    <Store className="w-8 h-8 mb-6 text-rhum-gold" strokeWidth={1.5} />
                    <h4 className="text-rhum-gold text-[11px] uppercase tracking-[0.4em] font-black mb-5">
                        Retrait à l'Établissement
                    </h4>
                    {/* 🏺 Correction : Suppression du terme "Atelier" */}
                    <p className="text-white text-[11px] md:text-xs leading-relaxed px-6 font-medium">
                        Commandez en ligne et retirez vos bouteilles directement à l'établissement. Expédition postale prochainement disponible.
                    </p>
                </div>

                {/* Sécurité */}
                <div className="flex flex-col items-center">
                    <ShieldCheck className="w-8 h-8 mb-6 text-rhum-gold" strokeWidth={1.5} />
                    <h4 className="text-rhum-gold text-[11px] uppercase tracking-[0.4em] font-black mb-5">
                        Paiement Sécurisé
                    </h4>
                    <p className="text-white text-[11px] md:text-xs leading-relaxed px-6 font-medium">
                        Transactions certifiées par Stripe. Vos références sont immédiatement mises de côté dès la validation du paiement.
                    </p>
                </div>
            </div>

            {/* Mention légale : Visibilité augmentée (60%) mais reste discrète */}
            <p className="text-center text-[10px] text-white/60 uppercase tracking-[0.5em] font-black px-4">
                L'abus d'alcool est dangereux pour la santé — À consommer avec modération
            </p>
        </footer>
    );
}