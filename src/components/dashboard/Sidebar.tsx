type ViewType = 'orders' | 'security' | 'profile';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
    const menuItems = [
        { id: 'orders', label: 'Commandes' },
        { id: 'security', label: 'Sécurité' },
        { id: 'profile', label: 'Profil' },
    ];

    return (
        <aside className="w-full lg:w-64 shrink-0">
            {/* NAVIGATION MOBILE & DESKTOP COMBINÉE */}
            <nav className="flex lg:flex-col p-1 bg-white/[0.03] lg:bg-transparent rounded-lg lg:rounded-none gap-1 lg:gap-2">
                {menuItems.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as ViewType)}
                            className={`flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-4 py-3 lg:px-6 lg:py-4 text-[9px] lg:text-[10px] uppercase tracking-[0.2em] font-black transition-all rounded-md lg:rounded-sm border-b-2 lg:border-b-0 lg:border-l-2 ${
                                isActive
                                    ? 'text-rhum-gold border-rhum-gold bg-white/[0.05]'
                                    : 'text-white/20 border-transparent hover:text-white/40'
                            }`}
                        >
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <button
                onClick={onLogout}
                className="hidden lg:block mt-12 text-left px-6 py-4 text-[10px] uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors font-black"
            >
                Déconnexion
            </button>
        </aside>
    );
}