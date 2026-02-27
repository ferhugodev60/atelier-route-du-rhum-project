import { Link, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    GraduationCap,
    LogOut,
    Tag,
    Users,
    ClipboardList,
    Home,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../../assets/logo/logo.png';

export default function Sidebar() {
    const { logout } = useAuthStore();

    const navItems = [
        { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Boutique', path: '/admin/boutique', icon: ShoppingBag },
        { name: 'Gestion Collections', path: '/admin/categories', icon: Tag },
        { name: 'Ateliers', path: '/admin/ateliers', icon: GraduationCap },
        { name: 'Commandes', path: '/admin/orders', icon: ClipboardList },
        { name: 'Clientèle', path: '/admin/customers', icon: Users }
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col sticky top-0 font-sans shadow-sm">
            {/* --- HEADER INSTITUTIONNEL ÉPURÉ --- */}
            <header className="py-8 px-6 flex flex-col items-center gap-6 border-b border-gray-100 bg-gray-50/50">
                <img
                    src={Logo}
                    alt="Logo institutionnel"
                    className="w-36 opacity-90"
                />

                <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-500 text-[9px] uppercase tracking-widest font-bold hover:text-emerald-600 hover:border-emerald-200 transition-all rounded bg-white"
                >
                    <Home size={12} />
                    Accueil
                </Link>
            </header>

            {/* --- NAVIGATION LOGICIELLE (Vert émeraude) --- */}
            <nav className="flex-1 px-4 py-8 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-wider font-semibold rounded-md transition-all
                            ${isActive
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                            : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon
                                    size={18}
                                    className={isActive ? 'text-white' : 'text-gray-400'}
                                />
                                <span>{item.name}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* --- FOOTER SÉCURITÉ --- */}
            <footer className="p-4 border-t border-gray-100 bg-gray-50/30">
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-3 px-4 py-3 w-full text-[11px] uppercase tracking-wider font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all group"
                >
                    {/* 🏺 L'icône et le texte sont maintenant centrés grâce à justify-center */}
                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    <span>Déconnexion</span>
                </button>
            </footer>
        </aside>
    );
}