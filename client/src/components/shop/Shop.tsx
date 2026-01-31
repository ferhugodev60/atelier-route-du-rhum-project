import { useState, useMemo, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { Product, ProductVolume } from '../../types/shop';
import ShopFilters from './ShopFilters.tsx';
import ProductCard from './ProductCard.tsx';

export default function Shop() {
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCat, setActiveCat] = useState<string>("TOUS");
    const [sortBy, setSortBy] = useState<string>("default");
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 🏺 Chargement des données réelles
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/shop/products');
                setProducts(data);
            } catch (error) {
                console.error("Erreur lors de la récupération de la cave :", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const displayedProducts = useMemo(() => {
        let filtered = activeCat === "TOUS"
            ? products
            : products.filter((p) => p.category.name === activeCat);

        if (sortBy === "asc") {
            filtered = [...filtered].sort((a, b) => a.volumes[0].price - b.volumes[0].price);
        } else if (sortBy === "desc") {
            filtered = [...filtered].sort((a, b) => b.volumes[0].price - a.volumes[0].price);
        }

        return filtered;
    }, [activeCat, sortBy, products]);

    const handleAddToCart = (product: Product, volume: ProductVolume, qty: number) => {
        console.log("🛒 Panier :", {
            productId: product.id,
            volumeId: volume.id,
            name: `${product.name} (${volume.size}${volume.unit})`,
            price: volume.price,
            quantity: qty
        });
        // Ici, tu appelleras ta fonction dispatch du panier (CartContext ou Store)
    };

    if (isLoading) return <div className="min-h-screen bg-[#06110d] flex items-center justify-center text-rhum-gold font-serif italic">Chauffage de l'alambic...</div>;

    return (
        <section className="py-20 px-4 md:px-10 bg-[#06110d] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <ShopFilters
                    activeCat={activeCat}
                    onCatChange={setActiveCat}
                    onSortChange={setSortBy}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {displayedProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isSelected={selectedProductId === product.id}
                            onToggleSelect={() => setSelectedProductId(selectedProductId === product.id ? null : product.id)}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>

                {displayedProducts.length === 0 && (
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