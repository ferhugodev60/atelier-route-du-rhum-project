import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';
import CartDrawer from './components/shop/CartDrawer.tsx';
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import PaymentSuccess from "./components/shop/PaymentSuccess.tsx";
import PaymentError from "./components/shop/PaymentError.tsx";
import { useCartStore } from './store/cartStore';
import ToastContainer from "./components/ui/ToastContainer.tsx"; // 🏺 On branche le store

const ShopPage = lazy(() => import('./pages/ShopPage.tsx'));
const Sections = {
    Hero: lazy(() => import('./components/sections/Hero.tsx')),
    About: lazy(() => import('./components/sections/About.tsx')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials.tsx')),
    Contact: lazy(() => import('./components/sections/Contact.tsx')),
};

function HomePage() {
    const addItem = useCartStore(state => state.addItem);
    return (
        <main>
            <section id="home"><Sections.Hero /></section>
            <section id="about"><ScrollReveal><Sections.About /></ScrollReveal></section>
            <section id="workshops">
                <ScrollReveal>
                    <Sections.Workshops onAddToCart={(ws: any, q: number) => addItem(null, ws, q)} />
                </ScrollReveal>
            </section>
            <section id="testimonials"><ScrollReveal><Sections.Testimonials /></ScrollReveal></section>
            <section id="contact"><ScrollReveal><Sections.Contact /></ScrollReveal></section>
        </main>
    );
}

export default function App() {
    const { items, isCartOpen, setCartOpen, removeItem, addItem } = useCartStore();

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0a1a14] font-sans text-rhum-cream">
                <Navbar
                    cartCount={items.reduce((sum, i) => sum + i.quantity, 0)}
                    onOpenCart={() => setCartOpen(true)}
                />

                <Suspense fallback={<div className="h-screen bg-[#0a1a14]" />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/boutique" element={<ShopPage onAddToCart={addItem} />} />
                        <Route path="/mon-compte" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
                    </Routes>
                </Suspense>

                <ToastContainer />
                <LoginModal />
                <RegisterModal />
                <PaymentSuccess />
                <PaymentError />

                <CartDrawer
                    isOpen={isCartOpen}
                    onClose={() => setCartOpen(false)}
                    items={items}
                    onRemove={removeItem}
                />
                <Footer />
            </div>
        </BrowserRouter>
    );
}