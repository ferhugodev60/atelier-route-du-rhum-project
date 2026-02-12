import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function RegisterModal() {
    // 🏺 Pilotage via le store global
    const { isRegisterOpen, setRegisterOpen, setLoginOpen, setAuth } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await api.post('/auth/register', data);
            setSuccess(true);

            // 🏺 Connexion automatique après 2s de célébration
            setTimeout(() => {
                setAuth(response.data.user, response.data.token);
                setSuccess(false);
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.error || "Le registre refuse votre signature.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <AnimatePresence>
            {isRegisterOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
                    {/* Overlay avec flou professionnel */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-md"
                        onClick={() => setRegisterOpen(false)}
                    />

                    {/* Conteneur Modal - Aligné sur max-w-md pour la symétrie */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto"
                    >
                        {/* Ligne de design dorée */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button onClick={() => setRegisterOpen(false)} className="absolute top-4 right-5 text-rhum-gold/40 hover:text-white transition-colors text-2xl font-extralight">&times;</button>

                        <header className="text-center mb-8 md:mb-12">
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.4em] mt-3 font-bold">Inscription</p>
                            <h2 className="text-2xl md:text-4xl font-serif text-white uppercase tracking-tight">Rejoindre la Guilde</h2>
                        </header>

                        {success ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 border border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-rhum-gold text-2xl">✓</span>
                                </div>
                                <p className="text-rhum-gold font-serif italic text-lg">Votre parchemin est scellé !</p>
                                <p className="text-white/40 text-[10px] uppercase tracking-widest">Ouverture de l'Atelier...</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6">
                                {/* Prénom & Nom sur une ligne */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">Prénom</label>
                                        <input name="firstName" required className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10" placeholder="Jean" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">Nom</label>
                                        <input name="lastName" required className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10" placeholder="Dupont" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">Email professionnel</label>
                                    <input name="email" type="email" required className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10" placeholder="votre@email.com" />
                                </div>

                                {/* Téléphone - NOUVEAU CHAMP */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">Téléphone</label>
                                    <input name="phone" type="tel" className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10" placeholder="06 12 34 56 78" />
                                </div>

                                {/* Mot de passe */}
                                <div className="space-y-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-rhum-gold/50 font-bold ml-1">Secret (Mot de passe)</label>
                                    <input name="password" type="password" required className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-base text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:opacity-10" placeholder="••••••••" />
                                </div>

                                {error && (
                                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-[10px] uppercase tracking-wider text-center bg-red-400/5 py-3 border border-red-400/20">
                                        {error}
                                    </motion.p>
                                )}

                                <button type="submit" disabled={isPending} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white disabled:opacity-50 transition-all shadow-xl active:scale-[0.98] rounded-sm">
                                    {isPending ? 'SCELLAGE DU PARCHEMIN...' : "Créer mon compte"}
                                </button>
                            </form>
                        )}

                        <footer className="mt-10 text-center border-t border-white/5 pt-8">
                            <p className="text-[10px] text-rhum-cream/40 uppercase tracking-widest">
                                Déjà parmi nous ?{" "}
                                <button
                                    onClick={() => setLoginOpen(true)}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 decoration-rhum-gold/30"
                                >
                                    SE CONNECTER
                                </button>
                            </p>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}