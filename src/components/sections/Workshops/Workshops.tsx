import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WorkshopCard from './WorkshopCard';
import ConceptionCard from './ConceptionCard';
import ShopBanner from './ShopBanner';
import {WorkshopDetail} from "../../../data/workshops.ts";
import WorkshopModal from "./WorkshopModal.tsx";

export default function Workshops() {
    const [activeDetail, setActiveDetail] = useState<WorkshopDetail | null>(null);

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
                    <WorkshopCard />
                    <ConceptionCard onOpenDetail={setActiveDetail} />
                </div>

                <ShopBanner />

                <AnimatePresence>
                    {activeDetail && (
                        <WorkshopModal
                            detail={activeDetail}
                            onClose={() => setActiveDetail(null)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}