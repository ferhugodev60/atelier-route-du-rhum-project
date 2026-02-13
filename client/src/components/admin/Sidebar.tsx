import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, GraduationCap, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Sidebar() {
    const { logout } = useAuthStore();

    const navItems = [
        { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Boutique', path: '/admin/boutique', icon: ShoppingBag },
        { name: 'Formations', path: '/admin/formations', icon: GraduationCap },
    ];

    return (
        <aside className="w-64 h-screen bg-[#0a1a14] border-r border-rhum-gold/10 flex flex-col sticky top-0">
            <header className="p-8 border-b border-rhum-gold/5">
                <h1 className="text-rhum-gold font-serif text-xl uppercase tracking-tighter">Console Admin</h1>
                <p className="text-[8px] text-rhum-gold/40 uppercase tracking-[0.3em] mt-2">Gestion d'Établissement</p>
            </header>

            <nav className="flex-1 p-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all
                            ${isActive
                            ? 'bg-rhum-gold text-rhum-green shadow-lg shadow-rhum-gold/10'
                            : 'text-rhum-gold/50 hover:text-white hover:bg-white/5'}
                        `}
                    >
                        <item.icon size={16} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <footer className="p-6 border-t border-rhum-gold/5">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 px-4 py-3 w-full text-[10px] uppercase tracking-widest font-bold text-red-400/60 hover:text-red-400 transition-colors"
                >
                    <LogOut size={16} />
                    Déconnexion
                </button>
            </footer>
        </aside>
    );
}