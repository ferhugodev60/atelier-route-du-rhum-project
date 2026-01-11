import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Workshops from './components/Workshops';
import WorkshopMenu from './components/WorkshopMenu';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-rhum-cream font-sans">
            <Navbar />
            <main>
                <section id="home"><Hero /></section>

                <ScrollReveal>
                    <section id="about"><About /></section>
                </ScrollReveal>

                <ScrollReveal>
                    <section id="workshops"><Workshops /></section>
                </ScrollReveal>

                <ScrollReveal>
                    <section id="testimonials"><Testimonials /></section>
                </ScrollReveal>

                <ScrollReveal>
                    <section id="contact"><Contact /></section>
                </ScrollReveal>
            </main>
            <Footer />
        </div>
    );
};

export default App;