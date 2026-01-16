import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WorkshopCard from './WorkshopCard';
import ConceptionCard from './ConceptionCard';
import ShopBanner from './ShopBanner';
import { WorkshopDetail } from "../../../data/workshops.ts";
import WorkshopModal from "./WorkshopModal.tsx";
import ReservationModal from "./ReservationModal.tsx"; // Importation de la nouvelle modale

interface WorkshopsProps {
    onAddToCart: (item: any, qty: number) => void;
}

export default function Workshops({ onAddToCart }: WorkshopsProps) {
    // État pour la modale d'information (Détails des étapes de conception)
    const [activeDetail, setActiveDetail] = useState<WorkshopDetail | null>(null);

    // État pour la modale de réservation (Saisie des participants)
    const [reservationData, setReservationData] = useState<any | null>(null);

    /**
     * Finalise la réservation et ajoute l'atelier au panier global
     * @param data Données complètes incluant le nombre de personnes et la liste des participants
     */
    const handleConfirmReservation = (data: any) => {
        onAddToCart({
            id: `${data.title}-${Date.now()}`, // Identifiant unique pour différencier les réservations
            name: data.title,
            price: parseInt(data.price),
            image: data.image,
            type: "Atelier",
            quantity: data.quantity, // Nombre de personnes sélectionné
            participants: data.participants // Liste [Nom, Prénom, Tel] par personne
        }, data.quantity);

        setReservationData(null); // Fermeture de la modale après validation
    };

    return (
        <section id="workshops" className="py-16 md:py-24 bg-white px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-12 md:mb-20">
                    <h2 className="text-rhum-gold font-sans tracking-[0.2em] uppercase text-xs md:text-sm mb-3 md:mb-4 font-bold">
                        Nos Formules & Boutique
                    </h2>
                    <h3 className="text-3xl md:text-5xl font-serif text-rhum-green">La Carte de l'Atelier</h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-stretch">
                    {/* Découverte : Ouvre directement la modale de réservation */}
                    <WorkshopCard
                        onReserve={(workshop) => setReservationData(workshop)}
                    />

                    {/* Conception : Ouvre d'abord la modale de détails */}
                    <ConceptionCard
                        onOpenDetail={setActiveDetail}
                    />
                </div>

                <ShopBanner />

                <AnimatePresence>
                    {/* 1. Modale d'information (Détails techniques des étapes) */}
                    {activeDetail && (
                        <WorkshopModal
                            detail={activeDetail}
                            onClose={() => setActiveDetail(null)}
                            // Si l'utilisateur clique sur "Réserver" dans les détails, on ouvre la saisie participants
                            onReserve={(workshop) => {
                                setActiveDetail(null);
                                setReservationData(workshop);
                            }}
                        />
                    )}

                    {/* 2. Modale de réservation (Saisie dynamique des participants) */}
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