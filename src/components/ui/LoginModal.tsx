import { motion, AnimatePresence } from 'framer-motion';
import { useLogin } from '../../hooks/useAuth';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { state, formAction, isPending } = useLogin();

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Overlay avec flou profond */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-rhum-green/95 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Carte Modal Responsive */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-rhum-green border border-rhum-gold/30 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-5 text-rhum-gold hover:text-white transition-colors text-xl"
                            aria-label="Fermer"
                        >
                            ✕
                        </button>

                        <header className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-serif text-white leading-tight">
                                Accéder à l'Antre
                            </h2>
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.3em] mt-3 font-bold">
                                Espace client
                            </p>
                        </header>

                        {/* Formulaire avec Actions React 19 */}
                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] md:text-xs uppercase tracking-[0.2em] text-rhum-gold font-bold">
                                    Identifiant
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-20"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label htmlFor="password" className="block text-[10px] md:text-xs uppercase tracking-[0.2em] text-rhum-gold font-bold">
                                        Mot de passe
                                    </label>
                                    {/* AJOUT : Mot de passe oublié */}
                                    <button
                                        type="button"
                                        className="text-[9px] uppercase tracking-widest text-rhum-gold/50 hover:text-rhum-gold transition-colors underline underline-offset-4"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-20"
                                    placeholder="••••••••"
                                />
                            </div>

                            {state?.error && (
                                <p className="text-red-400 text-[9px] md:text-[10px] uppercase tracking-wider text-center bg-red-400/10 py-2 border border-red-400/20">
                                    {state.error}
                                </p>
                            )}

                            <button
                                disabled={isPending}
                                className="w-full bg-rhum-gold text-rhum-green py-4 md:py-5 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs hover:bg-white disabled:opacity-50 transition-all shadow-xl active:scale-[0.98] rounded-sm"
                            >
                                {isPending ? 'Incision en cours...' : "Entrer dans l'Atelier"}
                            </button>
                        </form>

                        <footer className="mt-10 text-center border-t border-rhum-gold/10 pt-8 space-y-6">
                            <p className="text-[10px] text-rhum-cream/40 uppercase tracking-widest">
                                Pas encore membre ? <a href="#" className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4">Rejoignez la guilde</a>
                            </p>

                            <div className="pt-2">
                                <p className="text-[9px] text-rhum-cream/30 uppercase tracking-[0.2em] leading-relaxed">
                                    Vous êtes administrateur ?
                                    <a href="/admin" className="block mt-2 text-rhum-gold/60 hover:text-rhum-gold transition-colors font-bold border border-rhum-gold/20 py-2 rounded-sm mx-auto max-w-[180px]">
                                        Accéder au back-office
                                    </a>
                                </p>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}