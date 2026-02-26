import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="h-screen w-full bg-[#0a1a14] flex flex-col items-center justify-center px-6 text-center font-sans overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rhum-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 space-y-8"
            >
                {/* Numéro d'erreur stylisé */}
                <h1 className="text-9xl font-serif text-rhum-gold/20 leading-none">404</h1>

                <div className="space-y-4">
                    <h2 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tighter">
                        Égaré dans le <span className="text-rhum-gold">Registre</span>
                    </h2>
                    <p className="text-rhum-cream/50 text-xs md:text-sm font-serif max-w-md mx-auto leading-relaxed italic">
                        "Même le Druide sait qu'un mauvais chemin peut mener à une découverte, mais cette page n'existe pas encore."
                    </p>
                </div>

                {/* Bouton de redirection automatique */}
                <div className="pt-6">
                    <Link
                        to="/"
                        className="inline-block px-12 py-4 bg-rhum-gold hover:bg-white text-rhum-green font-black transition-all uppercase tracking-[0.3em] text-[10px] shadow-2xl rounded-sm"
                    >
                        Retourner à l'accueil
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}