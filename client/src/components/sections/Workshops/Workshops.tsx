import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../../api/axiosInstance';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx';
import ShopBanner from './ShopBanner.tsx';
import WorkshopModal from "./WorkshopModal.tsx";
import ReservationModal from "./ReservationModal.tsx";
import BusinessReservationModal from "./BusinessReservationModal.tsx";
import { Workshop } from "../../../types/workshop.ts";
import { useAuthStore } from "../../../store/authStore";

interface WorkshopsProps {
    onAddToCart: (item: any, qty: number) => void;
}

export default function Workshops({ onAddToCart }: WorkshopsProps) {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [activeDetail, setActiveDetail] = useState<Workshop | null>(null);
    const [reservationData, setReservationData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    // 🏺 Détermination du profil institutionnel
    const isPro = user?.role === 'PRO';

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const { data } = await api.get('/shop/workshops');
                setWorkshops(data);
            } catch (err) {
                console.error("Erreur lors de l'extraction du programme :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    const displayedWorkshops = useMemo(() => {
        const targetType = isPro ? 'ENTREPRISE' : 'PARTICULIER';
        return workshops.filter(w => w.type === targetType);
    }, [workshops, isPro]);

    const handleConfirmReservation = (data: any) => {
        onAddToCart({
            ...data,
            cartId: `${data.id || data.workshopId || 'ws'}-${Date.now()}`,
            name: data.title || data.name,
            level: data.level,
            quantity: data.quantity,
            isBusiness: data.isBusiness || isPro
        }, data.quantity);
        setReservationData(null);
    };

    const discoveryWorkshop = displayedWorkshops.find(w => w.level === 0);
    const conceptionWorkshops = displayedWorkshops
        .filter(w => w.level > 0)
        .sort((a, b) => a.level - b.level);

    if (loading) return (
        <div className="py-20 text-center text-rhum-gold font-serif uppercase tracking-[0.3em] text-[10px] font-black">
            Analyse du programme technique...
        </div>
    );

    return (
        /* 🏺 Fond passé en blanc pour une clarté maximale */
        <section id="workshops" className="py-16 md:py-32 bg-rhum-cream px-4 md:px-6 overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold tracking-[0.4em] uppercase text-xs mb-3 md:mb-4 font-black">
                        {isPro ? "Offres entreprise" : "Nos Ateliers & Boutique"}
                    </h2>
                    {/* 🏺 Titre passé en sombre pour le contraste sur fond blanc */}
                    <h3 className="text-4xl md:text-6xl font-serif text-[#0a1a14]">
                        Le Registre des Ateliers
                    </h3>
                    {isPro && (
                        <p className="mt-6 text-rhum-gold/80 font-serif italic text-lg">
                            Ravi de vous revoir, {user?.companyName}.
                        </p>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20 items-stretch">
                    {discoveryWorkshop && (
                        <WorkshopCard
                            workshop={discoveryWorkshop}
                            onReserve={(w) => setReservationData(w)}
                        />
                    )}

                    <ConceptionCard
                        workshops={conceptionWorkshops}
                        onOpenDetail={setActiveDetail}
                    />
                </div>

                <div className="mt-20">
                    <ShopBanner />
                </div>

                <AnimatePresence>
                    {activeDetail && (
                        <WorkshopModal
                            detail={activeDetail}
                            onClose={() => setActiveDetail(null)}
                            onReserve={(w) => { setActiveDetail(null); setReservationData(w); }}
                        />
                    )}

                    {reservationData && (
                        isPro ? (
                            <BusinessReservationModal
                                workshop={reservationData}
                                onClose={() => setReservationData(null)}
                                onConfirm={handleConfirmReservation}
                            />
                        ) : (
                            <ReservationModal
                                workshop={reservationData}
                                onClose={() => setReservationData(null)}
                                onConfirm={handleConfirmReservation}
                            />
                        )
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}