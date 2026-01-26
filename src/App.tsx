import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';
import CartDrawer from './components/shop/CartDrawer';
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx"; // Import du gardien

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
    const [user, setUser] = useState<{ name: string } | null>(() => {
        const savedUser = localStorage.getItem('atelier_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [cartItems, setCartItems] = useState<any[]>(() => {
        const savedCart = localStorage.getItem('atelier_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
        if (user) {
            localStorage.setItem('atelier_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('atelier_user');
        }
    }, [cartItems, user]);

    const handleLogin = (userData: { name: string }) => setUser(userData);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('atelier_user');
        // Redirection forcée pour nettoyer l'état de l'historique
        window.location.href = "/";
    };

    const addToCart = (item: any, qty?: number) => {
        const quantityToAdd = Number(qty ?? item.quantity ?? 1);
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantityToAdd } : i);
            }
            return [...prev, { ...item, quantity: quantityToAdd }];
        });
        setIsCartOpen(true);
    };

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-rhum-cream font-sans text-rhum-green">
                <Navbar
                    cartCount={cartCount}
                    onOpenCart={() => setIsCartOpen(true)}
                    user={user}
                    onLoginSuccess={handleLogin}
                    onLogout={handleLogout}
                />

                <Suspense fallback={<div className="h-screen bg-rhum-cream" aria-hidden="true" />}>
                    <Routes>
                        <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
                        <Route path="/boutique" element={<ShopPage onAddToCart={addToCart} />} />

                        {/* PROTECTION DE LA ROUTE */}
                        <Route
                            path="/mon-compte"
                            element={
                                <ProtectedRoute user={user}>
                                    <CustomerDashboard onLogout={handleLogout} />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Suspense>

                <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} />
                <Footer />
            </div>
        </BrowserRouter>
    );
}