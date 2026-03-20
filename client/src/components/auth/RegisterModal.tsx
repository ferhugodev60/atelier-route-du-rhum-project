import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff, ShieldCheck, Landmark, User as UserIcon } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterModal() {
    const navigate = useNavigate();
    const { isRegisterOpen, setRegisterOpen, setLoginOpen, setAuth } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [isPro, setIsPro] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // 🏺 PROTOCOLE DE SÉCURITÉ : Fixation de l'arrière-plan
    useEffect(() => {
        if (isRegisterOpen) {
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
    }, [isRegisterOpen]);

    /**
     * 🏺 SCELLAGE GOOGLE
     * Permet une inscription instantanée suivie d'une qualification différée.
     */
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError(null);
        setIsPending(true);
        try {
            const response = await api.post('/auth/google', {
                idToken: credentialResponse.credential
            });

            const { user, token, isNewUser } = response.data;

            setAuth(user, token);
            setRegisterOpen(false);

            // Si c'est un nouveau compte, on l'envoie vers le choix du rang (Pro/Lambda)
            if (isNewUser) {
                navigate('/completer-profil');
            }
        } catch (err: any) {
            setError("Le Registre n'a pas pu valider l'inscription Google.");
        } finally {
            setIsPending(false);
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            ...data,
            firstName: isPro ? "CE" : data.firstName,
            lastName: isPro ? (data.companyName as string).toUpperCase() : data.lastName,
            isEmployee: !isPro && isEmployee
        };

        try {
            const response = await api.post('/auth/register', payload);
            setSuccess(true);

            setTimeout(() => {
                setAuth(response.data.user, response.data.token);
                setSuccess(false);
                setRegisterOpen(false);
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || "Le registre refuse votre signature.");
        } finally {
            setIsPending(false);
        }
    };

    const labelStyle = "text-[9px] md:text-[11px] uppercase tracking-[0.25em] text-rhum-gold font-black mb-1.5 block ml-1";
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 border-b-rhum-gold/50 py-3 md:py-4 px-4 md:px-5 text-white outline-none focus:border-rhum-gold focus:bg-white/[0.06] transition-all text-sm md:text-base placeholder:text-white/30 font-medium rounded-sm";

    return (
        <AnimatePresence>
            {isRegisterOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a1a14] md:bg-transparent">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hidden md:block fixed inset-0 bg-black/96 backdrop-blur-xl cursor-pointer"
                        onClick={() => setRegisterOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`
                            relative z-10 bg-[#0a1a14] flex flex-col min-h-screen w-full
                            md:min-h-0 md:max-w-xl md:mx-auto md:my-10 md:border md:border-rhum-gold/20 md:p-14 md:shadow-[0_0_50px_rgba(0,0,0,0.9)] md:rounded-sm
                            p-8 pt-24
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="hidden md:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button
                            onClick={() => setRegisterOpen(false)}
                            className="absolute top-4 right-6 text-rhum-gold/40 hover:text-white transition-colors text-3xl font-extralight cursor-pointer"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-8 md:mb-10">
                            <span className="text-rhum-gold text-[8px] md:text-[10px] uppercase tracking-[0.5em] mb-3 block font-black">Accès Client</span>
                            <h2 className="text-2xl md:text-5xl font-serif text-white uppercase tracking-tighter">Créer un Compte</h2>
                        </header>

                        {/* 🏺 SECTION GOOGLE : Inscription Flash */}
                        {!success && (
                            <div className="mb-10 flex flex-col items-center gap-6 border-b border-white/5 pb-10">
                                <GoogleLogin
                                    onSuccess={(response) => {
                                        console.log("🔍 [FRONT-AUTH] Jeton reçu de Google, envoi au serveur...");
                                        handleGoogleSuccess(response);
                                    }}
                                    onError={() => {
                                        console.error("❌ [FRONT-AUTH] Google a refusé d'ouvrir la porte.");
                                        setError("Connexion Google interrompue.");
                                    }}
                                    theme="filled_black"
                                    shape="square"
                                    width={350} // 🏺 CORRECTION : Nombre pur pour éviter l'erreur de log
                                    text="continue_with"
                                />
                            </div>
                        )}

                        {success ? (
                            <div className="py-16 text-center space-y-6 flex-1 flex flex-col justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 border border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-gold-glow">
                                    <ShieldCheck className="text-rhum-gold" size={32} />
                                </div>
                                <p className="text-rhum-gold font-serif italic text-2xl md:text-3xl">Dossier scellé</p>
                                <p className="text-[9px] md:text-[11px] text-white/40 uppercase tracking-[0.3em] font-black">Ouverture de votre espace...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-row items-center justify-center gap-2 md:gap-4 mb-8">
                                    <button
                                        type="button"
                                        onClick={() => { setIsPro(false); setIsEmployee(false); }}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] px-4 md:px-8 py-3 md:py-4 border transition-all cursor-pointer font-black ${!isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold shadow-lg' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                                    >
                                        <UserIcon size={12} className="md:w-[14px]" />
                                        Individuel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsPro(true); setIsEmployee(false); }}
                                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-[8px] md:text-[10px] uppercase tracking-[0.15em] px-4 md:px-8 py-3 md:py-4 border transition-all cursor-pointer font-black ${isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold shadow-lg' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                                    >
                                        <Landmark size={12} className="md:w-[14px]" />
                                        Pro / CSE
                                    </button>
                                </div>

                                <form onSubmit={handleRegister} className="space-y-6 md:space-y-8 flex-1">
                                    {!isPro && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            <div className="space-y-1.5">
                                                <label className={labelStyle}>Prénom</label>
                                                <input name="firstName" required placeholder="EX: JEAN" className={inputStyle} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className={labelStyle}>Nom</label>
                                                <input name="lastName" required placeholder="EX: DUPONT" className={inputStyle} />
                                            </div>
                                        </div>
                                    )}

                                    {!isPro && (
                                        <div className="py-3 px-4 md:px-6 bg-white/[0.02] border border-white/5 rounded-sm">
                                            <label className="flex items-center gap-4 md:gap-5 cursor-pointer group">
                                                <div
                                                    onClick={() => setIsEmployee(!isEmployee)}
                                                    className={`w-10 h-5 md:w-12 md:h-6 rounded-full relative transition-all duration-300 border ${isEmployee ? 'bg-rhum-gold border-rhum-gold' : 'bg-transparent border-white/20'}`}
                                                >
                                                    <div className={`absolute top-0.5 md:top-1 w-3.5 h-3.5 rounded-full bg-white transition-all duration-300 ${isEmployee ? 'left-6 md:left-7' : 'left-0.5 md:left-1'}`} />
                                                </div>
                                                <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.15em] font-black group-hover:text-rhum-gold transition-colors">
                                                    Bénéficiaire d'un Comité d'Entreprise
                                                </span>
                                            </label>
                                        </div>
                                    )}

                                    {(isPro || (!isPro && isEmployee)) && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 md:space-y-8 bg-rhum-gold/5 p-5 md:p-8 border-l-2 border-rhum-gold/40">
                                            <div className="space-y-1.5">
                                                <label className={labelStyle}>Raison Sociale</label>
                                                <input name="companyName" required placeholder="NOM DE L'ENTREPRISE" className={inputStyle} />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className={labelStyle}>SIRET</label>
                                                <input name="siret" required pattern="[0-9]{14}" placeholder="000 000 000 00000" className={inputStyle} />
                                            </div>
                                        </motion.div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className={labelStyle}>Email</label>
                                        <input name="email" type="email" required placeholder="votre@email.com" className={inputStyle} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelStyle}>Téléphone</label>
                                        <input name="phone" type="tel" placeholder="06 00 00 00 00" className={inputStyle} />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={labelStyle}>Mot de passe</label>
                                        <div className="relative group">
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                placeholder="••••••••••••"
                                                className={`${inputStyle} pr-12 md:pr-14`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-rhum-gold/40 hover:text-rhum-gold transition-colors cursor-pointer"
                                            >
                                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <p className="text-red-400 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-center bg-red-400/5 py-4 border border-red-400/20 font-black italic">
                                            {error}
                                        </p>
                                    )}

                                    <div className="pt-4 md:pt-6">
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className={`w-full bg-rhum-gold text-rhum-green py-5 md:py-6 font-black uppercase tracking-[0.3em] text-[11px] md:text-[12px] hover:bg-white transition-all shadow-2xl rounded-sm ${isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-[0.98]'}`}
                                        >
                                            {isPending ? 'SCELLAGE EN COURS...' : "Créer mon compte"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}

                        <footer className="mt-12 md:mt-16 text-center border-t border-white/5 pt-10 pb-10 md:pb-0">
                            <p className="text-[10px] md:text-[11px] text-rhum-cream/50 uppercase tracking-[0.2em] font-medium">
                                Déjà membre ?{" "}
                                <button
                                    type="button"
                                    onClick={() => { setRegisterOpen(false); setLoginOpen(true); }}
                                    className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 md:underline-offset-8 decoration-rhum-gold/30 font-black uppercase"
                                >
                                    Se connecter
                                </button>
                            </p>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}