import { motion } from 'framer-motion';

/**
 * 🏺 REGISTRE DES CONDITIONS GÉNÉRALES DE VENTE (CGV)
 * Protocole régissant les échanges entre l'Établissement et ses Membres.
 */
export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-[#0a1a14] text-white font-sans selection:bg-rhum-gold selection:text-black overflow-x-hidden">

            {/* --- 🏺 HEADER IMMERSIF (Style Prestige) --- */}
            <header className="relative pt-48 pb-20 md:pt-64 md:pb-32 border-b border-white/5 overflow-hidden">
                {/* Image de fond scellée */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Background CGV"
                        className="w-full h-full object-cover opacity-40 md:opacity-30"
                    />
                    {/* Dégradé de liaison vers le contenu */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1a14]/60 to-[#0a1a14] z-20" />
                </div>

                <div className="container mx-auto px-6 relative z-30 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-serif uppercase tracking-tighter leading-none"
                    >
                        Conditions Générales de Vente
                    </motion.h1>
                    <div className="mt-6 flex items-center justify-center gap-4"></div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20 md:py-32 relative z-10">
                {/* 🏺 Contraste augmenté : text-rhum-cream sans opacité restrictive */}
                <div className="max-w-4xl mx-auto space-y-20 text-rhum-cream leading-relaxed font-light text-sm md:text-base">

                    {/* Art 1 : Objet */}
                    <section className="space-y-4">
                        <h2 className="text-rhum-gold font-serif text-2xl md:text-3xl uppercase tracking-tight">Article 1 — Objet</h2>
                        <p>
                            Les présentes conditions régissent la vente de bouteilles et de prestations de services (Ateliers, Locations) par l'Établissement Atelier de la Route du Rhum via sa plateforme numérique.
                        </p>
                    </section>

                    <hr className="border-white/10" />

                    {/* Art 2 : Les Séances de Conception (Workshops) */}
                    <section className="space-y-8">
                        <h2 className="text-rhum-gold font-serif text-2xl md:text-3xl uppercase tracking-tight">Article 2 — L'Atelier Conception</h2>
                        <div className="space-y-6">
                            <div className="border-l border-rhum-gold/20 pl-6">
                                <p className="mb-4"><strong className="text-white font-black uppercase text-[11px] tracking-widest">2.1. Niveaux et Progression :</strong> L'accès aux niveaux 1 à 4 est strictement conditionné par la validation du niveau précédent au sein de l'Établissement.</p>
                                <p className="mb-4"><strong className="text-white font-black uppercase text-[11px] tracking-widest">2.2. Validité :</strong> Tout atelier acquis est valable pour une durée de 30 jours (Atelier Découverte) et 6 mois (Atelier Conception) à compter de la date d'achat de la commande. Passé ce délai, l'accès à l'atelier est révoqué sans remboursement.</p>
                                <p><strong className="text-white font-black uppercase text-[11px] tracking-widest">2.3. Identification :</strong> L'identification par Code Client est impérative pour les niveaux 1 à 4 de l'Atelier Conception afin de certifier l'identité et la progression du participant.</p>
                            </div>
                        </div>
                    </section>

                    {/* Art 3 : Location de Dame-Jeanne */}
                    <section className="space-y-6 bg-white/[0.03] p-8 md:p-12 border border-white/10 border-l-rhum-gold border-l-4 shadow-2xl">
                        <h2 className="text-rhum-gold font-serif text-2xl md:text-3xl uppercase tracking-tight">Article 3 — Location de Matériel</h2>
                        <p className="text-white font-medium">
                            La location de Dame-Jeanne est soumise à un protocole de garantie strict :
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Une caution de 50 € est exigée par unité lors de la mise à disposition.",
                                "La restitution doit être effectuée sous 3 jours après l'événement.",
                                "En cas de retard ou de dégradation, le dépôt de garantie est définitivement conservé par l'Établissement."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="text-rhum-gold font-black">•</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Art 4 : Investissement et Paiement */}
                    <section className="space-y-8">
                        <h2 className="text-rhum-gold font-serif text-2xl md:text-3xl uppercase tracking-tight">Article 4 — Investissement et Paiement</h2>
                        <p>
                            Les tarifs sont exprimés en Euros (€) toutes taxes comprises. L'Établissement distingue deux structures tarifaires :
                        </p>
                        <div className="overflow-hidden border border-white/10 rounded-sm">
                            <table className="w-full border-collapse text-[10px] md:text-[11px] uppercase tracking-widest">
                                <thead>
                                <tr className="bg-white/5 text-rhum-gold font-black">
                                    <th className="p-5 border-b border-white/10 text-left">Profil</th>
                                    <th className="p-5 border-b border-white/10 text-left">Application</th>
                                </tr>
                                </thead>
                                <tbody className="text-white/80">
                                <tr className="border-b border-white/5">
                                    <td className="p-5">Standard (USER)</td>
                                    <td className="p-5">Tarif public en vigueur</td>
                                </tr>
                                <tr>
                                    <td className="p-5">Partenaire (PRO/CE)</td>
                                    <td className="p-5">Tarif entreprise</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="pt-4 border-t border-white/5 italic">Le règlement s'effectue via la passerelle sécurisée Stripe. Le scellage de la commande est immédiat dès confirmation du paiement.</p>
                    </section>

                    {/* Art 5 : Rétractation */}
                    <section className="space-y-4">
                        <h2 className="text-rhum-gold font-serif text-2xl md:text-3xl uppercase tracking-tight">Article 5 — Droit de Rétractation</h2>
                        <p>
                            Conformément à la loi, les produits personnalisés ou les prestations de services datées (Ateliers) ne sont pas soumis au droit de rétractation dès lors que l'exécution a commencé ou que la date est réservée.
                        </p>
                    </section>

                </div>
            </main>

            {/* Footer de Certification */}
            <footer className="py-20 border-t border-white/10 bg-black/40 text-center">
                <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-[0.4em] mb-6 font-medium">
                    Document édité le 12 Mars 2026
                </p>
                <button
                    onClick={() => window.print()}
                    className="group inline-flex items-center gap-3 text-rhum-gold hover:text-white transition-all text-[11px] uppercase tracking-widest font-black border border-rhum-gold/20 px-8 py-4 rounded-sm hover:bg-rhum-gold/10 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                    <span>Imprimer le protocole</span>
                </button>
            </footer>
        </div>
    );
}