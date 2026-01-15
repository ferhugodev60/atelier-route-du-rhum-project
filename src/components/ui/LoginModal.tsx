import { useLogin } from '../../hooks/useAuth';
import logo from '../../assets/logo/logo.png';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { state, formAction, isPending } = useLogin();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-rhum-green/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Carte */}
            <div className="relative bg-rhum-green border border-rhum-gold/30 p-8 md:p-12 w-full max-w-md shadow-2xl animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-rhum-gold hover:text-white transition-colors"
                    aria-label="Fermer"
                >
                    ✕
                </button>

                <header className="text-center mb-10">
                    <img src={logo} alt="Logo L'Atelier" className="h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-serif text-white italic">Accéder à l'Antre</h2>
                    <p className="text-rhum-gold/60 text-xs uppercase tracking-widest mt-2">Espace Alchimiste</p>
                </header>

                {/* Utilisation de la prop 'action' (React 19) */}
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-xs uppercase tracking-[0.2em] text-rhum-gold font-bold">
                            Identifiant
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-rhum-cream focus:border-rhum-gold outline-none transition-all"
                            placeholder="votre@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-rhum-gold font-bold">
                            Grimoire Secret
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full bg-transparent border-b border-rhum-gold/20 py-3 px-2 text-rhum-cream focus:border-rhum-gold outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && <p className="text-red-400 text-[10px] uppercase text-center">{state.error}</p>}

                    <button
                        disabled={isPending}
                        className="w-full bg-rhum-gold text-rhum-green py-4 font-bold uppercase tracking-[0.3em] text-sm hover:bg-white disabled:opacity-50 transition-all shadow-lg shadow-rhum-gold/10"
                    >
                        {isPending ? 'Incision en cours...' : "Entrer dans l'Atelier"}
                    </button>
                </form>

                <footer className="mt-8 text-center border-t border-rhum-gold/10 pt-6">
                    <p className="text-xs text-rhum-cream/40 uppercase tracking-widest">
                        Pas encore membre ? <a href="#" className="text-rhum-gold hover:underline">Rejoignez la guilde</a>
                    </p>
                </footer>
            </div>
        </div>
    );
}