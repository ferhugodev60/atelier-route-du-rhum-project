import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axiosInstance';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({ password: '', confirm: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirm) {
            setError("Les secrets ne sont pas identiques.");
            return;
        }

        setStatus('loading');
        try {
            await api.post('/auth/setup-final-password', {
                token,
                password: formData.password
            });
            setStatus('success');
            setTimeout(() => navigate('/connexion'), 3000);
        } catch (err: any) {
            setStatus('error');
            setError(err.response?.data?.error || "Le Registre refuse ce changement.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/[0.02] border border-rhum-gold/20 p-8 md:p-12 rounded-sm"
            >
                <header className="text-center mb-10">
                    <p className="text-rhum-gold text-[10px] uppercase tracking-[0.5em] mb-4 font-black">Sécurité</p>
                    <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Votre Secret</h2>
                    <p className="text-white/40 text-[11px] mt-4 uppercase tracking-widest leading-relaxed">
                        Définissez votre mot de passe personnel pour accéder au Registre et à la Boutique.
                    </p>
                </header>

                {status === 'success' ? (
                    <div className="text-center py-10 space-y-6">
                        <div className="w-16 h-16 border border-rhum-gold rounded-full flex items-center justify-center mx-auto text-rhum-gold text-2xl">✓</div>
                        <p className="text-rhum-gold font-black uppercase tracking-widest text-xs">Secret Scellé avec succès</p>
                        <p className="text-white/40 text-[10px] uppercase">Redirection vers l'espace membre...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Nouveau Mot de Passe</label>
                            <input
                                required
                                type="password"
                                className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors text-sm"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Confirmer le Secret</label>
                            <input
                                required
                                type="password"
                                className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors text-sm"
                                onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-400 text-[10px] uppercase font-black text-center bg-red-400/5 py-3 border border-red-400/20 tracking-widest">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-rhum-gold text-[#0a1a14] py-5 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all duration-700 disabled:opacity-30 rounded-sm"
                        >
                            {status === 'loading' ? 'SCELLAGE...' : 'Enregistrer mon secret'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}