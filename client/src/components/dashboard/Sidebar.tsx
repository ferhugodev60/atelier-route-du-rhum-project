type ViewType = 'orders' | 'security' | 'profile';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
    const menuItems = [
        { id: 'orders', label: 'Registre des commandes' },
        { id: 'security', label: 'Mot de passe oublié ?' },
        { id: 'profile', label: 'Profil' },
    ];

    return (
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-16 font-sans">
            <nav className="flex lg:flex-col p-1 bg-white/[0.02] lg:bg-transparent rounded-sm gap-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as ViewType)}
                        className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-4 px-6 py-5 text-[10px] uppercase tracking-[0.25em] font-black transition-all rounded-sm border-l-2 ${
                            activeView === item.id
                                ? 'text-rhum-gold border-rhum-gold bg-white/[0.06] shadow-lg shadow-black/20'
                                : 'text-white/40 border-transparent hover:text-white/70 hover:bg-white/[0.02]'
                        }`}
                    >
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <button
                onClick={onLogout}
                className="hidden lg:flex items-center gap-5 px-6 py-5 text-[10px] uppercase tracking-[0.3em] font-black group transition-all border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 rounded-sm"
            >
                <LogoutIcon className="w-4 h-4 text-red-500/60 group-hover:text-red-500 transition-colors" />
                <span className="text-red-500/60 group-hover:text-red-500 transition-colors">Déconnexion</span>
            </button>
        </aside>
    );
}

/**
 * 🏺 Définition du composant LogoutIcon pour résoudre l'erreur TS2304
 */
export function LogoutIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={className}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
        </svg>
    );
}