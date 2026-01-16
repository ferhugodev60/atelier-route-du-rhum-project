import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';
import CartDrawer from './components/shop/CartDrawer';
import { Bottle } from './data/bottles';

const ShopPage = lazy(() => import('./pages/ShopPage'));

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero')),
    About: lazy(() => import('./components/sections/About')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials')),
    Contact: lazy(() => import('./components/sections/Contact')),
};

function HomePage() {
    return (
        <main>
            <section id="home"><Sections.Hero /></section>
            <section id="about"><ScrollReveal><Sections.About /></ScrollReveal></section>
            <section id="workshops"><ScrollReveal><Sections.Workshops /></ScrollReveal></section>
            <section id="testimonials"><ScrollReveal><Sections.Testimonials /></ScrollReveal></section>
            <section id="contact"><ScrollReveal><Sections.Contact /></ScrollReveal></section>
        </main>
    );
}

export default function App() {
    // --- INITIALISATION DU PANIER DEPUIS LE LOCALSTORAGE ---
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('atelier_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    // --- SAUVEGARDE AUTOMATIQUE DU PANIER ---
    useEffect(() => {
        localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (bottle: Bottle, qty: number) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === bottle.id);
            if (existing) {
                return prev.map(item => item.id === bottle.id ? { ...item, quantity: item.quantity + qty } : item);
            }
            return [...prev, { ...bottle, quantity: qty }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-rhum-cream font-sans text-rhum-green">
                <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />

                <Suspense fallback={<div className="h-screen bg-rhum-cream" aria-hidden="true" />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
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