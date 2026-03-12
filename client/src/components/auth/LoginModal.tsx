import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function LoginModal() {
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
            setAuth(response.data.user, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.error || "L'accès reste scellé. Vérifiez vos identifiants.");
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
                        className="relative bg-[#0a1a14] border border-rhum-gold/30 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/60 to-transparent" />

                        <button onClick={() => setLoginOpen(false)} className="absolute top-4 right-5 text-rhum-gold/60 hover:text-white text-3xl font-extralight transition-colors">&times;</button>

                        <header className="text-center mb-10">
                            {/* 🏺 Opacité augmentée pour le titre de section */}
                            <p className="text-rhum-gold/80 text-[10px] uppercase tracking-[0.4em] mb-2 font-black">Authentification</p>
                            <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-tight">Se connecter</h2>
                        </header>

                        <form onSubmit={handleFormSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/90 font-black ml-1">
                                    Identifiant (Email)
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-4 px-4 text-base text-white focus:border-rhum-gold outline-none transition-all placeholder:text-white/20"
                                    placeholder="votre@email.com"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/90 font-black ml-1">
                                        Mot de passe
                                    </label>
                                    <button
                                        type="button"
                                        className="text-[9px] uppercase tracking-widest text-rhum-gold/60 hover:text-rhum-gold transition-colors font-bold"
                                    >
                                        Oublié ?
                                    </button>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-4 px-4 text-base text-white focus:border-rhum-gold outline-none transition-all placeholder:text-white/20"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-400 text-[10px] uppercase tracking-widest text-center bg-red-400/10 py-4 border border-red-400/30 font-bold"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <button type="submit" disabled={isPending} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white transition-all shadow-2xl rounded-sm">
                                {isPending ? 'CHARGEMENT...' : "Se connecter"}
                            </button>
                        </form>

                        <footer className="mt-12 text-center border-t border-white/10 pt-10 space-y-8">
                            <p className="text-[10px] text-rhum-cream/70 uppercase tracking-[0.2em] font-medium">
                                Pas encore membre ?{" "}
                                <button
                                    onClick={() => setRegisterOpen(true)}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-8 decoration-rhum-gold/50 font-black"
                                >
                                    REJOIGNEZ-NOUS
                                </button>
                            </p>

                            <div className="pt-2">
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <div className="h-[1px] w-8 bg-white/10" />
                                    <span className="text-[8px] text-white/20 uppercase tracking-[0.4em]">Accès réservé</span>
                                    <div className="h-[1px] w-8 bg-white/10" />
                                </div>
                                <Link
                                    to="/admin"
                                    onClick={() => setLoginOpen(false)}
                                    className="block text-rhum-gold/70 hover:text-rhum-gold transition-colors font-black text-[10px] uppercase tracking-[0.3em] border border-rhum-gold/20 py-4 rounded-sm mx-auto max-w-[240px] hover:bg-white/5"
                                >
                                    Console Administrateur
                                </Link>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}