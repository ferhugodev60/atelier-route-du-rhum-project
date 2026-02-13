import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useToastStore } from "../../store/toastStore.ts";
import api from '../../api/axiosInstance';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();
    const { clearCart } = useCartStore();
    const addToast = useToastStore(state => state.addToast);
    const [lastOrder, setLastOrder] = useState<any>(null);

    const isSuccess = searchParams.get('payment_success') === 'true';

    useEffect(() => {
        if (isSuccess) {
            checkAuth();
            clearCart();

            // Récupération de la dernière commande pour le PDF
            const fetchLastOrder = async () => {
                try {
                    const res = await api.get('/orders');
                    if (res.data.length > 0) setLastOrder(res.data[0]);
                } catch (e) {
                    console.error("Erreur lors de la récupération de la commande");
                }
            };
            fetchLastOrder();
            addToast("Votre commande a été enregistrée avec succès.");
        }
    }, [isSuccess, checkAuth, clearCart, addToast]);

    const handleDownloadPDF = async () => {
        if (!lastOrder) return;
        try {
            const response = await api.get(`/orders/${lastOrder.id}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Commande_${lastOrder.reference}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            addToast("Erreur lors du téléchargement du document.", "error");
        }
    };

    if (!isSuccess) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a1a14] p-6 text-center">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rhum-gold/20 via-transparent to-transparent" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative max-w-md w-full border border-rhum-gold/20 bg-black/40 p-12 backdrop-blur-xl shadow-2xl">
                <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }} className="w-24 h-24 border-2 border-rhum-gold rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <span className="text-rhum-gold text-4xl">✓</span>
                </motion.div>

                <header className="space-y-4 mb-10">
                    <p className="text-rhum-gold/60 text-[10px] uppercase tracking-[0.5em] font-black">Paiement Confirmé</p>
                    <h2 className="text-3xl font-serif text-white uppercase">Commande Validée</h2>
                </header>

                <p className="text-rhum-cream/60 font-serif italic text-lg mb-10 leading-relaxed">
                    Votre transaction a été traitée avec succès. Un e-mail récapitulatif vient de vous être envoyé.
                </p>

                <div className="space-y-4">
                    {lastOrder && (
                        <button
                            onClick={handleDownloadPDF}
                            className="w-full border border-rhum-gold text-rhum-gold py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rhum-gold/10 transition-all shadow-xl"
                        >
                            Télécharger le récapitulatif PDF
                        </button>
                    )}
                    <button onClick={() => navigate('/mon-compte')} className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-xl">Accéder à mon espace client</button>
                    <button onClick={() => navigate('/')} className="w-full bg-transparent text-rhum-gold/40 hover:text-white py-3 font-bold uppercase tracking-[0.2em] text-[9px] transition-all">Retourner à l'accueil</button>
                </div>
            </motion.div>
        </motion.div>
    );
}