import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from "../../store/toastStore.ts";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();
    const { clearCart } = useCartStore();
    const addToast = useToastStore(state => state.addToast);

    const isSuccess = searchParams.get('payment_success') === 'true';

    useEffect(() => {
        if (isSuccess) {
            // Synchronisation des données utilisateur suite au paiement
            checkAuth();
            // Réinitialisation du panier local
            clearCart();

            console.log("Paiement réussi : Panier réinitialisé et profil mis à jour.");
            addToast("Votre commande a été enregistrée avec succès.");
        }
    }, [isSuccess, checkAuth, clearCart, addToast]);

    if (!isSuccess) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a1a14] p-6 text-center"
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rhum-gold/20 via-transparent to-transparent" />

            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative max-w-md w-full border border-rhum-gold/20 bg-black/40 p-12 backdrop-blur-xl shadow-2xl"
            >
                {/* Icône de confirmation */}
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
                        Paiement Confirmé
                    </p>
                    <h2 className="text-3xl md:text-5xl font-serif text-white uppercase tracking-tight">
                        Commande Validée
                    </h2>
                    <div className="h-px w-12 bg-rhum-gold/30 mx-auto mt-4" />
                </header>

                <p className="text-rhum-cream/60 font-serif italic text-lg mb-10 leading-relaxed">
                    Votre transaction a été traitée avec succès. Vous pouvez désormais consulter vos services depuis votre espace personnel.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/mon-compte')}
                        className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl"
                    >
                        Accéder à mon espace client
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-transparent text-rhum-gold/40 hover:text-white py-3 font-bold uppercase tracking-[0.2em] text-[9px] transition-all"
                    >
                        Retourner à l'accueil
                    </button>
                </div>

                <p className="mt-8 text-[8px] text-white/20 uppercase tracking-widest font-bold">
                    Une confirmation a été envoyée à votre adresse e-mail.
                </p>
            </motion.div>
        </motion.div>
    );
}