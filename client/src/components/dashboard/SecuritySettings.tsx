import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

// Icônes "Atelier" Minimalistes
const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65" />
    </svg>
);

export default function SecuritySettings() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [visibleFields, setVisibleFields] = useState({ current: false, new: false, confirm: false });
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const toggleVisibility = (field: keyof typeof visibleFields) => {
        setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return setStatus({ type: 'error', msg: "Les nouveaux mots de passe ne correspondent pas." });
        }
        setLoading(true);
        setStatus(null);

        try {
            await api.patch('/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setStatus({ type: 'success', msg: "Le sceau de votre secret a été mis à jour." });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.error || "Erreur lors de la mise à jour." });
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (id: keyof typeof passwords, label: string) => {
        const isVisible = visibleFields[id as keyof typeof visibleFields];

        return (
            <div className="flex flex-col gap-2 border-b border-white/5 pb-4 relative group">
                <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">
                    {label}
                </label>
                <div className="flex items-center">
                    <input
                        type={isVisible ? "text" : "password"}
                        required
                        value={passwords[id]}
                        onChange={(e) => setPasswords({...passwords, [id]: e.target.value})}
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-10 pr-10"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility(id as keyof typeof visibleFields)}
                        className="absolute right-0 p-2 text-white/20 hover:text-rhum-gold transition-all duration-300"
                        aria-label={isVisible ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={isVisible ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                transition={{ duration: 0.15 }}
                            >
                                {isVisible ? <EyeOpen /> : <EyeClosed />}
                            </motion.div>
                        </AnimatePresence>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Modifier votre secret</h2>
                <div className="h-1 w-12 bg-rhum-gold/30 mt-4" />
            </header>

            <form onSubmit={handleSubmit} className="space-y-10 max-w-lg">
                {renderInput('current', 'Mot de passe actuel')}
                {renderInput('new', 'Nouveau mot de passe')}
                {renderInput('confirm', 'Confirmer le nouveau secret')}

                {status && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`text-[10px] uppercase tracking-[0.2em] p-4 border text-center ${
                            status.type === 'success' ? 'text-rhum-gold border-rhum-gold/20 bg-rhum-gold/5' : 'text-red-400 border-red-400/20 bg-red-400/5'
                        }`}
                    >
                        {status.msg}
                    </motion.p>
                )}

                <div className="pt-6">
                    <button
                        disabled={loading}
                        className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-widest text-[10px] hover:bg-white hover:tracking-[0.3em] transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-[0.98]"
                    >
                        {loading ? "Distillation du secret..." : "Sceller le nouveau mot de passe"}
                    </button>
                </div>
            </form>
        </div>
    );
}