import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function RegisterModal() {
    const { isRegisterOpen, setRegisterOpen, setAuth } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // 🏺 Pilotage des segments institutionnels
    const [isPro, setIsPro] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // 🏺 On adjoint le flag bénéficiaire si l'utilisateur est un particulier rattaché
        const payload = {
            ...data,
            isEmployee: !isPro && isEmployee
        };

        try {
            const response = await api.post('/auth/register', payload);
            setSuccess(true);

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
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/98 backdrop-blur-md"
                        onClick={() => setRegisterOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-12 w-full max-w-md shadow-2xl rounded-sm max-h-full overflow-y-auto custom-scrollbar"
                    >
                        <button onClick={() => setRegisterOpen(false)} className="absolute top-4 right-5 text-rhum-gold/40 hover:text-white transition-colors text-2xl font-extralight">&times;</button>

                        <header className="text-center mb-8">
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.4em] mt-3 font-black">Inscription</p>
                            <h2 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-tight">Rejoindre la Guilde</h2>

                            {/* 🏺 Sélecteur de type de compte : Particulier vs CE */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => { setIsPro(false); setIsEmployee(false); }}
                                    className={`text-[9px] uppercase tracking-widest px-4 py-2 border transition-all ${!isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/40'}`}
                                >
                                    Particulier
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPro(true)}
                                    className={`text-[9px] uppercase tracking-widest px-4 py-2 border transition-all ${isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/40'}`}
                                >
                                    Comité d'Entreprise
                                </button>
                            </div>
                        </header>

                        {success ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="w-16 h-16 border border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-rhum-gold text-2xl">✓</span>
                                </div>
                                <p className="text-rhum-gold font-serif italic text-lg">Votre parchemin est scellé !</p>
                            </div>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="firstName" required placeholder="Prénom" className="bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm" />
                                    <input name="lastName" required placeholder="Nom" className="bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm" />
                                </div>

                                {/* 🏺 Levier de rattachement Salarié (Visible uniquement pour les particuliers) */}
                                {!isPro && (
                                    <div className="py-2">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div
                                                onClick={() => setIsEmployee(!isEmployee)}
                                                className={`w-8 h-4 rounded-full relative transition-all duration-300 ${isEmployee ? 'bg-rhum-gold' : 'bg-white/10'}`}
                                            >
                                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all duration-300 ${isEmployee ? 'left-5' : 'left-1'}`} />
                                            </div>
                                            <span className="text-[9px] text-white/40 uppercase tracking-widest font-black group-hover:text-rhum-gold transition-colors">
                                                Je suis bénéficiaire d'un Comité d'Entreprise
                                            </span>
                                        </label>
                                    </div>
                                )}

                                {/* 🏢 Champs institutionnels (Si Pro OU Si Particulier rattaché) */}
                                {(isPro || (!isPro && isEmployee)) && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                                        <input
                                            name="companyName"
                                            required
                                            placeholder={isPro ? "Raison Sociale du CE" : "Nom de votre Entreprise"}
                                            className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm"
                                        />
                                        <input
                                            name="siret"
                                            required
                                            pattern="[0-9]{14}"
                                            title="Le SIRET doit contenir 14 chiffres"
                                            placeholder="Numéro SIRET (14 chiffres)"
                                            className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm"
                                        />
                                    </motion.div>
                                )}

                                <input name="email" type="email" required placeholder="Email de contact" className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm" />
                                <input name="phone" type="tel" placeholder="Téléphone" className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm" />
                                <input name="password" type="password" required placeholder="Secret (Mot de passe)" className="w-full bg-white/[0.03] border-b border-rhum-gold/20 py-3 px-4 text-rhum-cream outline-none focus:border-rhum-gold transition-all text-sm" />

                                {error && (
                                    <p className="text-red-400 text-[10px] uppercase tracking-wider text-center bg-red-400/5 py-3 border border-red-400/20">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? 'SCELLAGE...' : (isPro ? "Enregistrer le Comité" : (isEmployee ? "Valider mon rattachement" : "Créer mon compte"))}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}