import { motion } from 'framer-motion';

/**
 * 🏺 REGISTRE DES MENTIONS LÉGALES
 * Certification de l'identité institutionnelle de l'Établissement.
 */
export default function LegalMentions() {
    return (
        <div className="min-h-screen bg-[#0a1a14] text-white font-sans selection:bg-rhum-gold selection:text-black overflow-x-hidden">

            {/* --- 🏺 HEADER IMMERSIF (Style Passeport) --- */}
            <header className="relative pt-48 pb-20 md:pt-64 md:pb-32 border-b border-white/5 overflow-hidden">
                {/* Image de fond scellée */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop"
                        alt="Background Mentions"
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
                        className="text-5xl md:text-8xl font-serif uppercase tracking-tighter leading-none"
                    >
                        Mentions Légales
                    </motion.h1>
                    <div className="mt-6 flex items-center justify-center gap-4"></div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20 md:py-32 relative z-10">
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
                                <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-3 font-bold">Nom de l'Établissement</p>
                                <p className="text-xl md:text-3xl font-serif text-white uppercase tracking-wide">L'Établissement de la Route du Rhum</p>
                            </div>
                            <div>
                                <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-3 font-bold">Forme Juridique</p>
                                <p className="text-lg font-medium text-white/90">Société au Capital Social de 1 000 €</p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/10" />

                    {/* Section 2 : Direction */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-rhum-gold text-[11px] uppercase tracking-[0.3em] font-black sticky top-32">
                                Direction
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-8">
                            <div>
                                <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-3 font-bold">Responsable de Publication</p>
                                <p className="text-xl md:text-2xl font-serif text-white uppercase tracking-wider">Nabil ZIANI</p>
                            </div>
                            <div>
                                <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-3 font-bold">Siège Social</p>
                                <p className="text-lg font-medium leading-relaxed text-white/90 uppercase tracking-wide">
                                    12 RUE DES CORDELIERS<br />
                                    60200 COMPIÈGNE<br />
                                    FRANCE
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-white/10" />

                    {/* Section 3 : Contact & Registre Technique */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-1">
                            <h2 className="text-rhum-gold text-[11px] uppercase tracking-[0.3em] font-black sticky top-32">
                                Registre Technique
                            </h2>
                        </div>
                        <div className="md:col-span-2 space-y-12">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                <div>
                                    <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-4 font-bold">Ligne Directe</p>
                                    <a href="mailto:69znabil@gmail.com" className="text-white hover:text-rhum-gold transition-all block text-xl font-medium border-b border-white/10 pb-2">
                                        69znabil@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-4 font-bold">Standard</p>
                                    <a href="tel:+33641420028" className="text-white hover:text-rhum-gold transition-all block text-xl font-medium border-b border-white/10 pb-2">
                                        +33 6 41 42 00 28
                                    </a>
                                </div>
                            </div>

                            <div className="p-8 md:p-12 bg-white/[0.03] border border-white/10 rounded-sm space-y-8 shadow-2xl">
                                <div>
                                    <p className="text-rhum-gold text-[10px] uppercase tracking-widest mb-3 font-bold">Inscription au Registre</p>
                                    <p className="text-2xl font-serif text-white uppercase tracking-widest">Registre des Sociétés</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/10">
                                    <div>
                                        <p className="text-white/60 text-[9px] uppercase tracking-widest mb-2 font-bold">Numéro d'enregistrement (SIRET)</p>
                                        <p className="text-lg font-black tracking-[0.2em] text-rhum-gold">92148938100019</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-[9px] uppercase tracking-widest mb-2 font-bold">Numéro Fiscal TVA</p>
                                        <p className="text-lg font-black tracking-[0.2em] text-rhum-gold">92148938100019</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Pied de page de certification */}
            <footer className="py-20 border-t border-white/10 bg-black/40">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black">
                        © 2026 L'Atelier de la Route du Rhum
                    </p>
                </div>
            </footer>
        </div>
    );
}