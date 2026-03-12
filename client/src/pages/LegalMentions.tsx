import { motion } from 'framer-motion';

/**
 * 🏺 REGISTRE DES MENTIONS LÉGALES
 * Certification de l'identité institutionnelle de l'Établissement.
 */
export default function LegalMentions() {
    return (
        <div className="min-h-screen bg-[#0a1a14] text-white font-sans selection:bg-rhum-gold selection:text-black">
            {/* Header d'envergure */}
            <header className="relative py-24 md:py-32 border-b border-rhum-gold/10 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif uppercase tracking-tighter"
                    >
                        Mentions Légales
                    </motion.h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20 md:py-32">
                <div className="max-w-4xl mx-auto space-y-24">

                    {/* Section 1 : Identification */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-rhum-gold text-[11px] uppercase tracking-[0.3em] font-black sticky top-32">
                                Identification
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Nom de l'Établissement</p>
                                <p className="text-xl md:text-2xl font-serif text-white uppercase">Atelier de la Route du Rhum</p>
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Forme Juridique</p>
                                <p className="text-lg font-light">Atelier de la Route du Rhum — Capital Social : 1 000 €</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5" />

                    {/* Section 2 : Direction */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-rhum-gold text-[11px] uppercase tracking-[0.3em] font-black sticky top-32">
                                Direction
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Responsable</p>
                                <p className="text-xl md:text-2xl font-serif text-white uppercase">Nabil ZIANI</p>
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Siège Social</p>
                                <p className="text-lg font-light leading-relaxed">
                                    12 RUE DES CORDELIERS<br />
                                    60200 COMPIEGNE<br />
                                    FRANCE
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/5" />

                    {/* Section 3 : Contact & Registre */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-rhum-gold text-[11px] uppercase tracking-[0.3em] font-black sticky top-32">
                                Registre Technique
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Adresse e-mail</p>
                                    <a href="mailto:69znabil@gmail.com" className="text-rhum-gold hover:text-white transition-colors cursor-pointer block text-lg font-light">
                                        69znabil@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Numéro de téléphone</p>
                                    <a href="tel:+33641420028" className="text-rhum-gold hover:text-white transition-colors cursor-pointer block text-lg font-light">
                                        +33 6 41 42 00 28
                                    </a>
                                </div>
                            </div>
                            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm space-y-6">
                                <div>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Inscription au Registre</p>
                                    <p className="text-white font-serif uppercase tracking-wider">Registre des Sociétés</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest mb-1">Numéro d'enregistrement</p>
                                        <p className="text-sm font-black tracking-widest text-rhum-gold">92148938100019</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest mb-1">Numéro fiscal local</p>
                                        <p className="text-sm font-black tracking-widest text-rhum-gold">92148938100019</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Pied de page de certification */}
            <footer className="py-20 border-t border-white/5 bg-black/20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white/20 text-[9px] uppercase tracking-[0.4em]">
                        © 2026 Atelier de la Route du Rhum
                    </p>
                </div>
            </footer>
        </div>
    );
}