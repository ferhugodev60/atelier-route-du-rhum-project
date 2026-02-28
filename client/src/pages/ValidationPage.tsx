import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';

/**
 * 🏺 INTERFACE DE CERTIFICATION INSTITUTIONNELLE
 * Permet au participant de sceller sa présence après scan du QR Code.
 */
export default function ValidationPage() {
    const { participantId } = useParams<{ participantId: string }>();

    // État du formulaire
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    // État de la transaction avec le Registre
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            // 🏺 Scellage des données auprès de l'infrastructure backend
            await api.post(`/public/participants/validate/${participantId}`, formData);
            setStatus('success');
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.response?.data || "Erreur lors du scellage au registre.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1a14] flex items-center justify-center p-4">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 max-w-md"
                    >
                        <div className="w-20 h-20 border-2 border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-8">
                            <span className="text-rhum-gold text-3xl">✓</span>
                        </div>
                        <h2 className="text-3xl font-serif text-white uppercase tracking-tight">Présence Scellée</h2>
                        <p className="text-white/60 text-sm leading-relaxed uppercase tracking-widest font-bold">
                            Merci {formData.firstName}, votre participation à la séance a été gravée dans notre registre officiel.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg"
                    >
                        <header className="text-center mb-12">
                            <h2 className="text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">Certification</h2>
                            <p className="text-rhum-gold text-[10px] uppercase tracking-[0.4em] mt-3 font-black opacity-70">
                                Enregistrement au Registre
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-sm space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block">Nom</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border-b border-white/20 p-3 text-white outline-none focus:border-rhum-gold transition-colors font-bold uppercase text-sm"
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block">Prénom</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border-b border-white/20 p-3 text-white outline-none focus:border-rhum-gold transition-colors font-bold uppercase text-sm"
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block">Email de contact</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-white/5 border-b border-white/20 p-3 text-white outline-none focus:border-rhum-gold transition-colors font-bold text-sm"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] text-rhum-gold font-black uppercase tracking-widest block">Téléphone</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-white/5 border-b border-white/20 p-3 text-white outline-none focus:border-rhum-gold transition-colors font-bold text-sm"
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-400 text-[10px] uppercase font-black text-center">{errorMessage}</p>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-rhum-gold text-[#0a1a14] py-5 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all duration-500 disabled:opacity-30 rounded-sm"
                            >
                                {status === 'submitting' ? 'Communication avec le Registre...' : 'Valider ma Certification'}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}