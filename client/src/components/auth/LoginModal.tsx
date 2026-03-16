import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, ShieldCheck, LockKeyhole } from 'lucide-react';

export default function LoginModal() {
    const { isLoginOpen, setLoginOpen, setRegisterOpen, setAuth } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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

    const labelStyle = "text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-rhum-gold font-black block ml-1";
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 border-b-rhum-gold/50 py-3 md:py-4 px-4 md:px-5 text-white outline-none focus:border-rhum-gold focus:bg-white/[0.06] transition-all text-sm md:text-base placeholder:text-white/30 uppercase font-medium rounded-sm";

    return (
        <AnimatePresence>
            {isLoginOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-6 md:px-4 md:py-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/96 backdrop-blur-xl cursor-pointer"
                        onClick={() => setLoginOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/20 p-6 md:p-14 w-full max-w-xl shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-sm max-h-[90vh] md:max-h-full overflow-y-auto custom-scrollbar cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button
                            onClick={() => setLoginOpen(false)}
                            className="absolute top-4 right-6 text-rhum-gold/60 hover:text-white transition-colors text-3xl font-extralight cursor-pointer"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-10 md:mb-14">
                            <span className="text-rhum-gold text-[8px] md:text-[10px] uppercase tracking-[0.5em] mb-3 block font-black">Accès client</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tighter">Se Connecter</h2>
                        </header>

                        <form onSubmit={handleFormSubmit} className="space-y-6 md:space-y-10">
                            <div className="space-y-2">
                                <label htmlFor="email" className={labelStyle}>Identifiant (Email)</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className={inputStyle}
                                    placeholder="VOTRE@EMAIL.COM"
                                />
                            </div>

                            <div className="space-y-2">
                                {/* 🏺 Alignement rectifié : items-baseline pour caler le lien sur la ligne du label */}
                                <div className="flex justify-between items-baseline mb-1">
                                    <label htmlFor="password" className={labelStyle}>Mot de passe</label>
                                    <button
                                        type="button"
                                        /* 🏺 Opacité supprimée (text-rhum-gold pur) */
                                        className="text-[8px] md:text-[9px] uppercase tracking-widest text-rhum-gold hover:text-white transition-colors font-black cursor-pointer"
                                    >
                                        Oublié ?
                                    </button>
                                </div>
                                <div className="relative group">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className={`${inputStyle} pr-12 md:pr-14`}
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-rhum-gold/60 hover:text-rhum-gold transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-center bg-red-400/5 py-4 border border-red-400/20 font-black">
                                    {error}
                                </p>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full bg-rhum-gold text-rhum-green py-5 md:py-6 font-black uppercase tracking-[0.3em] text-[11px] md:text-[12px] hover:bg-white transition-all shadow-2xl rounded-sm ${isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
                                >
                                    {isPending ? 'AUTHENTIFICATION...' : "Accéder à mon espace"}
                                </button>
                            </div>
                        </form>

                        <footer className="mt-12 md:mt-16 text-center border-t border-white/5 pt-10 space-y-10">
                            <p className="text-[10px] md:text-[11px] text-rhum-cream/50 uppercase tracking-[0.2em] font-medium">
                                Vous êtes Nouveau ?{" "}
                                <button
                                    onClick={() => { setLoginOpen(false); setRegisterOpen(true); }}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 md:underline-offset-8 decoration-rhum-gold/30 font-black cursor-pointer uppercase"
                                >
                                    Créer un compte
                                </button>
                            </p>

                            <div className="pt-4">
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="h-[1px] w-12 bg-white/5" />
                                    <ShieldCheck size={16} className="text-white/20" />
                                    <div className="h-[1px] w-12 bg-white/5" />
                                </div>
                                <Link
                                    to="/admin"
                                    onClick={() => setLoginOpen(false)}
                                    /* 🏺 Contraste renforcé : text-rhum-gold et bordure plus visible */
                                    className="inline-flex items-center gap-3 text-rhum-gold hover:text-white hover:border-white transition-all font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] border border-rhum-gold/30 px-8 py-4 rounded-sm hover:bg-white/5 cursor-pointer"
                                >
                                    <LockKeyhole size={12} className="text-rhum-gold" />
                                    Console Administration
                                </Link>
                            </div>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}