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
    const isPro = user?.role === 'PRO';

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                // 🏺 Extraction du catalogue consolidé
                const { data } = await api.get('/workshops');
                setWorkshops(data);
            } catch (err) {
                console.error("Erreur lors de l'extraction du programme :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    // 🏺 CORRECTION : On ne filtre plus par type, on trie par palier technique
    const sortedWorkshops = useMemo(() => {
        return [...workshops].sort((a, b) => a.level - b.level);
    }, [workshops]);

    const handleConfirmReservation = (data: any) => {
        onAddToCart({
            ...data,
            cartId: `${data.id || data.workshopId || 'ws'}-${Date.now()}`,
            name: data.title || data.name,
            level: data.level,
            quantity: data.quantity,
            isBusiness: isPro // Un compte PRO achète toujours en volume Business
        }, data.quantity);
        setReservationData(null);
    };

    // 🏺 Répartition des paliers techniques
    const discoveryWorkshop = sortedWorkshops.find(w => w.level === 0);
    const conceptionWorkshops = sortedWorkshops.filter(w => w.level > 0);

    if (loading) return (
        <div className="py-20 text-center text-rhum-gold font-serif uppercase tracking-[0.3em] text-[10px] font-black">
            Analyse du programme technique...
        </div>
    );

    return (
        <section id="workshops" className="py-16 md:py-32 bg-rhum-cream px-4 md:px-6 overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold tracking-[0.4em] uppercase text-xs mb-3 md:mb-4 font-black">
                        {isPro ? "Architecture Institutionnelle" : "Nos Séances & Boutique"}
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-[#0a1a14] uppercase">
                        Le Registre des Ateliers
                    </h3>
                    {isPro && (
                        <p className="text-[#0a1a14]/60 mt-4 italic font-serif">
                            Ravi de vous revoir, {user?.companyName}. Vos tarifs privilèges sont appliqués.
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