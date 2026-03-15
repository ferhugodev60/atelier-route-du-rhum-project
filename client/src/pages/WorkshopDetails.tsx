import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Clock,
    Calendar,
    ArrowRight,
    Info,
    Lock
} from 'lucide-react';
import api from '../api/axiosInstance';
import { Workshop } from '../types/workshop';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

// 🏺 Importation des Modales Techniques
import ReservationModal from '../components/sections/Workshops/ReservationModal.tsx';
import BusinessReservationModal from '../components/sections/Workshops/BusinessReservationModal.tsx';

export default function WorkshopDetails() {
    const { id } = useParams();
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
                const { data } = await api.get(`/workshops/${id}`);
                setWorkshop(data);
            } catch (err) { navigate('/ateliers'); }
            finally { setLoading(false); }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading || !workshop) return <div className="min-h-screen bg-[#0a1a14]" />;

    // 🏺 Vérification du droit d'accès au palier (Niveau n-1 requis)
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
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#0a1a14] pt-32 md:pt-48 pb-20 font-sans">
            <div className="max-w-7xl mx-auto px-4 md:px-8">

                {/* NAVIGATION */}
                <Link to={workshop.level === 0 ? "/" : "/atelier-conception"}
                      className="group inline-flex items-center gap-2 text-rhum-gold/60 hover:text-rhum-gold transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-12"
                >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Retour
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    <div className="lg:col-span-7 space-y-12">
                        <div className="relative aspect-video lg:aspect-[16/10] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                            <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-rhum-gold font-serif italic text-2xl flex items-center gap-3">
                                <Info size={20} strokeWidth={1.5} />
                                Immersion Technique
                            </h2>
                            <p className="text-white/90 text-lg md:text-xl leading-relaxed font-serif italic">
                                {workshop.fullDescription || workshop.description}
                            </p>
                        </div>
                    </div>

                    <aside className="lg:col-span-5 lg:sticky lg:top-32">
                        <div className="bg-[#081c15] border border-rhum-gold/30 p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                            <header className="mb-10">
                                <span className="text-rhum-gold text-[10px] font-black uppercase tracking-[0.4em] block mb-4">
                                    {isPro ? "Dossier Entreprise" : (workshop.level === 0 ? "Module Découverte" : `Niveau ${workshop.level}`)}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-tighter mb-4">{workshop.title}</h1>
                                <p className="text-rhum-gold font-serif italic text-lg">"{workshop.quote}"</p>
                            </header>

                            <div className="space-y-6 mb-12 border-y border-white/10 py-10">
                                <div className="flex items-start gap-5">
                                    <Clock className="text-rhum-gold mt-1" size={18} />
                                    <div>
                                        <p className="text-[9px] font-black text-rhum-gold uppercase tracking-widest mb-1">Format & Durée</p>
                                        <p className="text-white text-sm font-bold uppercase">{workshop.format}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-5">
                                    <Calendar className="text-rhum-gold mt-1" size={18} />
                                    <div>
                                        <p className="text-[9px] font-black text-rhum-gold uppercase tracking-widest mb-1">Validité du Titre</p>
                                        <p className="text-white text-sm font-bold uppercase">{workshop.availability}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-baseline justify-between">
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Tarif</span>
                                    <div className="text-right">
                                        <span className="text-4xl md:text-6xl font-serif text-white">{displayPrice}€</span>
                                    </div>
                                </div>

                                {isLockedForUser ? (
                                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-sm flex items-center gap-4">
                                        <Lock className="text-red-500 shrink-0" size={20} />
                                        <p className="text-[10px] text-red-200 uppercase font-black leading-relaxed tracking-widest">
                                            Accès Verrouillé : Vous devez valider le palier précédent pour débloquer cette séance.
                                        </p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            if(!user) return setLoginOpen(true);
                                            setShowModal(true);
                                        }}
                                        className="w-full bg-rhum-gold text-rhum-green py-5 font-black uppercase tracking-[0.4em] text-[11px] hover:bg-white transition-all shadow-xl rounded-sm flex items-center justify-center gap-3 group"
                                    >
                                        Réserver
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* 🏺 DÉPLOIEMENT DES MODALES TECHNIQUES */}
            <AnimatePresence>
                {showModal && (
                    isPro ? (
                        <BusinessReservationModal
                            workshop={workshop}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleConfirmReservation}
                        />
                    ) : (
                        <ReservationModal
                            workshop={workshop}
                            onClose={() => setShowModal(false)}
                            onConfirm={handleConfirmReservation}
                        />
                    )
                )}
            </AnimatePresence>
        </motion.main>
    );
}