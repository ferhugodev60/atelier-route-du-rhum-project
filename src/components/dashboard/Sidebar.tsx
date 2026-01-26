type ViewType = 'orders' | 'security' | 'profile';

interface SidebarProps {
    activeView: ViewType;
    onViewChange: (view: ViewType) => void;
    onLogout: () => void;
}

export default function Sidebar({ activeView, onViewChange, onLogout }: SidebarProps) {
    const menuItems = [
        { id: 'orders', label: 'Mes commandes' },
        { id: 'security', label: 'Sécurité' },
        { id: 'profile', label: 'Mon profil' },
    ];

    return (
        <aside className="w-full lg:w-72 shrink-0">
            <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as ViewType)}
                        className={`flex items-center gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold transition-all border-l-2 whitespace-nowrap ${
                            activeView === item.id ? 'text-rhum-gold border-rhum-gold bg-white/[0.03]' : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                    >
                        <span className="text-sm">{item.icon}</span>{item.label}
                    </button>
                ))}
                <button onClick={onLogout} className="mt-4 lg:mt-12 text-left px-6 py-4 text-[10px] uppercase tracking-widest text-red-500/40 hover:text-red-500 transition-colors font-black">
                    Déconnexion
                </button>
            </nav>
        </aside>
    );
}