import React from 'react';
import logo from '../assets/logo/logo.png';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Overlay avec flou artistique */}
            <div className="absolute inset-0 bg-rhum-green/80 backdrop-blur-md" onClick={onClose}></div>

            {/* Carte du Formulaire */}
            <div className="relative bg-rhum-green border border-rhum-gold/30 p-8 md:p-12 w-full max-w-md shadow-2xl animate-fadeIn">
                <button onClick={onClose} className="absolute top-4 right-4 text-rhum-gold hover:text-white transition-colors">
                    ✕
                </button>

                <div className="text-center mb-10">
                    <img src={logo} alt="Logo" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-white italic">Accéder à l'Antre</h2>
                    <p className="text-rhum-gold/60 text-xs uppercase tracking-widest mt-2">Espace Alchimiste</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-rhum-gold mb-2 font-bold">Identifiant</label>
                        <input
                            type="email"
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-rhum-cream focus:border-rhum-gold outline-none transition-all font-sans"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-rhum-gold mb-2 font-bold">Grimoire Secret</label>
                        <input
                            type="password"
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-rhum-cream focus:border-rhum-gold outline-none transition-all font-sans"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-rhum-gold/50">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-rhum-gold">
                            <input type="checkbox" className="accent-rhum-gold" /> Se souvenir
                        </label>
                        <a href="#" className="hover:text-rhum-gold transition-colors">Oublié ?</a>
                    </div>

                    <button className="w-full bg-rhum-gold text-rhum-green py-4 font-bold uppercase tracking-[0.3em] text-sm hover:bg-white transition-all shadow-lg shadow-rhum-gold/10">
                        Entrer dans l'Atelier
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-rhum-gold/10 pt-6">
                    <p className="text-xs text-rhum-cream/40 uppercase tracking-widest">
                        Pas encore membre ? <a href="#" className="text-rhum-gold hover:underline">Rejoignez la guilde</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;