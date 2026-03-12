import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterModal() {
    // 🏺 Ajout de setLoginOpen pour permettre la redirection
    const { isRegisterOpen, setRegisterOpen, setLoginOpen, setAuth } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [isPro, setIsPro] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    return (
        <AnimatePresence>
            {isRegisterOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-md cursor-pointer"
                        onClick={() => setRegisterOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/30 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto custom-scrollbar cursor-default"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/60 to-transparent" />

                        <button
                            onClick={() => setRegisterOpen(false)}
                            className="absolute top-4 right-5 text-rhum-gold/60 hover:text-white transition-colors text-3xl font-extralight cursor-pointer"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-10">
                            <p className="text-rhum-gold/80 text-[10px] uppercase tracking-[0.4em] mb-2 font-black">Authentification</p>
                            <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Créer un Compte</h2>

                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => { setIsPro(false); setIsEmployee(false); }}
                                    className={`text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 border transition-all cursor-pointer font-black ${!isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                >
                                    Individuel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setIsPro(true); setIsEmployee(false); }}
                                    className={`text-[9px] uppercase tracking-[0.2em] px-5 py-2.5 border transition-all cursor-pointer font-black ${isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                >
                                    Entreprise (Pro)
                                </button>
                            </div>
                        </header>

                        {success ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 border border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-rhum-gold text-2xl font-serif">✓</span>
                                </div>
                                <p className="text-rhum-gold font-serif italic text-xl">Dossier scellé avec succès !</p>
                                <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">Ouverture de votre espace...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-6">

                                {!isPro && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Prénom</p>
                                            <input name="firstName" required placeholder="EX: JEAN" className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Nom</p>
                                            <input name="lastName" required placeholder="EX: DUPONT" className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                        </div>
                                    </div>
                                )}

                                {!isPro && (
                                    <div className="py-2">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <div
                                                onClick={() => setIsEmployee(!isEmployee)}
                                                className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isEmployee ? 'bg-rhum-gold' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${isEmployee ? 'left-6' : 'left-1'}`} />
                                            </div>
                                            <span className="text-[9px] text-white/50 uppercase tracking-widest font-black group-hover:text-rhum-gold transition-colors">
                                                Je suis bénéficiaire d'un Comité d'Entreprise
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {(isPro || (!isPro && isEmployee)) && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 bg-white/[0.02] p-4 border-l border-rhum-gold/30">
                                        <div className="space-y-2">
                                            <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Raison Sociale</p>
                                            <input name="companyName" required placeholder="NOM DE L'ENTREPRISE" className="w-full bg-transparent border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Identifiant Fiscal</p>
                                            <input name="siret" required pattern="[0-9]{14}" placeholder="NUMÉRO SIRET (14 CHIFFRES)" className="w-full bg-transparent border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-2">
                                    <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Email</p>
                                    <input name="email" type="email" required placeholder="VOTRE@EMAIL.COM" className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Téléphone</p>
                                    <input name="phone" type="tel" placeholder="06 00 00 00 00" className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 uppercase" />
                                </div>

                                <div className="space-y-2">
                                    <p className="text-[8px] uppercase tracking-widest text-rhum-gold/60 font-black ml-1">Mot de passe</p>
                                    <div className="relative group">
                                        <input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-white/[0.04] border-b border-rhum-gold/40 py-3 px-4 text-white outline-none focus:border-rhum-gold transition-all text-sm placeholder:text-white/10 pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-rhum-gold/40 hover:text-rhum-gold transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-400 text-[10px] uppercase tracking-widest text-center bg-red-400/10 py-4 border border-red-400/30 font-black">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className={`w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-all shadow-2xl rounded-sm ${isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                                >
                                    {isPending ? 'CHARGEMENT...' : "Créer un compte"}
                                </button>
                                <div className="text-center">
                                    <p className="text-[10px] text-rhum-cream/70 uppercase tracking-[0.2em] font-medium">
                                        Vous avez déjà un compte ?{" "}
                                        <button
                                            type="button"
                                            onClick={() => { setRegisterOpen(false); setLoginOpen(true); }}
                                            className="text-rhum-gold hover:text-white transition-colors underline underline-offset-4 decoration-rhum-gold/30 cursor-pointer font-black uppercase"
                                        >
                                            Se connecter
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}