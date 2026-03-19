import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, ShieldCheck, LockKeyhole } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginModal() {
    const navigate = useNavigate();
    const { isLoginOpen, setLoginOpen, setRegisterOpen, setAuth } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // 🏺 PROTOCOLE DE SÉCURITÉ : Fixation de l'arrière-plan
    useEffect(() => {
        if (isLoginOpen) {
            const scrollY = window.scrollY;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
        } else {
            const scrollY = document.body.style.top;
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
        };
    }, [isLoginOpen]);

    /**
     * 🏺 SCELLAGE GOOGLE
     * Traite le jeton d'identité et redirige vers la qualification si nécessaire.
     */
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError(null);
        setIsPending(true);
        try {
            const response = await api.post('/auth/google', {
                idToken: credentialResponse.credential
            });

            const { user, token, isNewUser } = response.data;

            // On scelle la session dans le store
            setAuth(user, token);
            setLoginOpen(false);

            // Si le profil n'est pas complet (nouveau compte Google), redirection vers le sas
            if (isNewUser) {
                navigate('/completer-profil');
            }
        } catch (err: any) {
            setError("Le Registre n'a pas pu valider votre identité Google.");
        } finally {
            setIsPending(false);
        }
    };

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
            setLoginOpen(false);
        } catch (err: any) {
            setError(err.response?.data?.error || "L'accès reste scellé. Vérifiez vos identifiants.");
        } finally {
            setIsPending(false);
        }
    };

    const labelStyle = "text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-rhum-gold font-black block ml-1";
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 border-b-rhum-gold/50 py-4 px-5 text-white outline-none focus:border-rhum-gold focus:bg-white/[0.06] transition-all text-base placeholder:text-white/30 font-medium rounded-sm";

    return (
        <AnimatePresence>
            {isLoginOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a1a14] md:bg-transparent">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hidden md:block fixed inset-0 bg-black/96 backdrop-blur-xl cursor-pointer"
                        onClick={() => setLoginOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`
                            relative z-10 bg-[#0a1a14] flex flex-col min-h-screen w-full
                            md:min-h-0 md:max-w-xl md:mx-auto md:my-20 md:border md:border-rhum-gold/20 md:p-14 md:shadow-[0_0_50px_rgba(0,0,0,0.9)] md:rounded-sm
                            p-8 pt-24
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="hidden md:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button
                            onClick={() => setLoginOpen(false)}
                            className="absolute top-6 right-8 text-rhum-gold/60 hover:text-white transition-colors text-4xl font-extralight cursor-pointer"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-10 md:mb-12">
                            <span className="text-rhum-gold text-[9px] md:text-[10px] uppercase tracking-[0.5em] mb-3 block font-black">Accès client</span>
                            <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tighter">Se Connecter</h2>
                        </header>

                        {/* 🏺 SECTION GOOGLE : La Porte de Bronze */}
                        <div className="mb-10 flex flex-col items-center gap-6">
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Connexion Google interrompue.")}
                                    theme="filled_black"
                                    shape="square"
                                    width="100%"
                                    text="continue_with"
                                />
                            </div>

                            <div className="relative w-full flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
                                <span className="relative bg-[#0a1a14] px-4 text-[9px] text-white uppercase tracking-[0.4em] font-black">Ou</span>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-8 flex-1">
                            <div className="space-y-3">
                                <label htmlFor="email" className={labelStyle}>Identifiant (Email)</label>
                                <input id="email" name="email" type="email" required className={inputStyle} placeholder="votre@email.com" />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <label htmlFor="password" className={labelStyle}>Mot de passe</label>
                                    <button type="button" className="text-[9px] uppercase tracking-widest text-rhum-gold hover:text-white transition-colors font-black cursor-pointer">Oublié ?</button>
                                </div>
                                <div className="relative group">
                                    <input id="password" name="password" type={showPassword ? "text" : "password"} required className={`${inputStyle} pr-14`} placeholder="••••••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-rhum-gold/60 hover:text-rhum-gold transition-colors cursor-pointer">
                                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-400 text-[11px] uppercase tracking-[0.2em] text-center bg-red-400/5 py-5 border border-red-400/20 font-black italic">
                                    {error}
                                </p>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full bg-rhum-gold text-rhum-green py-5 md:py-6 font-black uppercase tracking-[0.3em] text-[12px] hover:bg-white transition-all shadow-2xl rounded-sm ${isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
                                >
                                    {isPending ? 'SCELLAGE EN COURS...' : "Accéder à mon espace"}
                                </button>
                            </div>
                        </form>

                        <footer className="mt-12 md:mt-14 text-center border-t border-white/5 pt-10 space-y-12">
                            <p className="text-[11px] text-rhum-cream/50 uppercase tracking-[0.2em] font-medium">
                                Vous êtes Nouveau ?{" "}
                                <button
                                    onClick={() => { setLoginOpen(false); setRegisterOpen(true); }}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-8 decoration-rhum-gold/30 font-black cursor-pointer uppercase"
                                >
                                    Créer un compte
                                </button>
                            </p>

                            <div className="pb-10 md:pb-0">
                                <div className="flex items-center justify-center gap-4 mb-8">
                                    <div className="h-[1px] w-12 bg-white/5" />
                                    <ShieldCheck size={16} className="text-white/20" />
                                    <div className="h-[1px] w-12 bg-white/5" />
                                </div>
                                <Link
                                    to="/admin"
                                    onClick={() => setLoginOpen(false)}
                                    className="inline-flex items-center gap-3 text-rhum-gold hover:text-white hover:border-white transition-all font-black text-[10px] uppercase tracking-[0.3em] border border-rhum-gold/30 px-10 py-4 rounded-sm hover:bg-white/5 cursor-pointer"
                                >
                                    <LockKeyhole size={14} className="text-rhum-gold" />
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