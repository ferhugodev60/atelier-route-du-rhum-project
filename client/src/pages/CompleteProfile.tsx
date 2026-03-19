import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Landmark, User as UserIcon, ArrowRight } from 'lucide-react';
import {useAuthStore} from "../store/authStore.ts";
import api from "../api/axiosInstance.ts";

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { user, setAuth, token } = useAuthStore();

    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // États de qualification
    const [isPro, setIsPro] = useState(false);
    const [isEmployee, setIsEmployee] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            companyName: isPro || isEmployee ? data.companyName : null,
            siret: isPro || isEmployee ? data.siret : null,
            isEmployee: isEmployee
        };

        try {
            const response = await api.post('/auth/complete-profile', payload);

            // 🏺 MISE À JOUR DU REGISTRE LOCAL
            // On met à jour l'utilisateur dans le store avec ses nouvelles coordonnées
            if (user && token) {
                setAuth(response.data.user, token);
            }

            // Redirection finale vers la boutique
            navigate('/boutique');
        } catch (err: any) {
            setError(err.response?.data?.error || "Le Registre n'a pas pu sceller votre profil.");
        } finally {
            setIsPending(false);
        }
    };

    const labelStyle = "text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-rhum-gold font-black mb-2 block ml-1";
    const inputStyle = "w-full bg-white/[0.03] border border-white/10 border-b-rhum-gold/50 py-4 px-5 text-white outline-none focus:border-rhum-gold focus:bg-white/[0.06] transition-all text-base placeholder:text-white/30 font-medium rounded-sm";

    return (
        <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center p-6 font-sans selection:bg-rhum-gold selection:text-rhum-green">
            {/* Décor architectural en arrière-plan */}
            <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rhum-gold/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-rhum-gold/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-2xl w-full bg-[#0a1a14] border border-rhum-gold/20 p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-sm"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rhum-gold/40 to-transparent" />

                <header className="text-center mb-12">
                    <span className="text-rhum-gold text-[10px] uppercase tracking-[0.6em] mb-4 block font-black">Finalisation du Registre</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tighter leading-none">
                        Certifiez votre <span className="text-rhum-gold">Rang</span>
                    </h1>
                    <p className="text-white/40 text-[10px] md:text-[12px] mt-6 uppercase tracking-[0.2em] italic font-medium">
                        "Pour accéder aux essences de la collection, l'Établissement doit connaître votre identité métier."
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* 🏺 SÉLECTION DU RANG */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => { setIsPro(false); setIsEmployee(false); }}
                            className={`flex flex-col items-center justify-center gap-4 p-8 border transition-all duration-500 group ${!isPro && !isEmployee ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                        >
                            <UserIcon size={24} strokeWidth={1.5} className={!isPro && !isEmployee ? 'text-rhum-green' : 'text-white/20 group-hover:text-rhum-gold'} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Particulier</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsPro(true)}
                            className={`flex flex-col items-center justify-center gap-4 p-8 border transition-all duration-500 group ${isPro ? 'bg-rhum-gold text-rhum-green border-rhum-gold' : 'border-white/10 text-white/30 hover:border-white/20'}`}
                        >
                            <Landmark size={24} strokeWidth={1.5} className={isPro ? 'text-rhum-green' : 'text-white/20 group-hover:text-rhum-gold'} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Entreprise / CSE</span>
                        </button>
                    </div>

                    {/* 🏺 OPTION SALARIÉ (Si pas Pro direct) */}
                    {!isPro && (
                        <div className="py-4 px-6 bg-white/[0.02] border border-white/5 rounded-sm">
                            <label className="flex items-center gap-5 cursor-pointer group">
                                <div
                                    onClick={() => setIsEmployee(!isEmployee)}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 border ${isEmployee ? 'bg-rhum-gold border-rhum-gold' : 'bg-transparent border-white/20'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isEmployee ? 'left-7' : 'left-1'}`} />
                                </div>
                                <span className="text-[10px] text-white/40 uppercase tracking-[0.15em] font-black group-hover:text-rhum-gold transition-colors">
                                    Je suis salarié rattaché à un Comité d'Entreprise
                                </span>
                            </label>
                        </div>
                    )}

                    {/* 🏺 FORMULAIRE PROFESSIONNEL DYNAMIQUE */}
                    {(isPro || isEmployee) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8 pt-4 border-t border-white/5"
                        >
                            <div className="space-y-2">
                                <label className={labelStyle}>Raison Sociale</label>
                                <input name="companyName" required placeholder="NOM DE L'ENTREPRISE" className={inputStyle} />
                            </div>
                            <div className="space-y-2">
                                <label className={labelStyle}>Numéro SIRET</label>
                                <input name="siret" required pattern="[0-9]{14}" placeholder="000 000 000 00000" className={inputStyle} />
                            </div>
                        </motion.div>
                    )}

                    {error && (
                        <p className="text-red-400 text-[11px] uppercase tracking-[0.2em] text-center bg-red-400/5 py-5 border border-red-400/20 font-black italic">
                            {error}
                        </p>
                    )}

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full bg-rhum-gold text-rhum-green py-6 font-black uppercase tracking-[0.4em] text-[12px] hover:bg-white transition-all flex items-center justify-center gap-4 group ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isPending ? 'SCELLAGE DU PROFIL...' : (
                                <>
                                    Confirmer mon statut
                                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <footer className="mt-16 pt-10 border-t border-white/5 flex items-center justify-center gap-3">
                    <ShieldCheck size={14} className="text-rhum-gold/40" />
                    <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-medium">Certification sécurisée par le Registre de l'Établissement</span>
                </footer>
            </motion.div>
        </div>
    );
}