import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import api from '../../../api/axiosInstance';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx'; // Assurez-vous d'y ajouter le bouton "Savoir plus" également
import ShopBanner from './ShopBanner.tsx';
import GiftBanner from './GiftBanner.tsx';
import GiftModal from './GiftModal.tsx';
import { Workshop } from "../../../types/workshop.ts";
import { useAuthStore } from "../../../store/authStore";

export default function Workshops() {
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const { data } = await api.get('/workshops');
                setWorkshops(data);
            } catch (err) {
                console.error("Erreur d'extraction du Registre :", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    const sortedWorkshops = useMemo(() => {
        return [...workshops].sort((a, b) => a.level - b.level);
    }, [workshops]);

    const discoveryWorkshop = sortedWorkshops.find(w => w.level === 0);
    const conceptionWorkshops = sortedWorkshops.filter(w => w.level > 0);

    if (loading) return (
        <div className="py-20 text-center text-rhum-gold font-serif uppercase tracking-[0.3em] text-[10px] font-black italic">
            Synchronisation du Registre Cursus...
        </div>
    );

    return (
        <section id="workshops" className="py-16 md:py-32 bg-[#0a1a14] px-4 md:px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-16 md:mb-24">
                    <h2 className="text-rhum-gold tracking-[0.4em] uppercase text-xs mb-4 font-black">
                        Nos Prestations
                    </h2>
                    <h3 className="text-4xl md:text-7xl font-serif text-white uppercase tracking-tighter">
                        Le Registre des Ateliers
                    </h3>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 items-stretch">
                    {/* 🏺 Carte Découverte (Niveau 0) */}
                    {discoveryWorkshop && (
                        <WorkshopCard workshop={discoveryWorkshop} />
                    )}

                    {/* 🏺 Cartes Conception (Niveaux 1-4) */}
                    <ConceptionCard workshops={conceptionWorkshops} />
                </div>

                {/* Bannières de transition */}
                <div className="mt-24 space-y-20">
                    <ShopBanner />
                    <GiftBanner onOpenModal={() => setIsGiftModalOpen(true)} />
                </div>

                <AnimatePresence>
                    {isGiftModalOpen && (
                        <GiftModal
                            onClose={() => setIsGiftModalOpen(false)}
                            onConfirm={(amount) => {/* Logique d'ajout de carte cadeau */}}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}