import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';

const ShopPage = lazy(() => import('./pages/ShopPage'));

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero')),
    About: lazy(() => import('./components/sections/About')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials')),
    Contact: lazy(() => import('./components/sections/Contact')),
};

// On crée un composant pour regrouper les sections de la page d'accueil
function HomePage() {
    return (
        <main>
            <section id="home">
                <Sections.Hero />
            </section>

            <section id="about">
                <ScrollReveal><Sections.About /></ScrollReveal>
            </section>

            <section id="workshops">
                <ScrollReveal><Sections.Workshops /></ScrollReveal>
            </section>

            <section id="testimonials">
                <ScrollReveal><Sections.Testimonials /></ScrollReveal>
            </section>

            <section id="contact">
                <ScrollReveal><Sections.Contact /></ScrollReveal>
            </section>
        </main>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-rhum-cream font-sans text-rhum-green">
                <Navbar />

                <Suspense fallback={<div className="h-screen bg-rhum-cream" aria-hidden="true" />}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />

                        <Route path="/boutique" element={<ShopPage />} />
                    </Routes>
                </Suspense>

                <Footer />
            </div>
        </BrowserRouter>
    );
}