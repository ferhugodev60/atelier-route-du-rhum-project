import { NavLink } from 'react-router-dom';
import {LayoutDashboard, ShoppingBag, GraduationCap, LogOut, Tag, Users} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Logo from '../../assets/logo/logo.png';

export default function Sidebar() {
    const { logout } = useAuthStore();

    const navItems = [
        { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Boutique', path: '/admin/boutique', icon: ShoppingBag },
        { name: 'Catégories', path: '/admin/categories', icon: Tag },
        { name: 'Ateliers', path: '/admin/ateliers', icon: GraduationCap },
        { name: 'Clientèle', path: '/admin/customers', icon: Users }
    ];

    return (
        <aside className="w-64 h-screen bg-[#0a1a14] border-r border-rhum-gold/10 flex flex-col sticky top-0">
            {/* --- HEADER ÉPURÉ AVEC GRAND LOGO --- */}
            {/* Utilisation de flex, justify-center et items-center pour un centrage parfait */}
            <header className="py-10 border-b border-rhum-gold/5 flex justify-center items-center">
                <img
                    src={Logo}
                    alt="Logo de l'entreprise"
                    className="w-44 object-contain"
                />
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