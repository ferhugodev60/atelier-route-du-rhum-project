import React, { useState } from 'react';
import api from '../../api/axiosInstance';

export default function SecuritySettings() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="max-w-2xl mx-auto lg:mx-0">
            <header className="mb-12">
                <h2 className="text-2xl lg:text-3xl font-serif text-white">Modifier votre mot de passe</h2>
            </header>

            <form onSubmit={handleSubmit} className="space-y-10 max-w-lg">
                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                    <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">Mot de passe actuel</label>
                    <input
                        type="password"
                        required
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-20"
                    />
                </div>

                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                    <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">Nouveau mot de passe</label>
                    <input
                        type="password"
                        required
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-20"
                    />
                </div>

                <div className="flex flex-col gap-2 border-b border-white/5 pb-4">
                    <label className="text-rhum-gold/40 text-[8px] uppercase tracking-[0.4em] font-black">Confirmer le nouveau mot de passe</label>
                    <input
                        type="password"
                        required
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        className="w-full bg-transparent text-white font-serif text-lg lg:text-xl tracking-tight outline-none italic placeholder:opacity-20"
                    />
                </div>

                {status && (
                    <p className={`text-[10px] uppercase tracking-widest ${status.type === 'success' ? 'text-rhum-gold' : 'text-red-400'}`}>
                        {status.msg}
                    </p>
                )}

                <div className="pt-6">
                    <button
                        disabled={loading}
                        className="w-full py-5 bg-rhum-gold text-rhum-green font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-xl disabled:opacity-50"
                    >
                        {loading ? "Mise à jour..." : "Mettre à jour le secret"}
                    </button>
                </div>
            </form>
        </div>
    );
}