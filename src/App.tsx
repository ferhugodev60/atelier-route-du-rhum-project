import { Suspense, lazy } from 'react';
import { Navbar, Footer } from './components/layout';
import ScrollReveal from './components/animations/ScrollReveal.tsx';

const Sections = {
    Hero: lazy(() => import('./components/sections/Hero')),
    About: lazy(() => import('./components/sections/About')),
    Workshops: lazy(() => import('./components/sections/Workshops/Workshops.tsx')),
    Testimonials: lazy(() => import('./components/sections/Testimonials')),
    Contact: lazy(() => import('./components/sections/Contact')),
};

export default function App() {
    return (
        <div className="min-h-screen bg-rhum-cream font-sans text-rhum-green">
            <Navbar />

            <main>
                <Suspense fallback={<div className="h-screen bg-rhum-cream" aria-hidden="true" />}>

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

                </Suspense>
            </main>

            <Footer />
        </div>
    );
}