import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuthStore } from '../../store/authStore';

export default function AdminLogin() {
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            // Tentative d'authentification
            const response = await api.post('/auth/login', { email, password });

            // Validation stricte du rôle
            if (response.data.user.role !== 'ADMIN') {
                throw new Error("Accès refusé. Cette zone est réservée à la direction.");
            }

            // Enregistrement dans le store et redirection
            setAuth(response.data.user, response.data.token);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || "Identifiants invalides.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center px-4 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/[0.02] border border-rhum-gold/10 p-10 backdrop-blur-xl shadow-2xl rounded-sm"
            >
                <header className="text-center mb-10">
                    <h1 className="text-rhum-gold font-serif text-3xl uppercase tracking-tighter">Console de Gestion</h1>
                    <p className="text-[10px] text-rhum-gold/40 uppercase tracking-[0.3em] mt-4 font-bold">Système Sécurisé</p>
                </header>

                <form onSubmit={handleAdminSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Identifiant Professionnel</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:text-white/5"
                            placeholder="nom@etablissement.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-rhum-gold/50 font-bold ml-1">Clé de sécurité</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 text-rhum-cream focus:border-rhum-gold outline-none transition-all placeholder:text-white/5"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-[10px] text-center uppercase tracking-widest bg-red-400/5 py-2 border border-red-400/10"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-rhum-gold text-rhum-green py-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Authentification...' : 'Accéder au Dashboard'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}