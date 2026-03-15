import { useState, useEffect, useMemo } from 'react';
import api from '../../../api/axiosInstance';
import WorkshopCard from './WorkshopCard.tsx';
import ConceptionCard from './ConceptionCard.tsx';
import ShopBanner from './ShopBanner.tsx';
import GiftBanner from './GiftBanner.tsx';
import { Workshop } from "../../../types/workshop.ts";

export default function Workshops() {
    // 🏺 Rectification du nom de la fonction (setWorkshops au lieu de setSetWorkshops)
    const [workshops, setWorkshops] = useState<Workshop[]>([]);
    const [loading, setLoading] = useState(true);

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
                    {discoveryWorkshop && <WorkshopCard workshop={discoveryWorkshop} />}
                    <ConceptionCard workshops={conceptionWorkshops} />
                </div>

                <div className="mt-24 space-y-20">
                    <ShopBanner />
                    <GiftBanner />
                </div>
            </div>
        </section>
    );
}