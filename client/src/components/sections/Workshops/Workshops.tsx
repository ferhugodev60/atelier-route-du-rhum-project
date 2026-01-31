import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx';
import ShopBanner from './ShopBanner.tsx';
import { WorkshopDetail } from "../../../data/workshops.ts";
import WorkshopModal from "./WorkshopModal.tsx";
import ReservationModal from "./ReservationModal.tsx";
import BusinessWorkshopCard from "./BusinessWorkshopCard.tsx";
import BusinessSelectionModal from "./BusinessSelectionModal.tsx";

interface WorkshopsProps {
    onAddToCart: (item: any, qty: number) => void;
}

export default function Workshops({ onAddToCart }: WorkshopsProps) {
    const [activeDetail, setActiveDetail] = useState<WorkshopDetail | null>(null);
    const [reservationData, setReservationData] = useState<any | null>(null);
    const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);

    const handleConfirmReservation = (data: any) => {
        const finalName = data.title || data.name || "Atelier Alchimie";
        onAddToCart({
            id: `${finalName.replace(/\s+/g, '_')}-${Date.now()}`,
            name: finalName,
            price: data.price,
            image: data.image,
            type: "Atelier",
            participants: data.participants
        }, data.quantity);
        setReservationData(null);
    };

    /**
     * CORRECTION : Reçoit l'objet workshopData de BusinessSelectionModal
     * et l'injecte dans reservationData pour ouvrir ReservationModal
     */
    const handleBusinessSelectionComplete = (workshopData: any) => {
        setIsBusinessModalOpen(false);
        setReservationData(workshopData);
    };

    return (
        <section id="workshops" className="py-16 md:py-32 bg-[#0a1a14] px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4 font-bold">Nos Formules & Boutique</h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-white">La Carte de l'Atelier</h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 items-stretch">
                    <WorkshopCard onReserve={(workshop) => setReservationData(workshop)} />
                    <ConceptionCard onOpenDetail={setActiveDetail} />
                </div>

                <BusinessWorkshopCard onContact={() => setIsBusinessModalOpen(true)} />

                <div className="">
                    <div className="flex flex-col items-center text-center mb-10">
                        <span className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-[10px] font-black mb-2">La boutique</span>
                        <h4 className="text-2xl md:text-4xl font-serif text-white">Retrait à l'Atelier</h4>
                    </div>
                    <ShopBanner />
                </div>

                <AnimatePresence>
                    {activeDetail && (
                        <WorkshopModal detail={activeDetail} onClose={() => setActiveDetail(null)} onReserve={(workshop) => { setActiveDetail(null); setReservationData(workshop); }} />
                    )}
                    {reservationData && (
                        <ReservationModal workshop={reservationData} onClose={() => setReservationData(null)} onConfirm={handleConfirmReservation} />
                    )}
                    {isBusinessModalOpen && (
                        <BusinessSelectionModal isOpen={isBusinessModalOpen} onClose={() => setIsBusinessModalOpen(false)} onSelectionComplete={handleBusinessSelectionComplete} />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}