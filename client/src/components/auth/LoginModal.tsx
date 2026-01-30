import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // Import du hook de navigation
import { useLogin } from '../../hooks/useAuth.ts';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: { name: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const navigate = useNavigate(); // Initialisation de la navigation
    const { state, isPending } = useLogin();
    const [localError, setLocalError] = useState<string | null>(null);

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Test des identifiants (hugo@atelier.fr / rhum2026)
        if (email === "hugo@atelier.fr" && password === "rhum2026") {
            onLoginSuccess({ name: "Hugo" });
            onClose();
            navigate('/mon-compte'); // REDIRECTION IMMÉDIATE VERS L'ESPACE CLIENT
        } else {
            setLocalError("L'Antre reste scellée. Identifiants incorrects.");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-md"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-5 text-rhum-gold/40 hover:text-white transition-colors text-2xl font-extralight"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-8 md:mb-12">
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">
                                Espace client
                            </p>
                            <h2 className="text-2xl md:text-4xl font-serif text-white leading-tight uppercase tracking-tight">
                                Se connecter
                            </h2>
                        </header>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">
                                    Identifiant
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10"
                                    placeholder="hugo@atelier.fr"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">
                                        Mot de passe
                                    </label>
                                    <button
                                        type="button"
                                        className="text-[9px] uppercase tracking-widest text-rhum-gold/30 hover:text-rhum-gold transition-colors"
                                    >
                                        Oublié ?
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10"
                                    placeholder="••••••••"
                                />
                            </div>

                            {(state?.error || localError) && (
                                <p className="text-red-400 text-[10px] uppercase tracking-wider text-center bg-red-400/5 py-3 border border-red-400/20">
                                    {state?.error || localError}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white disabled:opacity-50 transition-all shadow-xl active:scale-[0.98] rounded-sm"
                            >
                                {isPending ? 'Ouverture des scellés...' : "Entrer dans l'Atelier"}
                            </button>
                        </form>

                        <footer className="mt-10 text-center border-t border-white/5 pt-8 space-y-6">
                            <p className="text-[10px] text-rhum-cream/40 uppercase tracking-widest">
                                Pas encore membre ? <a href="#" className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 decoration-rhum-gold/30">Rejoignez la guilde</a>
                            </p>

                            <div className="pt-2">
                                <p className="text-[9px] text-rhum-cream/30 uppercase tracking-[0.2em] leading-relaxed">
                                    Accès réservé
                                    <a href="/admin" className="block mt-4 text-rhum-gold/40 hover:text-rhum-gold transition-colors font-bold border border-rhum-gold/10 py-3 rounded-sm mx-auto max-w-[200px] hover:bg-white/5">
                                        Console Administrateur
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