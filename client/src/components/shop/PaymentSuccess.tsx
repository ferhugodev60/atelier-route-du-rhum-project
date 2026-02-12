import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore(); // 🏺 Pour rafraîchir le niveau de conception

    const isSuccess = searchParams.get('payment_success') === 'true';

    useEffect(() => {
        if (isSuccess) {
            // 🏺 On demande au store de vérifier à nouveau l'identité pour
            // récupérer le nouveau 'conceptionLevel' mis à jour par le Webhook.
            checkAuth();

            // Optionnel : Nettoyer le panier local ici si nécessaire
        }
    }, [isSuccess, checkAuth]);

    if (!isSuccess) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a1a14] p-6 text-center"
        >
            {/* Décoration de fond */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rhum-gold/20 via-transparent to-transparent" />
            </div>

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative max-w-md w-full border border-rhum-gold/20 bg-black/40 p-12 backdrop-blur-xl shadow-2xl"
            >
                {/* Sceau doré animé */}
                <motion.div
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                    className="w-24 h-24 border-2 border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-8 relative"
                >
                    <div className="absolute inset-0 rounded-full animate-ping bg-rhum-gold/10" />
                    <span className="text-rhum-gold text-4xl">✓</span>
                </motion.div>

                <header className="space-y-4 mb-10">
                    <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.5em] font-black">
                        Transaction Scellée
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tight">
                        Ordre Validé
                    </h2>
                    <div className="h-px w-12 bg-rhum-gold/30 mx-auto mt-4" />
                </header>

                <p className="text-rhum-cream/60 font-serif italic text-lg mb-10 leading-relaxed">
                    "Votre parchemin a été enregistré dans l'alambic. Vos nouveaux privilèges sont désormais actifs."
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/mon-compte')}
                        className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl"
                    >
                        Accéder à mon compte
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-transparent text-rhum-gold/40 hover:text-white py-3 font-bold uppercase tracking-[0.2em] text-[9px] transition-all"
                    >
                        Retourner à l'Atelier
                    </button>
                </div>

                {/* Petite note discrète */}
                <p className="mt-8 text-[8px] text-white/20 uppercase tracking-widest font-bold">
                    Un reçu de test a été envoyé à votre adresse e-mail.
                </p>
            </motion.div>
        </motion.div>
    );
}