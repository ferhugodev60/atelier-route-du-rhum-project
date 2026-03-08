import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../../api/axiosInstance';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx';
import ShopBanner from './ShopBanner.tsx';
import GiftBanner from './GiftBanner.tsx';
import GiftModal from './GiftModal.tsx';
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
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();
    const isPro = user?.role === 'PRO';

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                // 🏺 Extraction du programme technique consolidé
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

    // 🏺 Tri par palier technique pour une lecture cohérente du Cursus
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
            isBusiness: isPro
        }, data.quantity);
        setReservationData(null);
    };

    /**
     * 🏺 SCELLAGE DU TITRE DE CURSUS
     * Ajoute la carte cadeau au panier avec le montant défini en modale.
     */
    const handleConfirmGift = (amount: number) => {
        onAddToCart({
            type: 'GIFT_CARD',
            price: amount,
            amount: amount,
            quantity: 1,
            name: "CARTE CADEAU ÉTABLISSEMENT",
            cartId: `GIFT-${Date.now()}`
        }, 1);
        setIsGiftModalOpen(false);
    };

    const discoveryWorkshop = sortedWorkshops.find(w => w.level === 0);
    const conceptionWorkshops = sortedWorkshops.filter(w => w.level > 0);

    if (loading) return (
        <div className="py-20 text-center text-rhum-gold font-serif uppercase tracking-[0.3em] text-[10px] font-black italic">
            Synchronisation du Registre Cursus...
        </div>
    );

    return (
        <section id="workshops" className="py-16 md:py-32 bg-rhum-cream px-4 md:px-6 overflow-hidden font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold tracking-[0.4em] uppercase text-xs mb-3 md:mb-4 font-black">
                        Nos Prestations
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-[#0a1a14] uppercase">
                        Le Registre des Ateliers
                    </h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 items-stretch">
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

                <div className="mt-20">
                    <GiftBanner onOpenModal={() => setIsGiftModalOpen(true)} />
                </div>

                <AnimatePresence>
                    {/* 🏺 Modale de Détails Techniques */}
                    {activeDetail && (
                        <WorkshopModal
                            detail={activeDetail}
                            onClose={() => setActiveDetail(null)}
                            onReserve={(w) => { setActiveDetail(null); setReservationData(w); }}
                        />
                    )}

                    {/* 🏺 Modale d'Acquisition de Titre Cadeau */}
                    {isGiftModalOpen && (
                        <GiftModal
                            onClose={() => setIsGiftModalOpen(false)}
                            onConfirm={handleConfirmGift}
                        />
                    )}

                    {/* 🏺 Modales de Réservation (Particulier / PRO) */}
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