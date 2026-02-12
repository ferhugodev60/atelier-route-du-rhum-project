import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function LoginModal() {
    // 🏺 Pilotage via le store global
    const { isLoginOpen, setLoginOpen, setRegisterOpen, setAuth } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await api.post('/auth/login', { email, password });
            // setAuth met à jour l'utilisateur et ferme la modale
            setAuth(response.data.user, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.error || "L'Antre reste scellée. Vérifiez vos accès.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AnimatePresence>
            {isLoginOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-md"
                        onClick={() => setLoginOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button onClick={() => setLoginOpen(false)} className="absolute top-4 right-5 text-rhum-gold/40 hover:text-white text-2xl font-extralight">&times;</button>

                        <header className="text-center mb-8 md:mb-12">
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">Authentification</p>
                            <h2 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tight">Se connecter</h2>
                        </header>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">
                                    Identifiant (Email)
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">
                                        Mot de passe
                                    </label>
                                    {/* 🏺 Retour du bouton Mot de passe oublié */}
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

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-400 text-[10px] uppercase tracking-wider text-center bg-red-400/5 py-3 border border-red-400/20"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button type="submit" disabled={isPending} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm">
                                {isPending ? 'VÉRIFICATION DES SCELLÉS...' : "Entrer dans l'Atelier"}
                            </button>
                        </form>

                        <footer className="mt-10 text-center border-t border-white/5 pt-8 space-y-6">
                            <p className="text-[10px] text-rhum-cream/40 uppercase tracking-widest">
                                Pas encore membre ?{" "}
                                <button
                                    onClick={() => setRegisterOpen(true)}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 decoration-rhum-gold/30"
                                >
                                    REJOIGNEZ NOUS
                                </button>
                            </p>

                            {/* 🏺 Retour du bouton Administration */}
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