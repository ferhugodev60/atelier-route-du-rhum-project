import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';
import CartDrawer from './components/shop/CartDrawer';

const ShopPage = lazy(() => import('./pages/ShopPage'));

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero')),
    About: lazy(() => import('./components/sections/About')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials')),
    Contact: lazy(() => import('./components/sections/Contact')),
};

function HomePage({ onAddToCart }: { onAddToCart: (item: any, qty: number) => void }) {
    return (
        <main>
            <section id="home"><Sections.Hero /></section>
            <section id="about"><ScrollReveal><Sections.About /></ScrollReveal></section>
            <section id="workshops">
                <ScrollReveal>
                    <Sections.Workshops onAddToCart={onAddToCart} />
                </ScrollReveal>
            </section>
            <section id="testimonials"><ScrollReveal><Sections.Testimonials /></ScrollReveal></section>
            <section id="contact"><ScrollReveal><Sections.Contact /></ScrollReveal></section>
        </main>
    );
}

export default function App() {
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('atelier_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    /**
     * Nettoie les prix entrants pour éviter le NaN
     * Extrait uniquement les chiffres d'une chaîne (ex: "60€" -> 60)
     */
    const cleanPrice = (p: any): number => {
        if (typeof p === 'number') return p;
        const numeric = String(p).replace(/[^0-9]/g, '');
        return parseInt(numeric) || 0;
    };

    const addToCart = (item: any, qty?: number) => {
        const quantityToAdd = Number(qty ?? item.quantity ?? 1);
        const price = cleanPrice(item.price || item.totalPrice);

        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id
                    ? { ...i, quantity: i.quantity + quantityToAdd, price }
                    : i
                );
            }
            return [...prev, { ...item, price, quantity: quantityToAdd }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-rhum-cream font-sans text-rhum-green">
                <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

                <Suspense fallback={<div className="h-screen bg-rhum-cream" aria-hidden="true" />}>
                    <Routes>
                        <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
                        <Route path="/boutique" element={<ShopPage onAddToCart={addToCart} />} />
                    </Routes>
                </Suspense>

                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    items={cartItems}
                    onRemove={removeFromCart}
                />

                <Footer />
            </div>
        </BrowserRouter>
    );
}