import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';

/**
 * 🏺 INTERFACE DE CERTIFICATION "ZÉRO FRICTION"
 * Scelle la présence et oriente l'utilisateur vers la finalisation de son compte.
 */
export default function ValidationPage() {
    const { participantId } = useParams<{ participantId: string }>();

    // État du Registre
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // Pilotage de la transaction
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    /** 🏺 DÉCLENCHEUR DU TÉLÉCHARGEMENT DU CERTIFICAT OFFICIEL */
    const handleDownloadCertification = () => {
        const downloadUrl = `${api.defaults.baseURL}/public/participants/certification-pdf/${participantId}`;
        window.open(downloadUrl, '_blank');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // Communication avec le Registre pour sceller les informations
            await api.post(`/public/participants/validate/${participantId}`, formData);
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data?.error || "Le registre refuse ce scellage.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    /* 🏺 ÉCRAN DE RÉUSSITE ÉPURÉ */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-10 max-w-lg w-full bg-white/[0.02] border border-rhum-gold/30 p-10 md:p-16 shadow-2xl"
                    >
                        <div className="w-20 h-20 border-2 border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-rhum-gold text-3xl font-serif">✓</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Certification Scellée</h2>
                            <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.4em] font-black">
                                Bienvenue dans l'Établissement
                            </p>
                        </div>

                        {/* 🏺 Message sur les avantages Entreprise */}
                        <div className="py-6 border-y border-white/5">
                            <p className="text-white/80 text-[13px] leading-relaxed uppercase tracking-wider font-medium">
                                Grâce à votre entreprise, ce code vous offre <br/>
                                <span className="text-rhum-gold font-bold">10% sur toute la boutique</span> <br/>
                                et des réductions sur nos ateliers.
                            </p>
                        </div>

                        <p className="text-white/40 text-[11px] leading-loose uppercase tracking-[0.15em]">
                            Un email vient de vous être envoyé <br/>
                            pour la <strong className="text-white/70">finalisation de votre compte</strong>.
                        </p>

                        <div className="pt-4 flex flex-col gap-4">
                            <button
                                onClick={handleDownloadCertification}
                                className="w-full bg-rhum-gold text-[#0a1a14] py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl rounded-sm"
                            >
                                Télécharger ma Confirmation (PDF)
                            </button>

                            <p className="text-[9px] text-white/20 uppercase tracking-widest italic">
                                Ce document contient vos informations de Séance.
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    /* 🏺 FORMULAIRE D'IDENTIFICATION SIMPLIFIÉ */
                    <motion.div
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg"
                    >
                        <header className="text-center mb-12">
                            <p className="text-rhum-gold text-[10px] uppercase tracking-[0.5em] mb-3 font-black">Infrastructure</p>
                            <h2 className="text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">Enregistrement</h2>
                            <p className="text-white/40 text-[11px] mt-4 uppercase tracking-widest italic leading-relaxed">
                                Scellez votre présence à la séance pour recevoir <br/>votre certificat et vos avantages membres.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-sm space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Nom</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="EX: DUPONT"
                                        className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors font-bold uppercase text-sm placeholder:text-white/10"
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Prénom</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="EX: JEAN"
                                        className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors font-bold uppercase text-sm placeholder:text-white/10"
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Email de contact</label>
                                <input
                                    required
                                    type="email"
                                    placeholder="VOTRE@EMAIL.COM"
                                    className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors font-bold text-sm placeholder:text-white/10"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block opacity-70">Téléphone</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="06 00 00 00 00"
                                    className="w-full bg-white/5 border-b border-white/20 p-4 text-white outline-none focus:border-rhum-gold transition-colors font-bold text-sm placeholder:text-white/10"
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-400 text-[10px] uppercase font-black text-center bg-red-400/5 py-3 border border-red-400/20 tracking-widest leading-loose">
                                    {errorMessage}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-rhum-gold text-[#0a1a14] py-6 font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white transition-all duration-700 disabled:opacity-30 rounded-sm shadow-2xl"
                            >
                                {status === 'submitting' ? 'SCELLAGE AU REGISTRE...' : 'Valider ma Certification'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}