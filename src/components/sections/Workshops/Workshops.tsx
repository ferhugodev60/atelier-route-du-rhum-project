import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WorkshopCard from './WorkshopCard';
import ConceptionCard from './ConceptionCard';
import ShopBanner from './ShopBanner';
import { WorkshopDetail } from "../../../data/workshops.ts";
import WorkshopModal from "./WorkshopModal.tsx";
import ReservationModal from "./ReservationModal.tsx";

interface WorkshopsProps {
    onAddToCart: (item: any, qty: number) => void;
}

export default function Workshops({ onAddToCart }: WorkshopsProps) {
    const [activeDetail, setActiveDetail] = useState<WorkshopDetail | null>(null);
    const [reservationData, setReservationData] = useState<any | null>(null);

    const handleConfirmReservation = (data: any) => {
        /** * CORRECTION : On s'assure que le nom de l'atelier est transmis via 'name'
         * On utilise data.title (venant de Conception) ou data.name (venant de Découverte).
         */
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

    const scheduleSlots = [
        "10h - 11h30",
        "12h - 13h30",
        "14h - 15h30",
        "16h - 17h30",
        "18h - 19h30"
    ];

    return (
        <section id="workshops" className="py-16 md:py-32 bg-[#0a1a14] px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-3 md:mb-4 font-bold">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-white">La Carte de l'Atelier</h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-stretch">
                    <WorkshopCard onReserve={(workshop) => setReservationData(workshop)} />
                    <ConceptionCard onOpenDetail={setActiveDetail} />
                </div>

                <div className="mb-20 md:mb-32">
                    <div className="flex flex-col items-center text-center mb-10">
                        <span className="text-rhum-gold font-sans tracking-[0.3em] uppercase text-[10px] font-black mb-2">
                            Horaires des ateliers
                        </span>
                        <h4 className="text-2xl md:text-4xl font-serif text-white">Mardi au Samedi</h4>
                        <div className="w-12 h-px bg-rhum-gold/40 mt-4" />
                    </div>

                    <div className="flex flex-wrap justify-center md:grid md:grid-cols-5 gap-3 md:gap-4">
                        {scheduleSlots.map((slot, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="w-[calc(50%-6px)] md:w-auto group flex flex-col items-center justify-center py-6 px-2 border border-rhum-gold/30 rounded-sm bg-white/[0.03] hover:bg-rhum-gold transition-all duration-500 cursor-default shadow-2xl"
                            >
                                <span className="text-rhum-gold/60 text-[8px] uppercase tracking-widest mb-2 group-hover:text-[#0a1a14] transition-colors font-bold">
                                    Créneau
                                </span>
                                <span className="text-white font-serif text-base md:text-lg group-hover:text-[#0a1a14] transition-colors font-medium">
                                    {slot}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <ShopBanner />

                <AnimatePresence>
                    {activeDetail && (
                        <WorkshopModal
                            detail={activeDetail}
                            onClose={() => setActiveDetail(null)}
                            onReserve={(workshop) => {
                                setActiveDetail(null);
                                setReservationData(workshop);
                            }}
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