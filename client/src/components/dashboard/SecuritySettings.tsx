import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
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
            return setStatus({ type: 'error', msg: "La confirmation du nouveau secret ne correspond pas." });
        }
        setLoading(true);
        setStatus(null);
        try {
            await api.patch('/auth/change-password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setStatus({ type: 'success', msg: "Vos paramètres de sécurité ont été mis à jour avec succès." });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.response?.data?.error || "Échec de la mise à jour de sécurité." });
        } finally {
            setLoading(false);
        }
    };

    const renderInput = (id: keyof typeof passwords, label: string) => {
        const isVisible = visibleFields[id as keyof typeof visibleFields];
        return (
            <div className="flex flex-col gap-4 border-b border-white/10 pb-6 relative group font-sans items-center">
                <label className="text-rhum-gold text-[9px] uppercase tracking-[0.3em] font-black opacity-60 text-center">
                    {label}
                </label>
                <div className="flex items-center w-full relative">
                    <input
                        type={isVisible ? "text" : "password"}
                        required
                        value={passwords[id]}
                        onChange={(e) => setPasswords({...passwords, [id]: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/5 px-4 py-4 text-white font-sans text-lg lg:text-xl tracking-widest outline-none focus:border-rhum-gold transition-all placeholder:opacity-5 text-center"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => toggleVisibility(id as keyof typeof visibleFields)}
                        className="absolute right-4 p-2 text-white/30 hover:text-rhum-gold transition-all duration-300"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={isVisible ? 'visible' : 'hidden'}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
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
        <div className="max-w-2xl mx-auto font-sans">
            <header className="mb-16 border-b border-rhum-gold/10 pb-8 flex flex-col items-center text-center">
                <h2 className="text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">Sécurité du compte</h2>
                <p className="text-rhum-gold text-[9px] uppercase tracking-[0.4em] mt-3 font-black opacity-60">Gestion de votre mot de passe</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12 max-w-lg mx-auto">
                {renderInput('current', 'mot de passe actuel')}
                {renderInput('new', 'Nouveau mot de passe')}
                {renderInput('confirm', 'Confirmation du nouveau mot de passe')}

                {status && (
                    <motion.p
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        className={`text-[11px] uppercase tracking-[0.2em] font-bold p-5 border text-center rounded-sm ${
                            status.type === 'success' ? 'text-rhum-gold border-rhum-gold/30 bg-rhum-gold/10' : 'text-red-500 border-red-500/30 bg-red-500/10'
                        }`}
                    >
                        {status.msg}
                    </motion.p>
                )}

                <div className="pt-8">
                    <button
                        disabled={loading}
                        className="w-full py-6 bg-rhum-gold text-rhum-green font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white transition-all duration-500 shadow-2xl disabled:opacity-50 rounded-sm"
                    >
                        {loading ? "Mise à jour en cours..." : "Valider les modifications"}
                    </button>
                </div>
            </form>
        </div>
    );
}