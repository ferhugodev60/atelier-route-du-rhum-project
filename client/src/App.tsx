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
import ToastContainer from "./components/ui/ToastContainer.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminWorkshops from "./pages/admin/AdminWorkshops.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminGiftCards from "./pages/admin/AdminGiftCards.tsx";
import TermsAndConditions from "./pages/TermsAndConditions.tsx";

// --- Imports (Lazy Loading) ---
const LegalMentions = lazy(() => import('./pages/LegalMentions.tsx'));
const ResetPassword = lazy(() => import('./pages/ResetPassword.tsx'));
const ValidationPage = lazy(() => import('./pages/ValidationPage.tsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBoutique = lazy(() => import('./pages/admin/AdminBoutique'));

const ShopPage = lazy(() => import('./pages/ShopPage.tsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.tsx'));
const AtelierConceptionPage = lazy(() => import('./pages/AtelierConceptionPage.tsx'));
const WorkshopDetails = lazy(() => import('./pages/WorkshopDetails.tsx'));

// 🏺 Nouveau : Page dédiée aux Titres au Porteur
const GiftCardPage = lazy(() => import('./pages/GiftCardPage.tsx'));

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero.tsx')),
    About: lazy(() => import('./components/sections/About.tsx')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials.tsx')),
    Contact: lazy(() => import('./components/sections/Contact.tsx')),
};

function HomePage() {
    // 🏺 Correction : Workshops utilise désormais le store en interne, plus besoin de props.
    return (
        <main>
            <section id="home"><Sections.Hero /></section>
            <section id="about"><ScrollReveal><Sections.About /></ScrollReveal></section>
            <section id="workshops">
                <ScrollReveal>
                    <Sections.Workshops />
                </ScrollReveal>
            </section>
            <section id="testimonials"><ScrollReveal><Sections.Testimonials /></ScrollReveal></section>
            <section id="contact"><ScrollReveal><Sections.Contact /></ScrollReveal></section>
        </main>
    );
}

export default function App() {
    const { items, isCartOpen, setCartOpen, removeItem } = useCartStore();

    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0a1a14] font-sans text-rhum-cream">

                {/* --- 🏺 NAVBAR --- */}
                <Routes>
                    <Route path="/admin/*" element={null} />
                    <Route path="/validate/*" element={null} />
                    <Route path="/reset-password/*" element={null} />
                    <Route
                        path="*"
                        element={
                            <Navbar
                                cartCount={items.reduce((sum, i) => sum + i.quantity, 0)}
                                onOpenCart={() => setCartOpen(true)}
                            />
                        }
                    />
                </Routes>

                <Suspense fallback={<div className="h-screen bg-[#0a1a14] flex items-center justify-center" />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />

                        {/* 🏺 Correction : ShopPage gère son propre état via Zustand */}
                        <Route path="/boutique" element={<ShopPage />} />
                        <Route path="/boutique/:id" element={<ProductPage />} />
                        <Route path="/mon-compte" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />

                        <Route path="/atelier-conception" element={<AtelierConceptionPage />} />
                        <Route path="/ateliers/:id" element={<WorkshopDetails />} />

                        {/* 🏺 Nouvelle Route : Fiche technique Carte Cadeau */}
                        <Route path="/carte-cadeau" element={<GiftCardPage />} />

                        <Route path="/mentions-legales" element={<LegalMentions />} />
                        <Route path="/cgv" element={<TermsAndConditions />} />
                        <Route path="/validate/:participantId" element={<ValidationPage />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* --- ROUTES ADMIN --- */}
                        <Route path="/admin" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="boutique" element={<AdminBoutique />} />
                            <Route path="categories" element={<AdminCategories />} />
                            <Route path="ateliers" element={<AdminWorkshops />} />
                            <Route path="customers" element={<AdminCustomers />} />
                            <Route path="orders" element={<AdminOrders />} />
                            <Route path="gift-cards" element={<AdminGiftCards />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>

                <ToastContainer />
                <LoginModal />
                <RegisterModal />
                <PaymentSuccess />
                <PaymentError />

                {/* --- 🏺 PANIER --- */}
                <Routes>
                    <Route path="/admin/*" element={null} />
                    <Route path="/validate/*" element={null} />
                    <Route path="/reset-password/*" element={null} />
                    <Route
                        path="*"
                        element={
                            <CartDrawer
                                isOpen={isCartOpen}
                                onClose={() => setCartOpen(false)}
                                items={items}
                                onRemove={removeItem}
                            />
                        }
                    />
                </Routes>

                {/* --- 🏺 FOOTER --- */}
                <Routes>
                    <Route path="/admin/*" element={null} />
                    <Route path="/validate/*" element={null} />
                    <Route path="/reset-password/*" element={null} />
                    <Route path="*" element={<Footer />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}