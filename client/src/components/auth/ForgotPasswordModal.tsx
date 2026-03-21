import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MailCheck } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function ForgotPasswordModal() {
    const { isForgotPasswordOpen, setForgotPasswordOpen, setLoginOpen } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success'>('idle');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isForgotPasswordOpen) {
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
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
            // Réinitialiser l'état local à la fermeture
            setTimeout(() => { setStatus('idle'); setError(null); }, 300);
        }
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
        };
    }, [isForgotPasswordOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);
        const email = (new FormData(e.currentTarget)).get('email') as string;
        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
        } catch {
            setError("Une erreur technique est survenue. Réessayez dans un instant.");
        } finally {
            setIsPending(false);
        }
    };

    const labelStyle = "text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-rhum-gold font-black block ml-1";
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 border-b-rhum-gold/50 py-4 px-5 text-white outline-none focus:border-rhum-gold focus:bg-white/[0.06] transition-all text-base placeholder:text-white/30 font-medium rounded-sm";

    return (
        <AnimatePresence>
            {isForgotPasswordOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a1a14] md:bg-transparent">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hidden md:block fixed inset-0 bg-black/96 backdrop-blur-xl cursor-pointer"
                        onClick={() => setForgotPasswordOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative z-10 bg-[#0a1a14] flex flex-col min-h-screen w-full md:min-h-0 md:max-w-xl md:mx-auto md:my-20 md:border md:border-rhum-gold/20 md:p-14 md:shadow-[0_0_50px_rgba(0,0,0,0.9)] md:rounded-sm p-8 pt-24"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="hidden md:block absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                        <button
                            onClick={() => setForgotPasswordOpen(false)}
                            className="absolute top-6 right-8 text-rhum-gold/60 hover:text-white transition-colors text-4xl font-extralight cursor-pointer"
                        >
                            &times;
                        </button>

                        <header className="text-center mb-10 md:mb-12">
                            <span className="text-rhum-gold text-[9px] md:text-[10px] uppercase tracking-[0.5em] mb-3 block font-black">Sécurité</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-white uppercase tracking-tighter">Mot de passe oublié</h2>
                        </header>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center text-center gap-8 py-6"
                            >
                                <div className="w-20 h-20 rounded-full border border-rhum-gold/40 flex items-center justify-center">
                                    <MailCheck size={32} className="text-rhum-gold" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-rhum-gold font-black uppercase tracking-[0.3em] text-[11px]">Lien envoyé</p>
                                    <p className="text-white/60 text-[12px] uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                                        Si un compte est associé à cet email, vous recevrez un lien de réinitialisation valable <strong className="text-white/80">1 heure</strong>.
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setForgotPasswordOpen(false); setLoginOpen(true); }}
                                    className="inline-flex items-center gap-3 text-rhum-gold/70 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-black cursor-pointer"
                                >
                                    <ArrowLeft size={14} />
                                    Retour à la connexion
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] text-center mb-10 leading-relaxed">
                                    Saisissez votre adresse email. Nous vous enverrons un lien sécurisé pour réinitialiser votre secret.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                                    <div className="space-y-3">
                                        <label htmlFor="fp-email" className={labelStyle}>Identifiant (Email)</label>
                                        <input
                                            id="fp-email"
                                            name="email"
                                            type="email"
                                            required
                                            className={inputStyle}
                                            placeholder="votre@email.com"
                                            autoComplete="email"
                                        />
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
                                            {isPending ? 'ENVOI EN COURS...' : 'Envoyer le lien'}
                                        </button>
                                    </div>
                                </form>

                                <footer className="mt-12 text-center border-t border-white/5 pt-10">
                                    <button
                                        onClick={() => { setForgotPasswordOpen(false); setLoginOpen(true); }}
                                        className="inline-flex items-center gap-3 text-rhum-gold/60 hover:text-white transition-colors text-[10px] uppercase tracking-[0.3em] font-black cursor-pointer"
                                    >
                                        <ArrowLeft size={13} />
                                        Retour à la connexion
                                    </button>
                                </footer>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
