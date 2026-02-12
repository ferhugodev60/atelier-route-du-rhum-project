import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';
import CartDrawer from './components/shop/CartDrawer.tsx';
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal'; // 🏺 Import scellé

const ShopPage = lazy(() => import('./pages/ShopPage.tsx'));

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero.tsx')),
    About: lazy(() => import('./components/sections/About.tsx')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials.tsx')),
    Contact: lazy(() => import('./components/sections/Contact.tsx')),
};

function HomePage({ onAddToCart }: { onAddToCart: (product: any, detail: any, qty: number) => void }) {
    return (
        <main>
            <section id="home"><Sections.Hero /></section>
            <section id="about"><ScrollReveal><Sections.About /></ScrollReveal></section>
            <section id="workshops">
                <ScrollReveal>
                    <Sections.Workshops onAddToCart={(ws: any, q: number) => onAddToCart(null, ws, q)} />
                </ScrollReveal>
            </section>
            <section id="testimonials"><ScrollReveal><Sections.Testimonials /></ScrollReveal></section>
            <section id="contact"><ScrollReveal><Sections.Contact /></ScrollReveal></section>
        </main>
    );
}

export default function App() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>(() => {
        const saved = localStorage.getItem('atelier_cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: any, detail: any, qty: number) => {
        const uniqueId = detail.cartId || detail.id;
        setCartItems(prev => {
            const existing = prev.find(i => i.cartId === uniqueId);
            if (existing) {
                return prev.map(i => i.cartId === uniqueId
                    ? { ...i, quantity: i.quantity + qty }
                    : i
                );
            }
            return [...prev, {
                cartId: uniqueId,
                name: product ? `${product.name} (${detail.size}${detail.unit})` : (detail.name || detail.title),
                price: detail.price,
                image: product?.image || detail.image,
                quantity: qty,
                workshopId: !product ? (detail.workshopId || detail.id) : undefined,
                volumeId: product ? detail.id : undefined,
                level: detail.level,
                participants: detail.participants
            }];
        });
        setIsCartOpen(true);
    };

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0a1a14] font-sans text-rhum-cream">
                <Navbar
                    cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                    onOpenCart={() => setIsCartOpen(true)}
                />

                <Suspense fallback={<div className="h-screen bg-[#0a1a14]" />}>
                    <Routes>
                        <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
                        <Route path="/boutique" element={<ShopPage onAddToCart={addToCart} />} />
                        <Route path="/mon-compte" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
                    </Routes>
                </Suspense>

                {/* 🏺 LES DEUX VERROUS D'ACCÈS */}
                <LoginModal />
                <RegisterModal />

                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setIsCartOpen(false)}
                    items={cartItems}
                    onRemove={(cartId) => setCartItems(prev => prev.filter(i => i.cartId !== cartId))}
                />
                <Footer />
            </div>
        </BrowserRouter>
    );
}