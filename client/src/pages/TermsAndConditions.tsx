/**
 * 🏺 REGISTRE DES CONDITIONS GÉNÉRALES DE VENTE (CGV)
 * Protocole régissant les échanges entre l'Établissement et ses Membres.
 */
export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-[#0a1a14] text-white font-sans selection:bg-rhum-gold selection:text-black">

            {/* Header Institutionnel */}
            <header className="relative py-24 border-b border-rhum-gold/10 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter">Conditions Générales de Vente</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto space-y-16 text-rhum-cream/80 leading-relaxed font-light text-sm md:text-base">

                    {/* Art 1 : Objet */}
                    <section className="space-y-4">
                        <h2 className="text-rhum-gold font-serif text-2xl uppercase">Article 1 — Objet</h2>
                        <p>
                            Les présentes conditions régissent la vente de bouteilles et de prestations de services (Ateliers, Locations) par l'Établissement Atelier de la Route du Rhum via sa plateforme numérique.
                        </p>
                    </section>

                    {/* Art 2 : Les Séances de Conception (Workshops) */}
                    <section className="space-y-6">
                        <h2 className="text-rhum-gold font-serif text-2xl uppercase">Article 2 — L'Atelier Conception</h2>
                        <div className="space-y-4">
                            <p><strong>2.1. Niveaux et Progression :</strong> L'accès aux niveaux 1 à 4 est strictement conditionné par la validation du niveau précédent au sein de l'Établissement.</p>
                            <p><strong>2.2. Validité :</strong> Tout atelier acquis est valable pour une durée de 30 jours (Atelier Découverte) et 6 mois (Atelier Conception) à compter de la date d'achat de la commande. Passé ce délai, l'accès à l'atelier est révoqué sans remboursement.</p>
                            <p><strong>2.3. Identification :</strong> L'identification par Code Client est impérative pour les niveaux 1 à 4 de l'Atelier Conception afin de certifier l'identité et la progression du participant.</p>
                        </div>
                    </section>

                    {/* Art 3 : Location de Dame-Jeanne */}
                    <section className="space-y-6 bg-white/[0.02] p-8 border-l border-rhum-gold/30">
                        <h2 className="text-rhum-gold font-serif text-2xl uppercase">Article 3 — Location de Matériel</h2>
                        <p>
                            La location de Dame-Jeanne est soumise à un protocole de garantie strict :
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Une caution de 50 € est exigée par unité lors de la mise à disposition.</li>
                            <li>La restitution doit être effectuée sous 3 jours après l'événement.</li>
                            <li>En cas de retard ou de dégradation, le dépôt de garantie est définitivement conservé par l'Établissement.</li>
                        </ul>
                    </section>

                    {/* Art 4 : Investissement et Paiement */}
                    <section className="space-y-6">
                        <h2 className="text-rhum-gold font-serif text-2xl uppercase">Article 4 — Investissement et Paiement</h2>
                        <p>
                            Les tarifs sont exprimés en Euros (€) toutes taxes comprises. L'Établissement distingue deux structures tarifaires :
                        </p>
                        <table className="w-full border-collapse border border-white/10 text-[11px] uppercase tracking-widest">
                            <thead>
                            <tr className="bg-white/5">
                                <th className="p-4 border border-white/10 text-left">Profil</th>
                                <th className="p-4 border border-white/10 text-left">Application</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="p-4 border border-white/10">Standard (USER)</td>
                                <td className="p-4 border border-white/10">Tarif public en vigueur</td>
                            </tr>
                            <tr>
                                <td className="p-4 border border-white/10">Partenaire (PRO/CE)</td>
                                <td className="p-4 border border-white/10">Tarif entreprise</td>
                            </tr>
                            </tbody>
                        </table>
                        <p>Le règlement s'effectue via la passerelle sécurisée Stripe. Le scellage de la commande est immédiat dès confirmation du paiement.</p>
                    </section>

                    {/* Art 5 : Rétractation */}
                    <section className="space-y-4">
                        <h2 className="text-rhum-gold font-serif text-2xl uppercase">Article 5 — Droit de Rétractation</h2>
                        <p>
                            Conformément à la loi, les produits personnalisés ou les prestations de services datées (Ateliers) ne sont pas soumis au droit de rétractation dès lors que l'exécution a commencé ou que la date est réservée.
                        </p>
                    </section>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] mb-4">
                    Document édité le 12 Mars 2026 — Atelier de la Route du Rhum
                </p>
                <button
                    onClick={() => window.print()}
                    className="text-rhum-gold hover:text-white text-[10px] uppercase tracking-widest font-black underline underline-offset-4 cursor-pointer"
                >
                    Imprimer le protocole
                </button>
            </footer>
        </div>
    );
}