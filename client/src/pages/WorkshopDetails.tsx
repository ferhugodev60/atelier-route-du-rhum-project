import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    ArrowRight,
    Lock,
    ShieldCheck,
    Award
} from 'lucide-react';
import api from '../api/axiosInstance';
import { Workshop } from '../types/workshop';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

import ReservationModal from '../components/sections/Workshops/ReservationModal.tsx';
import BusinessReservationModal from '../components/sections/Workshops/BusinessReservationModal.tsx';

export default function WorkshopDetails() {
    const { level } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, setLoginOpen } = useAuthStore();
    const { addItem } = useCartStore();
    const { addToast } = useToastStore();

    const [workshop, setWorkshop] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const isPro = user?.role === 'PRO';

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchDetails = async () => {
            try {
                const isDecouverte = location.pathname === '/ateliers/decouverte';
                const endpoint = isDecouverte
                    ? '/workshops/decouverte'
                    : `/workshops/conception/${level}`;
                const { data } = await api.get(endpoint);
                setWorkshop(data);
            } catch (err) { navigate('/'); }
            finally { setLoading(false); }
        };
        fetchDetails();
    }, [location.pathname, level, navigate]);

    if (loading || !workshop) return <div className="min-h-screen bg-[#0a1a14]" />;

    const isLockedForUser = workshop.level > 0 && !isPro && (user?.conceptionLevel || 0) < workshop.level - 1;
    const displayPrice = (user?.isEmployee || isPro) ? workshop.priceInstitutional : workshop.price;

    const handleConfirmReservation = (data: any) => {
        addItem(null, {
            ...data,
            cartId: `${data.id || data.workshopId || 'ws'}-${Date.now()}`,
            name: data.title || data.name,
            level: data.level,
            quantity: data.quantity,
            isBusiness: isPro
        }, data.quantity);
        setShowModal(false);
        addToast(`${workshop.title} scellé dans votre Registre.`);
    };

    return (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a1a14] font-sans selection:bg-rhum-gold selection:text-black">

            {/* --- 🏺 HERO HEADER : Lisibilité Renforcée --- */}
            <header className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden border-b border-white/5">
                <motion.div
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />

                    {/* 🏺 DOUBLE MASQUE : Voile global + Dégradé de base intense */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a14] via-[#0a1a14]/80 to-transparent z-10" />
                </motion.div>

                <div className="absolute bottom-0 left-0 w-full z-20 pb-8 md:pb-16">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <span className="text-rhum-gold text-[9px] md:text-xs font-black uppercase tracking-[0.5em] mb-3 block drop-shadow-md">
                                {isPro ? "Atelier Entreprise" : (workshop.level === 0 ? "Expérience Découverte" : `L'Atelier Conception • Niveau ${workshop.level}`)}
                            </span>

                            {/* 🏺 DROP SHADOW : Pour décoller les lettres de l'image de fond */}
                            <h1 className="text-4xl md:text-8xl font-serif text-white uppercase tracking-tighter leading-[0.85] mb-5 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                                {workshop.title}
                            </h1>

                            <p className="text-rhum-gold font-serif text-lg md:text-2xl max-w-2xl leading-tight drop-shadow-lg">
                                {workshop.quote}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* --- 🏺 CORPS DE PAGE (Reste inchangé mais scellé) --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    <div className="lg:col-span-7 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-rhum-gold">
                                <Award size={20} strokeWidth={1.5} />
                                <h2 className="uppercase tracking-[0.3em] text-[10px] font-black">Note de l'Atelier</h2>
                            </div>
                            <p className="text-white text-lg md:text-2xl leading-relaxed font-light font-serif italic">
                                "{workshop.fullDescription || workshop.description}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-white/10">
                            <div className="flex items-start gap-4">
                                <Clock className="text-rhum-gold shrink-0" size={20} strokeWidth={1.5} />
                                <div>
                                    <p className="text-rhum-gold text-[9px] font-black uppercase tracking-widest mb-1.5">Durée de l'atelier</p>
                                    <p className="text-white text-sm font-bold uppercase tracking-wide">{workshop.format}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <Calendar className="text-rhum-gold shrink-0" size={20} strokeWidth={1.5} />
                                <div>
                                    <p className="text-rhum-gold text-[9px] font-black uppercase tracking-widest mb-1.5">Infos / réservation</p>
                                    <p className="text-white text-sm font-bold uppercase tracking-wide">{workshop.availability}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-sm relative overflow-hidden backdrop-blur-md shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-rhum-gold" />

                            <div className="mb-10 text-center">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] block mb-3">Tarif</span>
                                <span className="text-5xl md:text-7xl font-serif text-white tracking-tighter">{displayPrice}€</span>
                            </div>

                            {isLockedForUser ? (
                                <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-sm text-center space-y-3">
                                    <Lock className="text-red-500 mx-auto" size={20} />
                                    <p className="text-[9px] text-red-200 uppercase font-black leading-relaxed tracking-widest">
                                        Accès Verrouillé : Votre cursus actuel ne permet pas encore de sceller ce palier.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <button
                                        onClick={() => {
                                            if(!user) return setLoginOpen(true);
                                            setShowModal(true);
                                        }}
                                        className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] hover:bg-white transition-all shadow-2xl rounded-sm flex items-center justify-center gap-4 group"
                                    >
                                        Réserver
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>

                                    <div className="flex items-center justify-center gap-3 text-white/40">
                                        <ShieldCheck size={12} />
                                        <span className="text-[8px] uppercase tracking-widest font-bold">Paiement sécurisé via Stripe</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    isPro ? (
                        <BusinessReservationModal workshop={workshop} onClose={() => setShowModal(false)} onConfirm={handleConfirmReservation} />
                    ) : (
                        <ReservationModal workshop={workshop} onClose={() => setShowModal(false)} onConfirm={handleConfirmReservation} />
                    )
                )}
            </AnimatePresence>
        </motion.main>
    );
}