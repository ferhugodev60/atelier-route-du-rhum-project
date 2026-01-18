import { useState, useMemo } from 'react';
// Correction du chemin (TS2307) : on remonte de 2 niveaux seulement
import { BOTTLES, Bottle } from '../../data/bottles';
import ShopFilters from './ShopFilters';
import ProductCard from './ProductCard';

export default function Shop() {
    // On initialise sur "TOUS" pour ne pas avoir une page vide au départ
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortBy, setSortBy] = useState<string>("default");
    const [selectedBottleId, setSelectedBottleId] = useState<number | null>(null);

    // LOGIQUE DE FILTRAGE
    const displayedBottles = useMemo(() => {
        // Si "TOUS", on prend tout, sinon on filtre par catégorie strictement
        let filtered = activeCat === "TOUS"
            ? BOTTLES
            : BOTTLES.filter((bottle: Bottle) => bottle.category === activeCat);

        // Tri par prix
        if (sortBy === "asc") {
            filtered = [...filtered].sort((a: Bottle, b: Bottle) => a.availableSizes[0].price - b.availableSizes[0].price);
        } else if (sortBy === "desc") {
            filtered = [...filtered].sort((a: Bottle, b: Bottle) => b.availableSizes[0].price - a.availableSizes[0].price);
        }

        return filtered;
    }, [activeCat, sortBy]);

    return (
        <section className="py-20 px-4 md:px-10 bg-[#06110d] min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* On passe activeCat et sa fonction de modification */}
                <ShopFilters
                    activeCat={activeCat}
                    onCatChange={setActiveCat}
                    onSortChange={setSortBy}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {displayedBottles.map((bottle: Bottle) => (
                        <ProductCard
                            key={bottle.id}
                            bottle={bottle}
                            isSelected={selectedBottleId === bottle.id}
                            onToggleSelect={() => setSelectedBottleId(selectedBottleId === bottle.id ? null : bottle.id)}
                            onAddToCart={(item) => console.log("Ajout :", item)}
                        />
                    ))}
                </div>

                {/* Message de secours si aucun résultat */}
                {displayedBottles.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="font-serif italic text-rhum-cream/30 text-xl font-light">
                            Cet élixir est en cours de macération...
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}