import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../../api/axiosInstance';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx';
import ShopBanner from './ShopBanner.tsx';
import WorkshopModal from "./WorkshopModal.tsx";
import ReservationModal from "./ReservationModal.tsx";
import { Workshop } from "../../../types/workshop.ts";

interface WorkshopsProps {
    onAddToCart: (item: any, qty: number) => void;
}

export default function Workshops({ onAddToCart }: WorkshopsProps) {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [activeDetail, setActiveDetail] = useState<Workshop | null>(null);
    const [reservationData, setReservationData] = useState<Workshop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const { data } = await api.get('/shop/workshops');
                setWorkshops(data);
            } catch (err) {
                console.error("Erreur lors de la lecture des parchemins :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    const handleConfirmReservation = (data: any) => {
        // 🏺 On force le titre et le niveau pour l'affichage du panier
        onAddToCart({
            ...data,
            cartId: `${data.id || data.workshopId}-${Date.now()}`,
            name: data.title || data.name,
            level: data.level,
            quantity: data.quantity
        }, data.quantity);

        setReservationData(null);
    };

    const discoveryWorkshop = workshops.find(w => w.level === 0);
    const conceptionWorkshops = workshops.filter(w => w.level > 0).sort((a, b) => a.level - b.level);

    if (loading) return <div className="py-20 text-center text-rhum-gold font-serif italic">Chargement des grimoires...</div>;

    return (
        <section id="workshops" className="py-16 md:py-32 bg-[#0a1a14] px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4 font-bold">Nos Formules</h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tighter">La Carte de l'Atelier</h3>
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
                    <div className="flex flex-col items-center text-center mb-10">
                        <span className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-[10px] font-black mb-2">La boutique</span>
                        <h4 className="text-2xl md:text-4xl font-serif text-white uppercase">Retrait à l'Atelier</h4>
                    </div>
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
                        <ReservationModal
                            workshop={reservationData}
                            onClose={() => setReservationData(null)}
                            onConfirm={handleConfirmReservation}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}